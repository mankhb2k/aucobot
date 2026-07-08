"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import "./Navigation.css";

export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`navbar glass-nav ${scrolled ? "scrolled" : ""}`}>
      <div className="nav-container">
        <a href="#" className="logo">
          <Image
            src="/aucobot-icon.svg"
            alt="Aucobot Logo"
            width={32}
            height={32}
            className="logo-icon"
          />
          <span>Aucobot</span>
        </a>
        <ul className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
          <li><a href="#problem" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Vấn đề</a></li>
          <li><a href="#features" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Tính năng</a></li>
          <li><a href="#roadmap" className="nav-link" onClick={() => setMobileMenuOpen(false)}>Tiến độ</a></li>
          <li><a href="#faq" className="nav-link" onClick={() => setMobileMenuOpen(false)}>FAQ</a></li>
        </ul>
        <div className="nav-actions">
          <a
            href="#cta"
            className="btn btn-primary"
            style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem" }}
          >Nhận thông báo</a>
        </div>
        <button className="mobile-nav-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Menu Toggle">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>
    </header>
  );
}
