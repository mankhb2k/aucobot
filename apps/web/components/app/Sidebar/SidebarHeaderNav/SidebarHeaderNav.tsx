"use client";

import {
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown/Dropdown";

import styles from "./SidebarHeaderNav.module.css";

export interface SidebarHeaderNavItem {
  value: string;
  label: string;
  icon: ReactNode;
}

interface SidebarHeaderNavProps {
  items: SidebarHeaderNavItem[];
  value: string;
  onValueChange: (value: string) => void;
  ariaLabel: string;
  overflowAriaLabel: string;
  overflowIcon: ReactNode;
}

function splitVisibleItems(
  items: SidebarHeaderNavItem[],
  itemWidths: number[],
  activeValue: string,
  containerWidth: number,
  overflowWidth: number,
  gap: number,
): { visible: SidebarHeaderNavItem[]; overflow: SidebarHeaderNavItem[] } {
  const totalWidth =
    itemWidths.reduce((sum, width) => sum + width, 0) +
    gap * Math.max(items.length - 1, 0);

  if (totalWidth <= containerWidth) {
    return { visible: items, overflow: [] };
  }

  const available = containerWidth - overflowWidth - gap;
  const visible: SidebarHeaderNavItem[] = [];
  const overflow: SidebarHeaderNavItem[] = [];
  let used = 0;

  for (let index = 0; index < items.length; index += 1) {
    const item = items[index];
    const width = itemWidths[index];
    const nextUsed = used + width + (visible.length > 0 ? gap : 0);

    if (nextUsed <= available || visible.length === 0) {
      visible.push(item);
      used = nextUsed;
    } else {
      overflow.push(item);
    }
  }

  const activeOverflowIndex = overflow.findIndex(
    (item) => item.value === activeValue,
  );

  if (activeOverflowIndex >= 0) {
    const [activeItem] = overflow.splice(activeOverflowIndex, 1);
    if (visible.length > 0) {
      overflow.unshift(visible.pop()!);
    }
    visible.push(activeItem);
  }

  return { visible, overflow };
}

export function SidebarHeaderNav({
  items,
  value,
  onValueChange,
  ariaLabel,
  overflowAriaLabel,
  overflowIcon,
}: SidebarHeaderNavProps) {
  const navRef = useRef<HTMLElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const overflowMeasureRef = useRef<HTMLButtonElement>(null);
  const [layout, setLayout] = useState<{
    visible: SidebarHeaderNavItem[];
    overflow: SidebarHeaderNavItem[];
  }>({ visible: items, overflow: [] });

  const measureLayout = useCallback(() => {
    const nav = navRef.current;
    const measure = measureRef.current;
    if (!nav || !measure) return;

    const buttons = measure.querySelectorAll<HTMLButtonElement>(
      "[data-measure-item]",
    );
    const itemWidths = Array.from(buttons, (button) => button.offsetWidth);
    const gap = Number.parseFloat(getComputedStyle(measure).gap) || 0;
    const overflowWidth = overflowMeasureRef.current?.offsetWidth ?? 0;

    setLayout(
      splitVisibleItems(
        items,
        itemWidths,
        value,
        nav.clientWidth,
        overflowWidth,
        gap,
      ),
    );
  }, [items, value]);

  useLayoutEffect(() => {
    measureLayout();
    const nav = navRef.current;
    if (!nav) return undefined;

    const observer = new ResizeObserver(measureLayout);
    observer.observe(nav);
    return () => observer.disconnect();
  }, [measureLayout]);

  return (
    <nav ref={navRef} className={styles.nav} aria-label={ariaLabel}>
      <div className={styles.measure} aria-hidden="true">
        <div ref={measureRef} className={styles.measureInner}>
          {items.map((item) => (
            <button
              key={item.value}
              type="button"
              data-measure-item
              className={styles.item}
              tabIndex={-1}
            >
              {item.icon}
            </button>
          ))}
          <button
            ref={overflowMeasureRef}
            type="button"
            className={styles.overflowTrigger}
            tabIndex={-1}
          >
            {overflowIcon}
          </button>
        </div>
      </div>

      <div className={styles.track}>
        {layout.visible.map((item) => (
          <button
            key={item.value}
            type="button"
            className={styles.item}
            data-active={item.value === value}
            aria-label={item.label}
            aria-current={item.value === value ? "page" : undefined}
            onClick={() => onValueChange(item.value)}
          >
            {item.icon}
          </button>
        ))}
      </div>

      {layout.overflow.length > 0 ? (
        <DropdownMenu>
          <DropdownMenuTrigger
            variant="unstyled"
            className={styles.overflowTrigger}
            aria-label={overflowAriaLabel}
          >
            {overflowIcon}
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {layout.overflow.map((item) => (
              <DropdownMenuItem
                key={item.value}
                onSelect={() => onValueChange(item.value)}
              >
                {item.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      ) : null}
    </nav>
  );
}
