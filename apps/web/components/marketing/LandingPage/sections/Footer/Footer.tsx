import Image from "next/image";
import "./Footer.css";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-logo-desc">
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
            <p>
              Hệ thống tự động hóa marketing thế hệ mới, thay thế quy trình rời rạc bằng sức mạnh của sự kết hợp đa tác nhân thông minh.
            </p>
          </div>
          <div className="footer-links-grid">
            <div className="footer-links-col">
              <span className="footer-col-title">Sản phẩm</span>
              <a href="#features" className="footer-link">Tính năng</a>
              <a href="#problem" className="footer-link">Giải pháp</a>
            </div>
            <div className="footer-links-col">
              <span className="footer-col-title">Dự án</span>
              <a href="#cta" className="footer-link">Nhận thông báo</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2026 Aucobot · No Copyright</span>
        </div>
      </div>
    </footer>
  );
}
