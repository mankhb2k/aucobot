import { Ghost } from "lucide-react";
import Image from "next/image";
import React from "react";

import {
  isDeletedAvatarBg,
  resolveAvatarBackground,
  type AvatarGradient,
} from "./avatar-gradients";

export type { AvatarGradient };
export { avatarGradients, AVATAR_GRADIENT_KEYS } from "./avatar-gradients";

export interface AvatarProps {
  src?: string;
  alt?: string;
  text?: string;
  /** Gradient preset key (`blue`), legacy token (`bg-avatar-blue`), or custom Tailwind classes. */
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
  bg = "gray",
  size = "md",
  showOnlineStatus = false,
  className = "",
  onClick,
}) => {
  // Map size prop to specific dimensions and text sizes
  const sizeClasses = {
    sm: "w-[38px] h-[38px] text-[15px]",
    md: "w-[48px] h-[48px] text-md",
    lg: "w-[100px] h-[100px] text-3xl",
  };

  const ghostSizeClasses = {
    sm: "size-[18px]",
    md: "size-5",
    lg: "size-10",
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
      ) : isDeletedAvatarBg(bg) ? (
        <div
          className={`w-full h-full rounded-full flex items-center justify-center ${resolveAvatarBackground(bg)}`}
        >
          <Ghost
            className={`${ghostSizeClasses[size]} text-white`}
            strokeWidth={2.2}
            aria-hidden
          />
        </div>
      ) : (
        <div
          className={`w-full h-full rounded-full flex items-center justify-center font-bold text-white uppercase ${resolveAvatarBackground(bg)}`}
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
