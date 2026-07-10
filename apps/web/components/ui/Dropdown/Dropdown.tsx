"use client";

import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { Check, ChevronRight } from "lucide-react";
import * as React from "react";

import styles from "./Dropdown.module.css";

/**
 * Theo dõi thao tác gần nhất là bàn phím hay chuột.
 * Dùng để chỉ hiện focus ring (viền) khi đóng menu bằng bàn phím,
 * còn đóng bằng chuột thì không trả focus về trigger → không hiện viền.
 */
let lastInputWasKeyboard = false;
if (typeof window !== "undefined") {
  window.addEventListener("keydown", () => (lastInputWasKeyboard = true), true);
  window.addEventListener(
    "pointerdown",
    () => (lastInputWasKeyboard = false),
    true,
  );
}

/** Bật chế độ single-select cho submenu (hiện dấu tick). */
const DropdownMenuSubSelectContext = React.createContext(false);

function useDropdownMenuSubSelect() {
  return React.useContext(DropdownMenuSubSelectContext);
}

export const DropdownMenu = DropdownMenuPrimitive.Root;

export type DropdownIconSize = "sm" | "lg";

/** Đồng bộ với Dropdown stories (`iconProps`: size 18, strokeWidth 2). */
const DROPDOWN_ICON_SIZE = 18;
const DROPDOWN_ICON_STROKE = 2;

function getIconTriggerClassName(size: DropdownIconSize = "sm") {
  return `${styles.iconTrigger} ${size === "lg" ? styles.iconTriggerLg : ""}`.trim();
}

/** Chuẩn hóa icon Lucide — kích thước/nét vẽ cố định, CSS chỉ scale vùng bấm. */
function normalizeTriggerIcon(icon: React.ReactNode) {
  if (!React.isValidElement(icon)) {
    return icon;
  }

  return React.cloneElement(
    icon as React.ReactElement<{
      size?: number;
      strokeWidth?: number;
      "aria-hidden"?: boolean;
    }>,
    {
      size: DROPDOWN_ICON_SIZE,
      strokeWidth: DROPDOWN_ICON_STROKE,
      "aria-hidden": true,
    },
  );
}

export type DropdownIconButtonProps =
  React.ButtonHTMLAttributes<HTMLButtonElement> & {
    icon: React.ReactNode;
    size?: DropdownIconSize;
  };

/** Nút-icon dùng chung style với `DropdownMenuTrigger variant="icon"` (khi không cần menu). */
export const DropdownIconButton = React.forwardRef<
  HTMLButtonElement,
  DropdownIconButtonProps
>(({ className, icon, size = "sm", type = "button", ...props }, ref) => (
  <button
    ref={ref}
    type={type}
    className={`${getIconTriggerClassName(size)} ${className ?? ""}`.trim()}
    {...props}
  >
    {normalizeTriggerIcon(icon)}
  </button>
));
DropdownIconButton.displayName = "DropdownIconButton";

export type DropdownMenuTriggerProps =
  DropdownMenuPrimitive.DropdownMenuTriggerProps & {
    /**
     * Kiểu nút mở menu:
     * - `default`: nút có viền + nhãn chữ.
     * - `icon`: nút-icon (icon qua prop `icon` hoặc children).
     * - `unstyled`: không style, tự tùy biến hoàn toàn.
     */
    variant?: "default" | "icon" | "unstyled";
    /** Kích thước nút-icon (`sm` = 34px, `lg` = sidebar header). Chỉ áp dụng `variant="icon"`. */
    size?: DropdownIconSize;
    /** Icon hiển thị — thay cho children khi `variant="icon"`. */
    icon?: React.ReactNode;
    children?: React.ReactNode;
  };

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  DropdownMenuTriggerProps
>(
  (
    {
      className,
      variant = "default",
      size = "sm",
      icon,
      children,
      style,
      ...props
    },
    ref,
  ) => {
    const variantClass =
      variant === "icon"
        ? getIconTriggerClassName(size)
        : variant === "default"
          ? styles.defaultTrigger
          : "";

    const triggerContent =
      variant === "icon"
        ? normalizeTriggerIcon(icon ?? children)
        : children;

    return (
      <DropdownMenuPrimitive.Trigger
        ref={ref}
        className={`${variantClass} ${className ?? ""}`.trim()}
        style={style}
        {...props}
      >
        {triggerContent}
      </DropdownMenuPrimitive.Trigger>
    );
  },
);
DropdownMenuTrigger.displayName = DropdownMenuPrimitive.Trigger.displayName;

export type DropdownMenuContentProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
> & {
  /** Chiều rộng tối thiểu của menu (number = px, string = CSS length). */
  width?: number | string;
  /** Hiệu ứng kính mờ (glassmorphism) — blur nền phía sau. */
  glass?: boolean;
};

