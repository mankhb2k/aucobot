import {
  CircleHelp,
  LogOut,
  Menu,
  Moon,
  MoreHorizontal,
  MoreVertical,
  Plus,
  Settings,
  Sun,
  User,
  Users,
} from "lucide-react";
import React from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubItem,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown/Dropdown";

import type { Meta, StoryObj } from "@storybook/nextjs-vite";

const meta: Meta = {
  title: "UI/Dropdown",
  component: DropdownMenu,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    align: {
      control: "select",
      options: ["start", "center", "end"],
      description: "Căn vị trí menu so với trigger",
    },
    triggerVariant: {
      control: "select",
      options: ["default", "icon", "unstyled"],
      description: "Kiểu nút mở menu (icon = nút-icon, icon tùy truyền)",
    },
    triggerText: {
      control: "text",
      description: "Nhãn trigger (chỉ variant default)",
    },
    sideOffset: {
      control: "number",
      description: "Khoảng cách giữa menu và trigger (px)",
    },
    contentWidth: {
      control: { type: "number", min: 120, max: 400, step: 10 },
      description: "Chiều rộng tối thiểu của menu (px)",
    },
    subContentWidth: {
      control: { type: "number", min: 120, max: 400, step: 10 },
      description: "Chiều rộng tối thiểu của submenu (px)",
    },
    select: {
      control: "boolean",
      description: "DropdownMenuSub — submenu single-select (dấu tick)",
    },
    theme: {
      control: "select",
      options: ["light", "dark", "system"],
      description: "Giá trị đang chọn trong submenu Appearance",
    },
    glass: {
      control: "boolean",
      description: "Bật hiệu ứng kính mờ (glassmorphism)",
    },
  },
};

export default meta;

const DemoLabel = ({ children }: { children: React.ReactNode }) => (
  <p
    style={{
      fontSize: "11px",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      color: "var(--color-description)",
      fontWeight: 600,
      marginBottom: "12px",
    }}
  >
    {children}
  </p>
);

const DemoBox = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "16px",
      padding: "60px",
      minWidth: "300px",
      border: "1px dashed var(--color-border)",
      borderRadius: "var(--radius-md)",
      background: "var(--color-background)",
      alignItems: "center",
    }}
  >
    {children}
  </div>
);

const iconSize = 18;
const iconProps = {
  size: iconSize,
  strokeWidth: 2,
  "aria-hidden": true,
} as const;

type CustomStoryArgs = {
  align: "start" | "center" | "end";
  triggerVariant: "default" | "icon" | "unstyled";
  triggerText: string;
  sideOffset: number;
  contentWidth: number;
  glass: boolean;
};

export const Default: StoryObj<CustomStoryArgs> = {
  args: {
    align: "end",
    triggerVariant: "default",
    triggerText: "Options",
    sideOffset: 4,
    contentWidth: 180,
    glass: true,
  },
  render: (args) => (
    <div>
      <DemoLabel>Bấm nút để mở menu (hover đổi nền và màu chữ)</DemoLabel>
      <DemoBox>
        <DropdownMenu>
          <DropdownMenuTrigger variant={args.triggerVariant}>
            {args.triggerVariant === "icon" ? (
              <MoreHorizontal size={20} strokeWidth={2} />
            ) : (
              args.triggerText
            )}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={args.align}
            sideOffset={args.sideOffset}
            width={args.contentWidth}
            glass={args.glass}
          >
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Hồ sơ</DropdownMenuItem>
            <DropdownMenuItem>Cài đặt</DropdownMenuItem>
            <DropdownMenuItem>Nhóm</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger">Đăng xuất</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DemoBox>
    </div>
  ),
};

export const IconTrigger: StoryObj<
  Pick<CustomStoryArgs, "align" | "contentWidth" | "sideOffset">
