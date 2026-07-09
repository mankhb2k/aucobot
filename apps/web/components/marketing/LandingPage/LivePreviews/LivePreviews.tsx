import styles from "./LivePreviews.module.css";

type LivePreviewsProps = {
  /** Chỉ render khung iframe — dùng khi nhúng trong Hero */
  embedded?: boolean;
  eager?: boolean;
};

export function LivePreviews({ embedded = false, eager = false }: LivePreviewsProps) {
  const frame = (
    <div className={embedded ? styles.frameWrapEmbedded : styles.frameWrap}>
      <iframe
        className={embedded ? styles.iframeEmbedded : styles.iframe}
        src="/chat-simulator/index.html"
        title="Mô phỏng chat Aucobot"
        data-testid="demo-frame"
        loading={embedded || eager ? "eager" : "lazy"}
      />
    </div>
  );

  if (embedded) {
    return frame;
  }

  return (
    <section className={styles.root} id="live-demo" aria-label="Live previews">
      <p className={styles.eyebrow}>Xem trực tiếp</p>
      <h2 className={styles.title}>Một tin nhắn — agent làm từng bước</h2>
      <p className={styles.lead}>
        Gõ yêu cầu, tag <strong>@Trợ Lý</strong>, rồi theo dõi tiến trình làm việc
        như trong app thật.
      </p>
      {frame}
    </section>
  );
}