export const DropdownMenuContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuContentProps
>(
  (
    { className, sideOffset = 4, width, glass, style, onCloseAutoFocus, ...props },
    ref,
  ) => {
    const widthStyle =
      width !== undefined
        ? { minWidth: typeof width === "number" ? `${width}px` : width }
        : undefined;

    return (
      <DropdownMenuPrimitive.Portal>
        <DropdownMenuPrimitive.Content
          ref={ref}
          sideOffset={sideOffset}
          className={`${styles.content} ${glass ? styles.contentGlass : ""} ${className ?? ""}`.trim()}
          style={{ ...widthStyle, ...style }}
          onCloseAutoFocus={(event) => {
            // Đóng bằng chuột: không trả focus về trigger → không hiện viền.
            // Đóng bằng bàn phím: giữ mặc định (trả focus + viền) cho a11y.
            if (!lastInputWasKeyboard) event.preventDefault();
            onCloseAutoFocus?.(event);
          }}
          {...props}
        />
      </DropdownMenuPrimitive.Portal>
    );
  },
);
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName;

export type DropdownMenuItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> & {
  variant?: "default" | "danger";
  /** Hiện dấu tick khi được chọn (dùng trong `DropdownMenuSub select`). */
  selected?: boolean;
};

export const DropdownMenuItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuItemProps
>(
  (
    { className, variant = "default", selected, asChild, children, ...props },
    ref,
  ) => {
    const subSelect = useDropdownMenuSubSelect();
    const isSelectable = subSelect && selected !== undefined && !asChild;

    return (
      <DropdownMenuPrimitive.Item
        ref={ref}
        asChild={asChild}
        className={`${styles.item} ${isSelectable ? styles.itemSelectable : ""} ${
          variant === "danger" ? styles.danger : ""
        } ${className ?? ""}`.trim()}
        aria-checked={isSelectable ? selected : undefined}
        {...props}
      >
        {asChild ? (
          children
        ) : (
          <>
            {children}
            {isSelectable && selected ? (
              <span className={styles.itemIndicator} aria-hidden>
                <Check size={16} />
              </span>
            ) : null}
          </>
        )}
      </DropdownMenuPrimitive.Item>
    );
  },
);
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName;

export const DropdownMenuLabel = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuLabelProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={`${styles.label} ${className ?? ""}`.trim()}
    {...props}
  />
));
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName;

export const DropdownMenuSeparator = React.forwardRef<
  HTMLDivElement,
  DropdownMenuPrimitive.DropdownMenuSeparatorProps
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={`${styles.separator} ${className ?? ""}`.trim()}
    {...props}
  />
));
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName;

export type DropdownMenuSubProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Sub
> & {
  /** Submenu single-select — item con dùng `selected` để hiện tick. Mặc định false. */
  select?: boolean;
};

export function DropdownMenuSub({
  select = false,
  children,
  ...props
}: DropdownMenuSubProps) {
  return (
    <DropdownMenuSubSelectContext.Provider value={select}>
      <DropdownMenuPrimitive.Sub {...props}>
        {children}
      </DropdownMenuPrimitive.Sub>
    </DropdownMenuSubSelectContext.Provider>
  );
}

export type DropdownMenuSubContentProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubContent
> & {
  width?: number | string;
  /** Hiệu ứng kính mờ (glassmorphism) — blur nền phía sau. */
  glass?: boolean;
};

export const DropdownMenuSubContent = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubContentProps
>(({ className, sideOffset = 4, width, glass, style, ...props }, ref) => {
  const widthStyle =
    width !== undefined
      ? { minWidth: typeof width === "number" ? `${width}px` : width }
      : undefined;

  return (
    <DropdownMenuPrimitive.SubContent
      ref={ref}
      sideOffset={sideOffset}
      className={`${styles.content} ${glass ? styles.contentGlass : ""} ${className ?? ""}`.trim()}
      style={{ ...widthStyle, ...style }}
      {...props}
    />
  );
});
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName;

export type DropdownMenuSubItemProps = React.ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  /** Nhãn phụ trước chevron (vd "Light"). */
  detail?: React.ReactNode;
};

export const DropdownMenuSubItem = React.forwardRef<
  HTMLDivElement,
  DropdownMenuSubItemProps
>(({ className, children, detail, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={`${styles.item} ${styles.itemExtend} ${className ?? ""}`.trim()}
    {...props}
  >
    <span className={styles.itemExtendMain}>{children}</span>
    {detail != null && detail !== "" ? (
      <span className={styles.itemExtendDetail}>{detail}</span>
    ) : null}
    <ChevronRight
      size={16}
      className={styles.itemExtendChevron}
      aria-hidden
    />
  </DropdownMenuPrimitive.SubTrigger>
));
DropdownMenuSubItem.displayName = "DropdownMenuSubItem";
