import "./RoadmapSection.css";

export function RoadmapSection() {
  return (
    <section id="roadmap">
      <span className="section-tag">Xây dựng công khai</span>
      <h2 className="section-title">Theo dõi lộ trình và tiến độ dự án</h2>
      <p className="section-subtitle">
        Chúng tôi không đưa ra cam kết ảo. Dưới đây là tiến trình phát triển và
        hoàn thiện trực tiếp từ đội ngũ phát triển sản phẩm.
      </p>

      <div className="public-grid">
        {/* Left Side: Circular Progress Gauge & Status */}
        <div className="public-dashboard">
          <div className="progress-circle-container">
            <svg className="progress-svg" width="180" height="180">
              <circle className="progress-bg" cx="90" cy="90" r="80" />
              <circle className="progress-bar-fill" cx="90" cy="90" r="80" />
            </svg>
            <div className="progress-value">
              <span className="progress-number">30%</span>
              <span className="progress-label">Tiến độ MVP</span>
            </div>
          </div>

          <div className="dashboard-status">
            <h3 className="status-title">Đang triển khai</h3>
            <ul className="status-list">
              <li className="status-item">
                <span className="status-icon-ok">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </span>
                <span>Tin nhắn & AI trả lời (LLM vào chat)</span>
              </li>
              <li className="status-item">
                <span className="status-icon-pending"></span>
                <span>Chuẩn bị hệ thống Facebook OAuth</span>
              </li>
            </ul>
            <p className="update-date">Cập nhật gần nhất: 2 Tháng 7, 2026</p>
          </div>
        </div>

        {/* Right Side: Phases Timeline */}
        <div className="timeline-container">
          {/* Phase 1 */}
          <div className="timeline-phase completed">
            <div className="timeline-dot"></div>
            <div className="phase-header">
              <h3 className="phase-title">Phase 1 — Nền tảng (MVP)</h3>
              <span className="phase-badge completed">Hoàn thành</span>
            </div>
            <div className="phase-content">
              <p className="phase-sub">Khung sản phẩm chạy được</p>
              <ul className="phase-items">
                <li className="phase-item">Xác thực (OTP email + Google)</li>
                <li className="phase-item">Phòng Marketing (Room / Session)</li>
                <li className="phase-item">Giao diện chat</li>
                <li className="phase-item">Bật/tắt feature qua config</li>
              </ul>
            </div>
          </div>

          {/* Phase 2 */}
          <div className="timeline-phase active">
            <div className="timeline-dot"></div>
            <div className="phase-header">
              <h3 className="phase-title">Phase 2 — AI & Kết nối (MVP)</h3>
              <span className="phase-badge active">Đang thực hiện</span>
            </div>
            <div className="phase-content">
              <p className="phase-sub">Agent thật sự làm việc</p>
              <ul className="phase-items">
                <li className="phase-item">Tin nhắn & AI trả lời</li>
                <li className="phase-item">Duyệt bài (Human approval)</li>
                <li className="phase-item">Facebook</li>
                <li className="phase-item">TikTok</li>
              </ul>
            </div>
          </div>

          {/* Phase 3 */}
          <div className="timeline-phase">
            <div className="timeline-dot"></div>
            <div className="phase-header">
              <h3 className="phase-title">Phase 3 — Tự động hóa (MVP)</h3>
              <span className="phase-badge upcoming">Kế hoạch</span>
            </div>
            <div className="phase-content">
              <p className="phase-sub">Chạy thay bạn</p>
              <ul className="phase-items">
                <li className="phase-item">Lên lịch & đăng bài tự động</li>
                <li className="phase-item">Bot / Workflow (Agent xây hộ)</li>
                <li className="phase-item">Long-term memory thương hiệu</li>
              </ul>
            </div>
          </div>

          {/* Phase 4 */}
          <div className="timeline-phase">
            <div className="timeline-dot"></div>
            <div className="phase-header">
              <h3 className="phase-title">Phase 4 — Mở rộng</h3>
              <span className="phase-badge upcoming">Kế hoạch</span>
            </div>
            <div className="phase-content">
              <p className="phase-sub">Super app cộng tác</p>
              <ul className="phase-items">
                <li className="phase-item">Mời đồng nghiệp + phân quyền</li>
                <li className="phase-item">Marketplace agent</li>
                <li className="phase-item">Community agent</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
