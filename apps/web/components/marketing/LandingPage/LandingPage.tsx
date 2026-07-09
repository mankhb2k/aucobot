"use client";

import { useState } from "react";
import "./LandingPage.css";
import { CtaSection } from "./sections/CtaSection/CtaSection";
import { FaqSection } from "./sections/FaqSection/FaqSection";
import { FeaturesSection } from "./sections/FeaturesSection/FeaturesSection";
import { Footer } from "./sections/Footer/Footer";
import { HeroSection } from "./sections/HeroSection/HeroSection";
import { Navigation } from "./sections/Navigation/Navigation";
import { ProblemSection } from "./sections/ProblemSection/ProblemSection";
import { RoadmapSection } from "./sections/RoadmapSection/RoadmapSection";
import { SolutionSection } from "./sections/SolutionSection/SolutionSection";

export function LandingPage() {
  const [toastVisible, setToastVisible] = useState(false);

  const showToast = () => {
    setToastVisible(true);
    setTimeout(() => {
      setToastVisible(false);
    }, 4000);
  };

  return (
    <>
      <Navigation />
      <HeroSection showToast={showToast} />
      <ProblemSection />
      <SolutionSection />
      <FeaturesSection />
      <RoadmapSection />
      <CtaSection showToast={showToast} />
      <FaqSection />
      <Footer />
      
      {/* Toast Notification */}
      <div className={`toast-msg ${toastVisible ? "show" : ""}`}>
        ✨ Đăng ký nhận thông báo thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.
      </div>
    </>
  );
}
