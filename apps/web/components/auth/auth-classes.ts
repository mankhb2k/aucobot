/** Shared Tailwind classes for auth screens. */
export const authAlertClassName =
  "mb-4 rounded-md border border-danger bg-danger-dim p-3 text-danger [&_a]:font-semibold [&_a]:text-danger";

export const authFieldClassName =
  "rounded-md border border-border bg-white px-3.5 py-3 text-text outline-none transition-[border-color,box-shadow] placeholder:text-description/70 focus:border-primary focus:ring-2 focus:ring-primary/25";

export const authPrimaryButtonClassName =
  "w-full rounded-md border-0 bg-primary px-4 py-3 font-semibold text-primary-foreground transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

export const authGhostButtonClassName =
  "cursor-pointer border-0 bg-transparent p-2 font-medium text-primary transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:opacity-60";

export const authSecondaryLinkClassName =
  "flex w-full items-center justify-center gap-2 rounded-md border border-border bg-white px-4 py-3 font-medium text-text no-underline transition-colors hover:bg-secondary-hover";
