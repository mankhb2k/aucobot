import { FloatingBar } from "./FloatingBar";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import type { ReactNode } from "react";

const GRADIENTS = {
  chatWallpaper:
    "linear-gradient(135deg, #8eb7d8 0%, #9bc9a8 30%, #a7d49b 52%, #d4e4a8 78%, #e8efa7 100%)",
  sunset:
    "linear-gradient(145deg, #ff9a8b 0%, #ff6a88 38%, #ff99ac 62%, #fecfef 100%)",
  ocean:
    "linear-gradient(160deg, #0f4c75 0%, #1b6ca8 35%, #3282b8 65%, #bbe1fa 100%)",
  dusk:
    "linear-gradient(135deg, #2d1b69 0%, #6b2d8a 40%, #c94b7b 72%, #f7a278 100%)",
  mint:
    "linear-gradient(120deg, #d4fc79 0%, #96e6a1 45%, #38ef7d 100%)",
  dark:
    "linear-gradient(180deg, #1a1f2e 0%, #323232 45%, #0b0f17 100%)",
  vivid:
    "linear-gradient(90deg, #f12711 0%, #f5af19 20%, #00b09b 45%, #96c93d 70%, #7f00ff 100%)",
} as const satisfies Record<string, string>;

type GradientKey = keyof typeof GRADIENTS;

function gradientDecorator(background: string) {
  return (Story: () => ReactNode) => (
    <div
      style={{
        maxWidth: 720,
        padding: 24,
        background,
        backgroundAttachment: "fixed",
      }}
    >
      <Story />
    </div>
  );
}

function HeaderPreview() {
  return (
    <>
      <span style={{ flex: 1, padding: "8px 12px", fontWeight: 600 }}>
        Test AucoAgent
      </span>
      <span style={{ padding: "8px 12px", opacity: 0.6 }}>⋯</span>
    </>
  );
}

function ComposerPreview() {
  return (
    <>
      <span style={{ padding: 8, opacity: 0.6 }}>📎</span>
      <span
        style={{
          flex: 1,
          padding: "9px 8px",
          color: "var(--color-description)",
        }}
      >
        Nhắn tin
      </span>
      <span
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: "var(--color-primary)",
          display: "grid",
          placeItems: "center",
          color: "white",
        }}
      >
        🎤
      </span>
    </>
  );
}

function GradientShowcase({ background, label }: { background: string; label: string }) {
  return (
    <section
      style={{
        background,
        backgroundAttachment: "fixed",
        borderRadius: 16,
        display: "flex",
        flexDirection: "column",
        gap: 16,
        minHeight: 200,
        overflow: "hidden",
        padding: 20,
      }}
    >
      <p
        style={{
          color: "rgba(255,255,255,0.92)",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          textShadow: "0 1px 4px rgba(0,0,0,0.35)",
          textTransform: "uppercase",
        }}
      >
        {label}
      </p>
      <FloatingBar as="header" align="center">
        <HeaderPreview />
      </FloatingBar>
      <FloatingBar align="end">
        <ComposerPreview />
      </FloatingBar>
    </section>
  );
}

const meta = {
  title: "UI/FloatingBar",
  component: FloatingBar,
  parameters: { layout: "padded" },
  tags: ["autodocs"],
  argTypes: {
    as: { control: "inline-radio", options: ["div", "header"] },
    align: { control: "inline-radio", options: ["center", "end"] },
  },
  decorators: [gradientDecorator(GRADIENTS.chatWallpaper)],
} satisfies Meta<typeof FloatingBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const HeaderStyle: Story = {
  args: {
    as: "header",
    align: "center",
    children: <HeaderPreview />,
  },
};

export const ComposerStyle: Story = {
  args: {
    align: "end",
    children: <ComposerPreview />,
  },
};

function createGradientStory(
  gradientKey: GradientKey,
  render?: Story["render"],
): Story {
  return {
    decorators: [gradientDecorator(GRADIENTS[gradientKey])],
    render,
  } as any;
}

export const OnChatWallpaper: Story = createGradientStory("chatWallpaper", () => (
  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
    <FloatingBar as="header" align="center">
      <HeaderPreview />
    </FloatingBar>
    <FloatingBar align="end">
      <ComposerPreview />
    </FloatingBar>
  </div>
));

export const OnSunset: Story = createGradientStory("sunset", OnChatWallpaper.render);
export const OnOcean: Story = createGradientStory("ocean", OnChatWallpaper.render);
export const OnDusk: Story = createGradientStory("dusk", OnChatWallpaper.render);
export const OnMint: Story = createGradientStory("mint", OnChatWallpaper.render);
export const OnDark: Story = createGradientStory("dark", OnChatWallpaper.render);
export const OnVivid: Story = createGradientStory("vivid", OnChatWallpaper.render);

export const AllGradients: Story = {
  parameters: { layout: "fullscreen" },
  decorators: [],
  render: () => (
    <div
      style={{
        display: "grid",
        gap: 20,
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
        padding: 24,
      }}
    >
      {(Object.keys(GRADIENTS) as GradientKey[]).map((key) => (
        <GradientShowcase
          key={key}
          label={key}
          background={GRADIENTS[key]}
        />
      ))}
    </div>
  ),
} as any;