> = {
  args: {
    align: "end",
    sideOffset: 4,
    contentWidth: 180,
  },
  render: (args) => {
    const menu = (
      <DropdownMenuContent
        align={args.align}
        sideOffset={args.sideOffset}
        width={args.contentWidth}
      >
        <DropdownMenuItem>Sửa</DropdownMenuItem>
        <DropdownMenuItem>Sao chép ID</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="danger">Xóa vĩnh viễn</DropdownMenuItem>
      </DropdownMenuContent>
    );

    return (
      <div>
        <DemoLabel>
          Variant `icon` — truyền icon qua prop `icon` hoặc children; `size`
          `sm` (mặc định) / `lg` (sidebar header).
        </DemoLabel>
        <DemoBox>
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="icon"
                icon={<MoreHorizontal />}
                aria-label="Ba chấm ngang"
              />
              {menu}
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="icon"
                icon={<MoreVertical />}
                aria-label="Ba chấm dọc"
              />
              {menu}
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="icon"
                icon={<Plus />}
                aria-label="Thêm"
              />
              {menu}
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="icon"
                icon={<Settings />}
                aria-label="Cài đặt"
              />
              {menu}
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="icon"
                size="lg"
                icon={<Settings />}
                aria-label="Sidebar header size"
              />
              {menu}
            </DropdownMenu>
          </div>
        </DemoBox>
      </div>
    );
  },
};

const THEME_LABELS = {
  light: "Sáng",
  dark: "Tối",
  system: "Hệ thống",
} as const;

type ThemeOption = keyof typeof THEME_LABELS;

type SubMenuStoryArgs = {
  align: "start" | "center" | "end";
  triggerText: string;
  sideOffset: number;
  contentWidth: number;
  subContentWidth: number;
  select: boolean;
  theme: ThemeOption;
  glass: boolean;
};

export const ItemExtend: StoryObj<SubMenuStoryArgs> = {
  args: {
    align: "start",
    triggerText: "Tài khoản",
    sideOffset: 4,
    contentWidth: 220,
    subContentWidth: 180,
    select: true,
    theme: "light",
    glass: true,
  },
  render: function ItemExtendStory(args) {
    const [theme, setTheme] = React.useState<ThemeOption>(args.theme);

    React.useEffect(() => {
      setTheme(args.theme);
    }, [args.theme]);

    return (
      <div>
        <DemoLabel>
          SubItem + submenu — chevron bên phải, `select` bật dấu tick
        </DemoLabel>
        <DemoBox>
          <DropdownMenu>
            <DropdownMenuTrigger variant="default">
              {args.triggerText}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align={args.align}
              sideOffset={args.sideOffset}
              width={args.contentWidth}
              glass={args.glass}
            >
              <DropdownMenuItem>
                <Settings {...iconProps} />
                Cài đặt
              </DropdownMenuItem>
              <DropdownMenuSub select={args.select}>
                <DropdownMenuSubItem detail={THEME_LABELS[theme]}>
                  <Sun {...iconProps} />
                  Giao diện
                </DropdownMenuSubItem>
                <DropdownMenuSubContent width={args.subContentWidth} glass={args.glass}>
                  <DropdownMenuItem
                    selected={theme === "light"}
                    onSelect={() => setTheme("light")}
                  >
                    <Sun {...iconProps} />
                    Sáng
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={theme === "dark"}
                    onSelect={() => setTheme("dark")}
                  >
                    <Moon {...iconProps} />
                    Tối
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    selected={theme === "system"}
                    onSelect={() => setTheme("system")}
                  >
                    <Settings {...iconProps} />
                    Hệ thống
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSub>
                <DropdownMenuSubItem>
                  <CircleHelp {...iconProps} />
                  Trợ giúp
                </DropdownMenuSubItem>
                <DropdownMenuSubContent width={200}>
                  <DropdownMenuItem>Tài liệu</DropdownMenuItem>
                  <DropdownMenuItem>Hỗ trợ</DropdownMenuItem>
                  <DropdownMenuItem>Liên hệ</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="danger">
                <LogOut {...iconProps} />
                Đăng xuất
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </DemoBox>
      </div>
    );
  },
};

export const WithIcons: StoryObj<
  Pick<CustomStoryArgs, "align" | "triggerText" | "contentWidth" | "sideOffset">
