"use client";
import { useState } from "react";
import "./FaqSection.css";

export function FaqSection() {
  const [openFaqs, setOpenFaqs] = useState<Record<string, boolean>>({});

  const toggleFaq = (question: string) => {
    setOpenFaqs((prev) => ({ ...prev, [question]: !prev[question] }));
  };

  const faqItems = [
    {
      q: "AI có tự ý đăng bài không?",
      a: "Không. Bạn luôn giữ quyền quyết định cao nhất (Human-in-the-loop). AI sẽ tạo nội dung nháp, lập lịch biểu, thiết kế và gửi yêu cầu phê duyệt tới bạn. Chỉ khi bạn nhấn nút \"Duyệt\", bài đăng mới được phân phối chính thức lên các nền tảng mạng xã hội."
    },
    {
      q: "Có hỗ trợ đăng bài lên TikTok không?",
      a: "Có. Aucobot tích hợp trực tiếp API đăng tải của TikTok thông qua kết nối OAuth chính thức, hỗ trợ tự động chèn nhạc xu hướng và đồng bộ hashtag phù hợp với video thương hiệu của bạn."
    },
    {
      q: "Ứng dụng có hoàn toàn miễn phí không?",
      a: "Chúng tôi sẽ mở cửa thử nghiệm hoàn toàn miễn phí (Free Beta) cho 500 thành viên đầu tiên đăng ký nhận thông báo để thu thập ý kiến đóng góp. Khi chính thức ra mắt, sản phẩm sẽ có gói cơ bản và gói cao cấp tùy thuộc vào tần suất đăng tải và số lượng Agent bạn cấu hình."
    },
    {
      q: "Khi nào mở thử nghiệm Beta?",
      a: "Theo lộ trình xây dựng công khai, bản MVP nội bộ sẽ hoàn thành trong vòng vài tuần tới. Sau khi kết nối xong các hạ tầng OAuth và kiểm duyệt từ Facebook & TikTok, bản Closed Beta sẽ được mở cho những người dùng đã để lại email đăng ký trên trang này."
    }
  ];

  return (
    <section id="faq">
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span className="section-tag">Giải đáp thắc mắc</span>
        <h2 className="section-title">Câu hỏi thường gặp</h2>
        <p className="section-subtitle">
          Một số thắc mắc phổ biến về mô hình hoạt động và lộ trình của Aucobot.
        </p>
      </div>

      <div className="faq-grid">
        {faqItems.map((item) => {
          const isOpen = !!openFaqs[item.q];
          return (
            <div key={item.q} className={`faq-item ${isOpen ? "active" : ""}`}>
              <div className="faq-question" onClick={() => toggleFaq(item.q)}>
                <span>{item.q}</span>
                <span className="faq-toggle-icon">{isOpen ? "-" : "+"}</span>
              </div>
              <div className="faq-answer">
                {item.a}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
