import { Be_Vietnam_Pro } from "next/font/google";

import type { Preview } from "@storybook/nextjs-vite";

import "../app/globals.css";

// Storybook không chạy app/layout.tsx, nên nạp cùng font ở đây để khớp app.
const beVietnamPro = Be_Vietnam_Pro({
  variable: "--font-be-vietnam",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: "todo",
    },
  },
  decorators: [
    (Story) => (
      // display:contents → chỉ truyền biến font, không tạo box ảnh hưởng layout.
      <div className={beVietnamPro.variable} style={{ display: "contents" }}>
        <Story />
      </div>
    ),
  ],
};

export { preview as default };
