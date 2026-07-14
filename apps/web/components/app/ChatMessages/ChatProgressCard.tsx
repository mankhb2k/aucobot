"use client";

import React, { useEffect, useState } from "react";
import { Sparkles, FileText, Search, PenTool, Clock, ArrowRight, Loader2, Check } from "lucide-react";

interface Step {
  label: string;
  detail?: string;
  icon: React.ReactNode;
}

interface ChatProgressCardProps {
  type: "working" | "scheduling";
  onComplete?: () => void;
}

export const ChatProgressCard: React.FC<ChatProgressCardProps> = ({
  type,
  onComplete,
}) => {
  const steps: Step[] = type === "working" ? [
    { label: "Phân tích yêu cầu", icon: <Sparkles className="w-3 h-3" /> },
    { label: "Đọc brand kit Tết", detail: "3 tài liệu", icon: <FileText className="w-3 h-3" /> },
    { label: "Tìm xu hướng caption Tết", detail: "12 kết quả", icon: <Search className="w-3 h-3" /> },
    { label: "Soạn 3 caption + CTA", icon: <PenTool className="w-3 h-3" /> },
    { label: "Lên lịch đăng 09:00 ngày 28/1", icon: <Clock className="w-3 h-3" /> },
    { label: "Chuyển Publisher chuẩn bị đăng", icon: <ArrowRight className="w-3 h-3" /> },
  ] : [
    { label: "Đồng bộ với hệ thống", icon: <Sparkles className="w-3 h-3" /> },
    { label: "Đang thiết lập thời gian...", icon: <Clock className="w-3 h-3" /> },
  ];

  const headerText = type === "working" ? "Đang làm việc" : "Đang xử lý";

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(new Array(steps.length).fill(false));

  useEffect(() => {
    if (currentStepIndex >= steps.length) {
      if (onComplete) {
        const timer = setTimeout(onComplete, 800);
        return () => clearTimeout(timer);
      }
      return;
    }

    const timer = setTimeout(() => {
      setCompleted((prev) => {
        const next = [...prev];
        next[currentStepIndex] = true;
        return next;
      });
      setCurrentStepIndex((prev) => prev + 1);
    }, type === "working" ? 800 + Math.random() * 400 : 1000); // speed up slightly for demo smoothness

    return () => clearTimeout(timer);
  }, [currentStepIndex, steps.length, onComplete, type]);

  return (
    <div className="flex gap-2.5 mb-2.5 justify-start animate-in fade-in duration-300 w-full">
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-emerald-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs select-none">
        TL
      </div>

      {/* Card */}
      <div className="bg-white border border-gray-200/60 rounded-2xl shadow-xs p-4 w-[280px] max-w-[75%] flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${currentStepIndex < steps.length ? "bg-[#0ea5e9] animate-pulse" : "bg-emerald-500"}`} />
            <span className="text-gray-900 text-xs font-semibold">{currentStepIndex < steps.length ? headerText : "Đã hoàn thành"}</span>
          </div>
          <span className="text-gray-400 text-[10px] font-medium">
            {Math.min(currentStepIndex + 1, steps.length)}/{steps.length}
          </span>
        </div>

        {/* Timeline */}
        <div className="flex flex-col">
          {steps.map((step, idx) => {
            const isDone = completed[idx];
            const isCurrent = idx === currentStepIndex;
            const isPending = idx > currentStepIndex;

            return (
              <div key={idx} className="flex gap-3 min-h-[34px] relative">
                {/* Connector line */}
                {idx < steps.length - 1 && (
                  <div className={`absolute left-3 top-6 bottom-0 w-[2px] ${isDone ? "bg-emerald-500" : "bg-gray-150"}`} />
                )}

                {/* Step Marker */}
                <div className="relative z-10 flex items-center justify-center w-6 h-6 shrink-0">
                  <div className={`w-6 h-6 rounded-full border flex items-center justify-center transition-all duration-300
                    ${isDone ? "bg-emerald-50 border-emerald-500 text-emerald-600" : ""}
                    ${isCurrent ? "bg-sky-50 border-sky-500 text-sky-600" : ""}
                    ${isPending ? "bg-white border-gray-200 text-gray-400" : ""}
                  `}>
                    {isDone ? (
                      <Check className="w-3 h-3" />
                    ) : isCurrent ? (
                      <Loader2 className="w-3 h-3 animate-spin" />
                    ) : (
                      step.icon
                    )}
                  </div>
                </div>

                {/* Step Body */}
                <div className="flex flex-col justify-center pb-2">
                  <span className={`text-xs font-medium transition-colors duration-300
                    ${isDone ? "text-gray-400" : ""}
                    ${isCurrent ? "text-sky-600 font-semibold" : ""}
                    ${isPending ? "text-gray-500" : ""}
                  `}>
                    {step.label}
                  </span>
                  {step.detail && (isDone || isCurrent) && (
                    <span className="text-gray-400 text-[10px] mt-0.5">{step.detail}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
