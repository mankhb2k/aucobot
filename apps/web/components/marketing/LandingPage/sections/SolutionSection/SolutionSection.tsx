"use client";
import { useState } from "react";
import "./SolutionSection.css";

export function SolutionSection() {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const activeLinks: Record<string, string[]> = {
    "node-user": ["link-user-room"],
    "node-room": ["link-user-room", "link-room-agents"],
    "node-agents": ["link-room-agents", "link-agents-platforms", "link-agents-platforms-2", "link-agents-drives"],
    "node-platforms": ["link-agents-platforms"],
    "node-platforms-2": ["link-agents-platforms-2"],
    "node-drives": ["link-agents-drives"],
  };

  const isLinkActive = (linkId: string) => {
    if (!hoveredNode) return false;
    return activeLinks[hoveredNode]?.includes(linkId) ?? false;
  };

  return (
    <section id="solution">
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
        <span className="section-tag">Giải pháp</span>
        <h2 className="section-title">Một phòng — cả team AI phối hợp</h2>
        <p className="section-subtitle" style={{ marginBottom: "1.25rem" }}>
          Bạn không phải đối thoại với từng chatbot riêng lẻ. Aucobot kết nối tất cả các tác vụ và công cụ lại với nhau thành một luồng xử lý mượt mà.
        </p>
      </div>

      <div className="solution-flow-container">
        <svg
          className="flow-diagram-svg"
          viewBox="0 0 320 520"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Links */}
          <path id="link-user-room" className={`flow-link ${isLinkActive("link-user-room") ? "active" : ""}`} style={{ strokeWidth: isLinkActive("link-user-room") ? "2.5px" : "1.5px" }} d="M160 95 V 150" />
          <path id="link-room-agents" className={`flow-link ${isLinkActive("link-room-agents") ? "active" : ""}`} style={{ strokeWidth: isLinkActive("link-room-agents") ? "2.5px" : "1.5px" }} d="M160 220 V 260" />
          <path id="link-agents-platforms" className={`flow-link ${isLinkActive("link-agents-platforms") ? "active" : ""}`} style={{ strokeWidth: isLinkActive("link-agents-platforms") ? "2.5px" : "1.5px" }} d="M160 380 C 160 410, 60 410, 60 450" />
          <path id="link-agents-platforms-2" className={`flow-link ${isLinkActive("link-agents-platforms-2") ? "active" : ""}`} style={{ strokeWidth: isLinkActive("link-agents-platforms-2") ? "2.5px" : "1.5px" }} d="M160 380 V 450" />
          <path id="link-agents-drives" className={`flow-link ${isLinkActive("link-agents-drives") ? "active" : ""}`} style={{ strokeWidth: isLinkActive("link-agents-drives") ? "2.5px" : "1.5px" }} d="M160 380 C 160 410, 260 410, 260 450" />

          {/* Nodes */}
          <g id="node-user" onMouseEnter={() => setHoveredNode("node-user")} onMouseLeave={() => setHoveredNode(null)} className="flow-node user">
            <rect x="80" y="25" width="160" height="70" rx="16" />
            <text x="160" y="55" fontSize="12" fontWeight="bold">BẠN</text>
            <text x="160" y="73" fontSize="9" fill="var(--color-text-muted)">Duyệt & Ra Lệnh</text>
          </g>

          <g id="node-room" onMouseEnter={() => setHoveredNode("node-room")} onMouseLeave={() => setHoveredNode(null)} className="flow-node center-room">
            <rect x="80" y="150" width="160" height="70" rx="16" />
            <text x="160" y="180" fontSize="13" fontWeight="bold" fill="var(--color-primary)">Marketing Room</text>
            <text x="160" y="198" fontSize="9" fill="var(--color-text-muted)">Đầu não tự động hóa</text>
          </g>

          <g id="node-agents" onMouseEnter={() => setHoveredNode("node-agents")} onMouseLeave={() => setHoveredNode(null)} className="flow-node">
            <rect x="90" y="260" width="140" height="120" rx="16" />
            <text x="160" y="285" fontSize="11" fontWeight="bold" fill="var(--color-text-main)">Content AI</text>
            <text x="160" y="310" fontSize="11" fontWeight="bold" fill="var(--color-text-main)">Research AI</text>
            <text x="160" y="335" fontSize="11" fontWeight="bold" fill="var(--color-text-main)">Designer AI</text>
            <text x="160" y="360" fontSize="11" fontWeight="bold" fill="var(--color-text-main)">Publisher AI</text>
          </g>

          <g id="node-platforms" onMouseEnter={() => setHoveredNode("node-platforms")} onMouseLeave={() => setHoveredNode(null)} className="flow-node">
            <rect x="15" y="450" width="90" height="45" rx="8" />
            <text x="60" y="476" fontSize="11" fontWeight="bold">Facebook</text>
          </g>
          
          <g id="node-platforms-2" onMouseEnter={() => setHoveredNode("node-platforms-2")} onMouseLeave={() => setHoveredNode(null)} className="flow-node">
            <rect x="115" y="450" width="90" height="45" rx="8" />
            <text x="160" y="476" fontSize="11" fontWeight="bold">TikTok</text>
          </g>

          <g id="node-drives" onMouseEnter={() => setHoveredNode("node-drives")} onMouseLeave={() => setHoveredNode(null)} className="flow-node">
            <rect x="215" y="450" width="90" height="45" rx="8" />
            <text x="260" y="476" fontSize="11" fontWeight="bold">Google Drive</text>
          </g>
        </svg>
      </div>
    </section>
  );
}
