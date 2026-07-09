import { Rocket, Link, Users, ShieldCheck, Brain, Bot } from "lucide-react";
import "./FeaturesSection.css";

export function FeaturesSection() {
  return (
    <section id="features">
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span className="section-tag">Tính năng chính</span>
        <h2 className="section-title">Không phải một chatbot — một phòng ban</h2>
        <p className="section-subtitle">
          Chúng tôi tái định nghĩa cách thức bạn làm việc với trí tuệ nhân tạo. Dưới đây là cách mà Aucobot vận hành.
        </p>
      </div>

      <div className="features-grid">
        <div className="feature-card">
          <span className="feature-num">01</span>
          <div className="feature-icon-wrapper">
            <Rocket />
          </div>
          <h3 className="feature-title">Dựng phòng marketing AI trong vài phút</h3>
          <p className="feature-desc">
            Chỉ cần tạo không gian làm việc, mô tả ngắn gọn về thương hiệu và mục tiêu, các AI Agent sẽ lập tức tự động thiết lập sơ đồ làm việc.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-num">02</span>
          <div className="feature-icon-wrapper">
            <Link />
          </div>
          <h3 className="feature-title">Kết nối công cụ của bạn</h3>
          <p className="feature-desc">
            Liên kết tài khoản Facebook, TikTok, Google Drive, Notion... của bạn chỉ một lần duy nhất, dữ liệu và lịch trình sẽ tự động đồng bộ.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-num">03</span>
          <div className="feature-icon-wrapper">
            <Users />
          </div>
          <h3 className="feature-title">Nhiều AI phối hợp như một team</h3>
          <p className="feature-desc">
            Không hoạt động đơn độc. Các Agent Content, Research và Publisher giao tiếp, trao đổi phản hồi và sửa bài chéo cho nhau.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-num">04</span>
          <div className="feature-icon-wrapper">
            <ShieldCheck />
          </div>
          <h3 className="feature-title">Bạn luôn duyệt cuối</h3>
          <p className="feature-desc">
            Hệ thống đảm bảo tính an toàn thương hiệu. AI không bao giờ tự ý đăng bài lên mạng xã hội khi chưa nhận được cái gật đầu từ bạn.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-num">05</span>
          <div className="feature-icon-wrapper">
            <Brain />
          </div>
          <h3 className="feature-title">AI nhớ thương hiệu của bạn</h3>
          <p className="feature-desc">
            Ghi nhớ tone giọng, quy định viết tắt, đối thủ cạnh tranh hay định hướng thiết kế. Không cần nhắc lại yêu cầu trong mỗi phiên trò chuyện.
          </p>
        </div>
        <div className="feature-card">
          <span className="feature-num">06</span>
          <div className="feature-icon-wrapper">
            <Bot />
          </div>
          <h3 className="feature-title">Tự tạo agent của riêng bạn</h3>
          <p className="feature-desc">
            Thiết kế các Agent chuyên trách bằng cách tùy chỉnh hướng dẫn, giọng điệu và giao việc cụ thể phù hợp với chiến dịch của bạn.
          </p>
        </div>
      </div>
    </section>
  );
}
