import Image from "next/image";
import React from "react";

export interface AvatarProps {
  src?: string;
  alt?: string;
  text?: string;
  bg?: string;
  size?: "sm" | "md" | "lg";
  showOnlineStatus?: boolean;
  className?: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "",
  text = "",
  bg = "bg-gray-400",
  size = "md",
  showOnlineStatus = false,
  className = "",
  onClick,
}) => {
  // Map size prop to specific dimensions and text sizes
  const sizeClasses = {
    sm: "w-[38px] h-[38px] text-[15px]",
    md: "w-[48px] h-[48px] text-lg",
    lg: "w-[100px] h-[100px] text-3xl",
  };

  const containerClasses = `relative ${sizeClasses[size]} rounded-full flex-shrink-0 select-none ${
    onClick ? "cursor-pointer" : ""
  } ${className}`;

  return (
    <div className={containerClasses} onClick={onClick}>
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          unoptimized
          className="rounded-full object-cover"
        />
      ) : (
        <div
          className={`w-full h-full rounded-full flex items-center justify-center font-bold text-white uppercase ${bg}`}
        >
          {text}
        </div>
      )}

      {showOnlineStatus && (
        <div className="absolute bottom-0 right-0 w-[12px] h-[12px] bg-green border-2 border-white rounded-full" />
      )}
    </div>
  );
};
