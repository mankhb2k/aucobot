import React from "react";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  disabled?: boolean;
}

export const Switch: React.FC<SwitchProps> = ({
  checked,
  onCheckedChange,
  className = "",
  disabled = false,
}) => {
  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent click triggers (e.g., when placed inside a dropdown item)
    if (disabled) return;
    if (onCheckedChange) {
      onCheckedChange(!checked);
    }
  };

  return (
    <div
      onClick={handleToggle}
      className={`w-9 h-5 rounded-full relative transition-colors duration-200 cursor-pointer flex-shrink-0 ${
        checked ? "bg-[#3390ec]" : "bg-gray-200"
      } ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
    >
      <div
        className={`absolute top-[3px] w-[14px] h-[14px] bg-white rounded-full shadow-sm transition-transform duration-200 ${
          checked ? "left-[19px]" : "left-[3px]"
        }`}
      />
    </div>
  );
};
