import React, { useState } from "react";
import { Play, Square, ArrowRight, CheckCircle2, RefreshCw } from "lucide-react";

interface WorkflowDashboardProps {
  workflowId: string;
}

interface StepNode {
  name: string;
  type: string;
  icon: string;
  desc: string;
  status: "idle" | "running" | "success" | "failed";
}

export const WorkflowDashboard: React.FC<WorkflowDashboardProps> = ({ workflowId }) => {
  const [isRunning, setIsRunning] = useState(workflowId === "wf_2");
  const [isDryRunning, setIsDryRunning] = useState(false);

  // Hardcode data for high fidelity mock workflows
  const getWorkflowConfig = () => {
    switch (workflowId) {
      case "wf_1":
        return {
          name: "Tự động đăng bài Facebook Q1",
          trigger: "Hàng ngày lúc 14:00",
          nodes: [
            { name: "Trigger Lịch Giờ", type: "trigger", icon: "🕗", desc: "Kích hoạt định kỳ 14:00 hàng ngày", status: "success" },
            { name: "Content Creator AI", type: "processing", icon: "📝", desc: "Soạn thảo bài đăng PR theo template sản phẩm", status: "success" },
            { name: "Publisher AI", type: "action", icon: "✈️", desc: "Lên lịch và tự động đăng bài lên Fanpage qua Graph API", status: "success" }
          ] as StepNode[],
          logs: [
            { id: "#wf1-102", time: "Hôm nay, 14:00", status: "success", detail: "Đã đăng thành công bài PR: 'Bí mật x10 hiệu suất...'" },
            { id: "#wf1-101", time: "Hôm qua, 14:00", status: "success", detail: "Đã đăng thành công bài PR: 'Làm chủ AI ngay...'" }
          ]
        };
      case "wf_2":
        return {
          name: "Quét tin nhắn Page & Báo cáo",
          trigger: "Khi có tin nhắn mới",
          nodes: [
            { name: "Trigger Webhook", type: "trigger", icon: "✉️", desc: "Webhook phát hiện tin nhắn mới trên Fanpage", status: "running" },
            { name: "CS Bot", type: "processing", icon: "🤖", desc: "Nhận diện ý định và tự động soạn tin nhắn trả lời khách hàng", status: "success" },
            { name: "Publisher AI", type: "action", icon: "✈️", desc: "Gửi thông báo báo cáo tin nhắn về Telegram sếp", status: "success" }
          ] as StepNode[],
          logs: [
            { id: "#wf2-998", time: "Vừa xong", status: "running", detail: "Đang xử lý tin nhắn từ khách hàng: Nguyễn Văn A..." },
            { id: "#wf2-997", time: "5 phút trước", status: "success", detail: "Tự động phản hồi thành công và đã gửi cảnh báo về Telegram." }
          ]
        };
      case "wf_3":
        return {
          name: "Sync Affiliate Clip sang TikTok",
          trigger: "Mỗi thứ Hai lúc 08:00",
          nodes: [
            { name: "Trigger Lịch Giờ", type: "trigger", icon: "🕗", desc: "Kích hoạt mỗi thứ Hai lúc 08:00", status: "success" },
            { name: "Google Drive Node", type: "extraction", icon: "💾", desc: "Tải video review sản phẩm mới nhất từ Drive", status: "success" },
            { name: "Publisher AI", type: "action", icon: "🎥", desc: "Đăng tải video lên kênh TikTok Shop Affiliate", status: "success" }
          ] as StepNode[],
          logs: [
            { id: "#wf3-042", time: "Hôm qua, 08:00", status: "success", detail: "Đã đồng bộ và đăng video 'Review Gậy Selfie AI' thành công." }
          ]
        };
      case "wf_4":
        return {
          name: "Theo dõi giá đối thủ & Cảnh báo",
          trigger: "Hàng giờ",
          nodes: [
            { name: "Trigger Lịch Giờ", type: "trigger", icon: "⏰", desc: "Kích hoạt lặp lại mỗi 1 giờ", status: "success" },
            { name: "Research AI", type: "processing", icon: "🔍", desc: "Quét giá sản phẩm trên các sàn Shopee/Lazada", status: "success" },
            { name: "Slack/Telegram Node", type: "action", icon: "🔔", desc: "Gửi báo cáo so sánh giá và cảnh báo nếu đối thủ hạ giá", status: "success" }
          ] as StepNode[],
          logs: [
            { id: "#wf4-2451", time: "12 phút trước", status: "success", detail: "Đã quét thành công. Không phát hiện biến động giá bất thường." },
            { id: "#wf4-2450", time: "1 giờ trước", status: "success", detail: "Đã quét thành công. Không phát hiện biến động giá bất thường." }
          ]
        };
      default:
        return {
          name: "Workflow Không Tên",
          trigger: "Manual",
          nodes: [] as StepNode[],
          logs: []
        };
    }
  };

  const config = getWorkflowConfig();

  const handleDryRun = () => {
    setIsDryRunning(true);
    setTimeout(() => {
      setIsDryRunning(false);
      alert("Chạy thử nghiệm (Dry-run) hoàn tất! Kết quả đầu ra mô phỏng chính xác.");
    }, 1500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6 bg-[#f8fafc]">
      {/* Header section with switch & control buttons */}
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-gray-500 text-xs font-semibold uppercase tracking-wider">Trạng thái hoạt động</span>
            <div className={`h-2.5 w-2.5 rounded-full ${isRunning ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" : "bg-gray-300"}`} />
          </div>
          <h2 className="font-bold text-gray-900 text-base">{config.name}</h2>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDryRun}
            disabled={isDryRunning}
            className="px-3.5 py-2 text-xs font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50 select-none"
          >
            <RefreshCw size={14} className={isDryRunning ? "animate-spin" : ""} />
            {isDryRunning ? "Đang chạy thử..." : "Chạy thử (Dry-run)"}
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer select-none text-white ${
              isRunning 
                ? "bg-rose-500 hover:bg-rose-600 active:bg-rose-700" 
                : "bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700"
            }`}
          >
            {isRunning ? (
              <>
                <Square size={12} className="fill-current" />
                DỪNG WORKFLOW
              </>
            ) : (
              <>
                <Play size={12} className="fill-current" />
                KÍCH HOẠT RUN
              </>
            )}
          </button>
        </div>
      </div>

      {/* Visual flowchart diagram of step nodes */}
      <div className="bg-white rounded-2xl p-6 shadow-xs border border-gray-100 flex flex-col gap-6">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Sơ đồ các khối lắp ráp (Workflow Canvas)</h3>
        
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 md:gap-2 relative">
          {config.nodes.map((node, index) => (
            <React.Fragment key={index}>
              {/* Node Card */}
              <div className="flex-1 bg-gray-50/70 border border-gray-100 rounded-2xl p-4 flex flex-col gap-2 relative transition-all hover:border-blue-100 hover:bg-white hover:shadow-xs group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{node.icon}</span>
                    <span className="font-bold text-gray-900 text-sm group-hover:text-[#3390ec] transition-colors">{node.name}</span>
                  </div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    node.type === "trigger" ? "bg-purple-50 text-purple-600" :
                    node.type === "processing" ? "bg-sky-50 text-[#0ea5e9]" : "bg-amber-50 text-amber-600"
                  }`}>
                    {node.type}
                  </span>
                </div>
                <p className="text-gray-500 text-xs leading-relaxed">{node.desc}</p>
                <div className="mt-1 flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                  <span className={`h-1.5 w-1.5 rounded-full ${isRunning && node.status === "running" ? "bg-blue-500 animate-pulse" : "bg-emerald-500"}`} />
                  <span>{isRunning && node.status === "running" ? "Đang xử lý..." : "Sẵn sàng"}</span>
                </div>
              </div>

              {/* Connecting Arrow */}
              {index < config.nodes.length - 1 && (
                <div className="flex justify-center items-center py-2 md:py-0 md:px-2 flex-shrink-0 text-gray-300">
                  <ArrowRight className="rotate-90 md:rotate-0" size={18} />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Execution history logs */}
      <div className="bg-white rounded-2xl p-5 shadow-xs border border-gray-100 flex-1 flex flex-col gap-4">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Lịch sử chạy gần đây (Execution History)</h3>
        
        <div className="flex-1 flex flex-col gap-3">
          {config.logs.map((log, index) => (
            <div key={index} className="flex items-start gap-3 p-3 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
              {log.status === "success" ? (
                <CheckCircle2 className="text-emerald-500 flex-shrink-0 mt-0.5" size={16} />
              ) : (
                <span className="flex h-4 w-4 relative flex-shrink-0 mt-0.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-blue-500"></span>
                </span>
              )}
              <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="font-semibold text-gray-800 text-xs">{log.id}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md ${log.status === "success" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"}`}>
                      {log.status.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-gray-600 text-xs leading-tight truncate max-w-[280px] sm:max-w-md">{log.detail}</p>
                </div>
                <span className="text-[10px] text-gray-400 font-medium whitespace-nowrap self-start sm:self-center">{log.time}</span>
              </div>
            </div>
          ))}
          {config.logs.length === 0 && (
            <div className="text-center py-8 text-gray-400 text-xs">Chưa có lịch sử chạy ghi nhận cho workflow này.</div>
          )}
        </div>
      </div>
    </div>
  );
};
