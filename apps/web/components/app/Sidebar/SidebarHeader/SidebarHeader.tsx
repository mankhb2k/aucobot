"use client";

import {
  DropdownIconButton,
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
  composeContent?: ReactNode;
  onComposeClick?: () => void;
  searchValue: string;
  onSearchValueChange: (value: string) => void;
  searchLabel: string;
  searchPlaceholder: string;
  searchClearAriaLabel: string;
  searchIconStrokeWidth?: number;
  nav: ReactNode;
}

export function SidebarHeader({
  title,
  menuAriaLabel,
  menuIcon,
  menuContent,
  onMenuClick,
  composeAriaLabel,
  composeIcon,
  composeContent,
  onComposeClick,
  searchValue,
  onSearchValueChange,
  searchLabel,
  searchPlaceholder,
  searchClearAriaLabel,
  searchIconStrokeWidth = 2,
  nav,
}: SidebarHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <h1 className={styles.title}>{title}</h1>
        <div className={styles.actions}>
          {menuContent ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="icon"
                size="lg"
                icon={menuIcon}
                aria-label={menuAriaLabel}
              />
              <DropdownMenuContent align="end" glass>
                {menuContent}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownIconButton
              size="lg"
              icon={menuIcon}
              aria-label={menuAriaLabel}
              onClick={onMenuClick}
            />
          )}
          {composeContent ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                variant="icon"
                size="lg"
                icon={composeIcon}
                aria-label={composeAriaLabel}
              />
              <DropdownMenuContent align="start" glass>
                {composeContent}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <DropdownIconButton
              size="lg"
              icon={composeIcon}
              aria-label={composeAriaLabel}
              onClick={onComposeClick}
            />
          )}
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
