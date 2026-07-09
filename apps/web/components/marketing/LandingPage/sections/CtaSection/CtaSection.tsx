import { WaitlistForm } from "../WaitlistForm/WaitlistForm";
import "./CtaSection.css";

interface CtaSectionProps {
  showToast: () => void;
}

export function CtaSection({ showToast }: CtaSectionProps) {
  return (
    <section id="cta">
      <div className="cta-block">
        <h2 className="cta-title">Là người đầu tiên trải nghiệm</h2>
        <p className="cta-desc">
          Để lại email của bạn — chúng tôi sẽ lập tức thông báo ngay khi cổng đăng ký trải nghiệm MVP mở cửa.
        </p>
        <div className="cta-form-container">
          <WaitlistForm showToast={showToast} />
        </div>
      </div>
    </section>
  );
}
