import { Bot, Palette, Users, Folder } from "lucide-react";
import "./ProblemSection.css";

export function ProblemSection() {
  return (
    <section id="problem">
      <div className="problem-grid">
        <div>
          <span className="section-tag">Thách thức</span>
          <h2 className="section-title">Marketing ngày nay quá rời rạc</h2>
          <p className="section-subtitle" style={{ marginBottom: "2rem" }}>
            Mỗi việc một công cụ. Bạn là người phải liên tục mở các tab khác nhau, copy qua lại và tự tay kết nối tất cả chúng.
          </p>
          <div style={{ borderLeft: "2px solid var(--color-primary)", paddingLeft: "1.5rem", marginBottom: "2rem" }}>
            <p style={{ fontSize: "1rem", color: "var(--color-text-main)", fontWeight: "600", marginBottom: "0.5rem" }}>
              Bạn phải tự kết nối tất cả.
            </p>
            <p style={{ fontSize: "0.95rem", color: "var(--color-text-muted)" }}>
              Aucobot sinh ra để thay đổi điều đó bằng cách tự động hóa toàn bộ quy trình phối hợp.
            </p>
          </div>
        </div>

        <div className="problem-cards">
          <div className="problem-card">
            <div className="problem-card-icon">
              <Bot />
            </div>
            <h3 className="problem-card-title">ChatGPT để viết</h3>
            <p className="problem-card-desc">Tạo ý tưởng và bài viết nháp thô sơ, chưa tối ưu nền tảng.</p>
          </div>
          <div className="problem-card">
            <div className="problem-card-icon">
              <Palette />
            </div>
            <h3 className="problem-card-title">Canva để thiết kế</h3>
            <p className="problem-card-desc">Thiết kế ảnh thủ công, tự căn chỉnh kích thước và kéo thả.</p>
          </div>
          <div className="problem-card">
            <div className="problem-card-icon">
              <Users />
            </div>
            <h3 className="problem-card-title">Facebook, TikTok để đăng</h3>
            <p className="problem-card-desc">Mở kênh mạng xã hội, tải video/ảnh, copy bài viết, gõ hashtag và lên lịch đăng bài.</p>
          </div>
          <div className="problem-card">
            <div className="problem-card-icon">
              <Folder />
            </div>
            <h3 className="problem-card-title">Drive, Notion để lưu trữ</h3>
            <p className="problem-card-desc">Lưu trữ tài liệu kiến thức thương hiệu, lấy thông tin sản phẩm và quản lý quy trình.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
