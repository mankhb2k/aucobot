"use client";

import * as Label from "@radix-ui/react-label";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { useId, useRef } from "react";

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length: number;
  label: string;
  getDigitAriaLabel: (index: number, total: number) => string;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  showLabel?: boolean;
}

const digitClassName =
  "h-12 w-11 rounded-md border border-border bg-white text-center text-lg text-text outline-none transition-[border-color,box-shadow] focus:border-primary focus:ring-2 focus:ring-primary/25 disabled:cursor-not-allowed disabled:opacity-60";

export function OtpInput({
  value,
  onChange,
  length,
  label,
  getDigitAriaLabel,
  onComplete,
  disabled,
  className,
  showLabel = false,
}: OtpInputProps) {
  const labelId = useId();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const digits = Array.from({ length }, (_, index) => value[index] ?? "");
  const slots = Array.from({ length }, (_, index) => index);

  function commitValue(next: string) {
    onChange(next);

    if (next.length === length) {
      onComplete?.(next);
    }
  }

  function updateAt(index: number, nextChar: string) {
    const chars = digits.slice();
    chars[index] = nextChar;
    commitValue(chars.join("").slice(0, length));
  }

  function handleChange(index: number, nextValue: string) {
    const digit = nextValue.replace(/\D/g, "").slice(-1);
    updateAt(index, digit);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, key: string) {
    if (key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();
    const pasted = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);
    commitValue(pasted);

    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
  }

  const labelNode = (
    <Label.Root
      id={labelId}
      className={
        showLabel
          ? "mb-2 block text-center text-sm text-description"
          : undefined
      }
    >
      {label}
    </Label.Root>
  );

  return (
    <div className={className}>
      {showLabel ? (
        labelNode
      ) : (
        <VisuallyHidden.Root asChild>{labelNode}</VisuallyHidden.Root>
      )}
      <div className="flex justify-center gap-2" role="group" aria-labelledby={labelId}>
        {slots.map((index) => (
          <input
            key={index}
            ref={(el) => {
              inputsRef.current[index] = el;
            }}
            className={digitClassName}
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            value={digits[index]}
            disabled={disabled}
            aria-label={getDigitAriaLabel(index, length)}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e.key)}
            onPaste={handlePaste}
          />
        ))}
      </div>
    </div>
  );
}
