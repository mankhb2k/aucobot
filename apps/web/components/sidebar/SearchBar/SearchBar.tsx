import { Search, X } from "lucide-react";

import styles from "./SearchBar.module.css";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Tìm kiếm",
}: SearchBarProps) {
  return (
    <div className={styles.wrap}>
      <Search className={styles.icon} />
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
      />
      {value && (
        <button
          type="button"
          className={styles.clear}
          onClick={() => onChange("")}
          aria-label="Xóa tìm kiếm"
        >
          <X className={styles.clearIcon} />
        </button>
      )}
    </div>
  );
}
