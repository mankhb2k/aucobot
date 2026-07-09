"use client";
import { useState } from "react";
import { joinWaitlist } from "@/lib/api/waitlist";
import "./WaitlistForm.css";

interface WaitlistFormProps {
  showToast: () => void;
}

export function WaitlistForm({ showToast }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    try {
      const result = await joinWaitlist(email);
      if (result.ok) {
        setStatus("success");
        setEmail("");
        showToast();
      } else {
        setStatus("error");
        alert(result.error ?? "Không gửi được, thử lại sau");
      }
    } catch {
      setStatus("error");
      alert("Lỗi kết nối, vui lòng thử lại");
    }
  };

  return (
    <form className="email-form" onSubmit={handleSubmit}>
      <input
        type="email"
        placeholder="ban@email.com"
        className="email-input"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={status === "submitting"}
      />
      <button type="submit" className="btn btn-primary" disabled={status === "submitting"}>
        {status === "submitting" ? "Đang gửi..." : "Nhận thông báo"}
      </button>
    </form>
  );
}
