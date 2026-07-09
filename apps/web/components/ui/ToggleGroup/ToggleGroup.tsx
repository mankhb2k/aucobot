"use client";

import * as ToggleGroupPrimitive from "@radix-ui/react-toggle-group";
import * as React from "react";

import styles from "./ToggleGroup.module.css";

export type ToggleGroupProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Root
> & {
  className?: string;
  /** Cuộn ngang trong khung cha — item active tự scroll vào giữa. */
  scrollable?: boolean;
};

function mergeRefs<T>(...refs: Array<React.Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") ref(node);
      else ref.current = node;
    }
  };
}

function scrollActiveItemIntoView(root: HTMLElement) {
  const actives = root.querySelectorAll('[data-state="on"]');
  const target = actives[actives.length - 1];
  target?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
    inline: "center",
  });
}

export const ToggleGroup = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Root>,
  ToggleGroupProps
>(({ className, scrollable = false, ...props }, ref) => {
  const rootRef = React.useRef<HTMLDivElement>(null);
  const value = "value" in props ? props.value : undefined;

  React.useLayoutEffect(() => {
    if (!scrollable || !rootRef.current) return;
    scrollActiveItemIntoView(rootRef.current);
  }, [scrollable, value, props.type]);

  return (
    <ToggleGroupPrimitive.Root
      ref={mergeRefs(ref, rootRef)}
      className={[
        styles.root,
        scrollable ? styles.rootScrollable : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...props}
    />
  );
});
ToggleGroup.displayName = ToggleGroupPrimitive.Root.displayName;

export type ToggleGroupItemProps = React.ComponentPropsWithoutRef<
  typeof ToggleGroupPrimitive.Item
> & {
  className?: string;
};

export const ToggleGroupItem = React.forwardRef<
  React.ElementRef<typeof ToggleGroupPrimitive.Item>,
  ToggleGroupItemProps
>(({ className, ...props }, ref) => (
  <ToggleGroupPrimitive.Item
    ref={ref}
    className={[styles.item, className].filter(Boolean).join(" ")}
    {...props}
  />
));
ToggleGroupItem.displayName = ToggleGroupPrimitive.Item.displayName;
