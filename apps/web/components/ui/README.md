# `components/ui/`

Design system nội bộ — CSS Modules, không Tailwind/shadcn.

## Implemented

- `Avatar/` — chữ cái đầu + màu nền ổn định theo `seed` (chat sidebar + bubble)
- `FloatingBar/` — thanh nổi bo tròn (`--color-bar`, dùng chung với sidebar)
- `StatusBadge/` — health / online indicator
- `OtpInput/`

## Planned components

- `Button/`
- `Input/`
- `Spinner/`
- `Badge/`
- `Toast/` (hoặc infra context)

## Mỗi component

```text
Button/
  Button.tsx
  Button.module.css
  Button.stories.tsx
```

Props typed rõ; không fetch; không Zustand.
