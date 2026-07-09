"use client";

import { useState } from "react";

import { joinWaitlist } from "@/lib/api/waitlist";

import styles from "./LandingPage.module.css";

type Status = "idle" | "submitting" | "success" | "error";

interface WaitlistFormProps {
  variant?: "hero" | "block";
}

export function WaitlistForm({ variant = "hero" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (status === "submitting") {
      return;
    }

    setStatus("submitting");
    setMessage(null);

    try {
      const result = await joinWaitlist(email);

      if (!result.ok) {
        setStatus("error");
        setMessage(result.error ?? "Không gửi được, thử lại sau");
        return;
      }

      setStatus("success");
      setEmail("");
      setMessage("Cảm ơn bạn! Chúng tôi sẽ báo ngay khi MVP sẵn sàng.");
    } catch {
      setStatus("error");
      setMessage("Lỗi kết nối, vui lòng thử lại");
    }
  }

  if (status === "success") {
    return (
      <p
        className={variant === "hero" ? styles.waitlistDoneHero : styles.waitlistDone}
        role="status"
      >
        {message}
      </p>
    );
  }

  return (
    <form
      className={variant === "hero" ? styles.waitlistFormHero : styles.waitlistForm}
      onSubmit={(event) => void handleSubmit(event)}
      noValidate
    >
      <label className={styles.srOnly} htmlFor={`waitlist-${variant}`}>
        Email
      </label>
      <input
        id={`waitlist-${variant}`}
        className={styles.waitlistInput}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="ban@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />
      <button
        type="submit"
        className={styles.waitlistBtn}
        disabled={status === "submitting"}
      >
        {status === "submitting" ? "Đang gửi…" : "Nhận thông báo"}
      </button>
      {message && status === "error" ? (
        <p className={styles.waitlistError} role="alert">
          {message}
        </p>
      ) : null}
    </form>
  );
}
