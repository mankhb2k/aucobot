import * as Label from "@radix-ui/react-label";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { Search as SearchIcon, X } from "lucide-react";
import { useId, useRef } from "react";

import styles from "./Search.module.css";

interface SearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  onChangeValue: (value: string) => void;
  label: string;
  placeholder: string;
  clearAriaLabel: string;
  onClear?: () => void;
  showLabel?: boolean;
  iconStrokeWidth?: number;
}

const iconProps = (strokeWidth: number) => ({
  className: styles.searchIconSvg,
  strokeWidth,
});

export function Search({
  value,
  onChangeValue,
  label,
  placeholder,
  clearAriaLabel,
  onClear,
  className,
  showLabel = false,
  iconStrokeWidth = 2,
  id: idProp,
  ...props
}: SearchProps) {
  const generatedId = useId();
  const inputId = idProp ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    onChangeValue("");
    onClear?.();
    inputRef.current?.focus();
  };

  const labelNode = (
    <Label.Root
      htmlFor={inputId}
      className={showLabel ? styles.visibleLabel : undefined}
    >
      {label}
    </Label.Root>
  );

  return (
    <div className={[styles.searchWrapper, className].filter(Boolean).join(" ")}>
      {showLabel ? (
        labelNode
      ) : (
        <VisuallyHidden.Root asChild>{labelNode}</VisuallyHidden.Root>
      )}
      <span className={styles.searchIcon} aria-hidden="true">
        <SearchIcon {...iconProps(iconStrokeWidth)} />
      </span>
      <input
        ref={inputRef}
        id={inputId}
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChangeValue(e.target.value)}
        placeholder={placeholder}
        {...props}
      />
      {value ? (
        <button
          type="button"
          className={styles.clearBtn}
          onClick={handleClear}
          aria-label={clearAriaLabel}
        >
          <X className={styles.clearIcon} strokeWidth={2} />
        </button>
      ) : null}
    </div>
  );
}
