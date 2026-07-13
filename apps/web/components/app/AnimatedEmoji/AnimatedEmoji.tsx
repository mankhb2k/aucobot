import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import { getWebpDuration } from "@/lib/telegramUtils";

interface AnimatedEmojiProps {
  src: string;
  alt: string;
  className?: string;
}

export const AnimatedEmoji: React.FC<AnimatedEmojiProps> = ({
  src,
  alt,
  className,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState<number | null>(null);
  const [key, setKey] = useState(0);
  const [frozenSrc, setFrozenSrc] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<number | null>(null);
  const playedOnceRef = useRef(false);

  // Parse duration of WebP animation
  useEffect(() => {
    let active = true;
    getWebpDuration(src)
      .then((dur) => {
        if (active) {
          setDuration(dur > 0 ? dur : 1000); // Fallback to 1s if static/0
        }
      })
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error("Failed to parse webp duration:", err);
        if (active) setDuration(1000);
      });
    return () => {
      active = false;
    };
  }, [src]);

  // Observe intersection to trigger play on visibility
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    return () => observer.disconnect();
  }, [src]);

  // When visibility and duration are both ready, trigger the first play
  useEffect(() => {
    if (isVisible && duration !== null && !playedOnceRef.current) {
      playedOnceRef.current = true;
      setIsPlaying(true);
      setKey((prev) => prev + 1); // Increment key to force reload and play from frame 0
    }
  }, [isVisible, duration]);

  const freezeFrame = () => {
    const img = imgRef.current;
    const canvas = canvasRef.current;
    if (img && canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        canvas.width = img.naturalWidth || img.clientWidth || 56;
        canvas.height = img.naturalHeight || img.clientHeight || 56;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        try {
          const dataUrl = canvas.toDataURL("image/webp");
          setFrozenSrc(dataUrl);
        } catch (e) {
          // eslint-disable-next-line no-console
          console.warn("Could not capture webp frame:", e);
        }
        setIsPlaying(false);
      }
    }
  };

  const handleImageLoad = () => {
    if (isPlaying) {
      // The playing animation image loaded, start the timer to freeze at the end
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      if (duration !== null) {
        timerRef.current = window.setTimeout(() => {
          freezeFrame();
        }, duration);
      }
    } else {
      // Initial load of the static frame
      if (!playedOnceRef.current && !frozenSrc) {
        freezeFrame();
      }
    }
  };

  const handleRestart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (duration === null) return;

    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    
    // Switch to playing state and change key to force fresh render/restart
    setIsPlaying(true);
    setKey((prev) => prev + 1);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      onClick={handleRestart}
      className={`relative cursor-pointer select-none ${className || ""}`}
      style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}
    >
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Playing state: actual animated WebP image (hidden when paused) */}
      <Image
        ref={imgRef}
        key={key}
        src={`${src}?play=${key}`}
        alt={alt}
        onLoad={handleImageLoad}
        fill
        unoptimized
        className={`${className || ""} ${isPlaying ? "opacity-100 block" : "opacity-0 absolute pointer-events-none"}`}
      />

      {/* Paused state: frozen frame or first frame */}
      {!isPlaying && (
        <Image
          src={frozenSrc || src}
          alt={alt}
          fill
          unoptimized
          className={className || ""}
        />
      )}
    </div>
  );
};
