"use client";


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/Dropdown/Dropdown";
import { Search } from "@/components/ui/Search/Search";

import styles from "./SidebarHeader.module.css";
import type { ReactNode } from "react";

interface SidebarHeaderProps {
  title: string;
  menuAriaLabel: string;
  menuIcon: ReactNode;
  menuContent?: ReactNode;
  onMenuClick?: () => void;
  composeAriaLabel: string;
  composeIcon: ReactNode;
  onComposeClick?: () => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  searchLabel: string;
  searchPlaceholder: string;
  searchClearAriaLabel: string;
  searchIconStrokeWidth?: number;
  nav: ReactNode;
}

function HeaderIconButton({
  ariaLabel,
  children,
  onClick,
}: {
  ariaLabel: string;
  children: ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={styles.iconBtn}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export function SidebarHeader({
  title,
  menuAriaLabel,
  menuIcon,
  menuContent,
  onMenuClick,
  composeAriaLabel,
  composeIcon,
  onComposeClick,
  searchValue,
  onSearchValueChange,
  searchLabel,
  searchPlaceholder,
  searchClearAriaLabel,
  searchIconStrokeWidth = 2.5,
  nav,
}: SidebarHeaderProps) {
  const menuTrigger = (
    <HeaderIconButton ariaLabel={menuAriaLabel} onClick={onMenuClick}>
      {menuIcon}
    </HeaderIconButton>
  );

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.actions}>
          {menuContent ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="unstyled"
                className={styles.iconBtn}
                aria-label={menuAriaLabel}
              >
                {menuIcon}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">{menuContent}</DropdownMenuContent>
            </DropdownMenu>
          ) : (
            menuTrigger
          )}
          <HeaderIconButton
            ariaLabel={composeAriaLabel}
            onClick={onComposeClick}
          >
            {composeIcon}
          </HeaderIconButton>
        </div>
      </div>

      <div className={styles.search}>
        <Search
          value={searchValue}
          onChangeValue={onSearchValueChange}
          label={searchLabel}
          placeholder={searchPlaceholder}
          clearAriaLabel={searchClearAriaLabel}
          iconStrokeWidth={searchIconStrokeWidth}
        />
      </div>

      <div className={styles.nav}>{nav}</div>
    </header>
  );
}