> = {
  args: {
    align: "end",
    triggerText: "Tài khoản",
    sideOffset: 4,
    contentWidth: 200,
  },
  render: (args) => (
    <div>
      <DemoLabel>Menu item có icon + chữ (gap lấy từ .item)</DemoLabel>
      <DemoBox>
        <DropdownMenu>
          <DropdownMenuTrigger variant="default">
            {args.triggerText}
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align={args.align}
            sideOffset={args.sideOffset}
            width={args.contentWidth}
          >
            <DropdownMenuLabel>Tài khoản</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User {...iconProps} />
              Hồ sơ
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings {...iconProps} />
              Cài đặt
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Users {...iconProps} />
              Nhóm
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Moon {...iconProps} />
              Chế độ tối
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Sun {...iconProps} />
              Chế độ sáng
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger">
              <LogOut {...iconProps} />
              Đăng xuất
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </DemoBox>
    </div>
  ),
};

const MockTelegramSidebar = ({ children }: { children: React.ReactNode }) => {
  const mockChats = [
    { name: "Telegram", message: "Login code: 12345. Do not share...", time: "12:34", unread: 2, color: "#1ca8db" },
    { name: "Saved Messages", message: "Remind me to check the database", time: "11:20", unread: 0, color: "#22c55e" },
    { name: "Group Chat", message: "Tung: Let's meet at 5pm today", time: "10:15", unread: 5, color: "#e11d48" },
    { name: "CoinMarketCap", message: "New listing notifications...", time: "Yesterday", unread: 0, color: "#f59e0b" },
    { name: "Ví", message: "Don't let your Gold slip away...", time: "Saturday", unread: 1, color: "#6366f1" },
  ];

  return (
    <div
      style={{
        width: "360px",
        height: "500px",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-lg)",
        background: "var(--color-background)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        position: "relative",
        boxShadow: "var(--shadow-md)",
      }}
    >
      {/* Top Header Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
          padding: "12px 16px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        {children}
        <div
          style={{
            flex: 1,
            height: "36px",
            background: "var(--color-secondary-hover)",
            borderRadius: "var(--radius-full)",
            display: "flex",
            alignItems: "center",
            padding: "0 12px",
            color: "var(--color-description)",
            fontSize: "13px",
          }}
        >
          Search
        </div>
      </div>

      {/* Chat List */}
      <div style={{ flex: 1, overflowY: "auto", padding: "8px 0" }}>
        {mockChats.map((chat, idx) => (
          <div
            key={idx}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 16px",
              cursor: "pointer",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: chat.color,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "14px",
                flexShrink: 0,
              }}
            >
              {chat.name[0]}
            </div>
            {/* Info */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2px" }}>
                <span style={{ fontWeight: 600, fontSize: "14px", color: "var(--color-text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {chat.name}
                </span>
                <span style={{ fontSize: "12px", color: "var(--color-description)" }}>
                  {chat.time}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "var(--color-description)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginRight: "8px" }}>
                  {chat.message}
                </span>
                {chat.unread > 0 && (
                  <span
                    style={{
                      background: "var(--color-primary)",
                      color: "#fff",
                      fontSize: "11px",
                      fontWeight: "bold",
                      padding: "2px 6px",
                      borderRadius: "10px",
                      minWidth: "18px",
                      textAlign: "center",
                    }}
                  >
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const TelegramStyle: StoryObj<CustomStoryArgs> = {
  args: {
    align: "start",
    triggerVariant: "icon",
    triggerText: "Menu",
    sideOffset: 8,
    contentWidth: 200,
    glass: true,
  },
  render: (args) => (
    <div>
      <DemoLabel>Telegram Web Style — Hiệu ứng kính mờ hiển thị đè lên danh sách chat</DemoLabel>
      <MockTelegramSidebar>
        <DropdownMenu>
          <DropdownMenuTrigger variant="icon" icon={<Menu />} aria-label="Open menu" />
          <DropdownMenuContent
            align={args.align}
            sideOffset={args.sideOffset}
            width={args.contentWidth}
            glass={args.glass}
          >
            <DropdownMenuItem>
              <User {...iconProps} />
              My Profile
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Settings {...iconProps} />
              Settings
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CircleHelp {...iconProps} />
              Help
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant="danger">
              <LogOut {...iconProps} />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </MockTelegramSidebar>
    </div>
  ),
};

