/**
 * Smoke E2E: dev-login → WS → POST message → observe tool.* / message.done
 * Run: node scripts/smoke-web-search.cjs
 */
const path = require("path");
const { WebSocket } = require(
  path.join(__dirname, "../apps/api/node_modules/ws"),
);

const API = process.env.API_BASE || "http://localhost:8387";

function parseSetCookie(res) {
  const raw = res.headers.getSetCookie?.() ?? [];
  return raw.map((c) => c.split(";")[0]).join("; ");
}

async function main() {
  const login = await fetch(`${API}/api/auth/dev-login`, { method: "POST" });
  if (!login.ok) {
    throw new Error(`dev-login failed: ${login.status} ${await login.text()}`);
  }
  const cookie = parseSetCookie(login);
  if (!cookie) throw new Error("dev-login: no Set-Cookie");

  const list = await fetch(`${API}/api/conversations`, {
    headers: { cookie },
  });
  if (!list.ok) throw new Error(`list conversations: ${list.status}`);
  const { items } = await list.json();
  let session = items.find((c) => c.type === "session");
  if (!session) {
    const created = await fetch(`${API}/api/conversations`, {
      method: "POST",
      headers: { cookie, "content-type": "application/json" },
      body: JSON.stringify({ type: "session", title: "smoke-web-search" }),
    });
    if (!created.ok) {
      throw new Error(`create conversation: ${created.status} ${await created.text()}`);
    }
    session = await created.json();
  }

  const conversationId = session.id;
  console.log("conversationId", conversationId);

  const events = [];
  const wsUrl = `ws://localhost:8387/api/ws/conversations/${conversationId}`;

  await new Promise((resolve, reject) => {
    const ws = new WebSocket(wsUrl, {
      headers: { cookie },
    });
    const timer = setTimeout(() => {
      ws.close();
      reject(new Error("timeout waiting for message.done (90s)"));
    }, 90_000);

    ws.on("open", async () => {
      console.log("ws open");
      await new Promise((r) => setTimeout(r, 400));
      try {
        const send = await fetch(
          `${API}/api/conversations/${conversationId}/messages`,
          {
            method: "POST",
            headers: { cookie, "content-type": "application/json" },
            body: JSON.stringify({
              content:
                "Dùng tool web_search tìm thông tin về Vietnam AI Innovation Challenge và trả lời ngắn kèm 1 URL.",
            }),
          },
        );
        const body = await send.json();
        console.log("POST messages", send.status, {
          streaming: body.streaming,
          hasAssistant: Boolean(body.assistantMessage),
        });
        if (!send.ok) {
          clearTimeout(timer);
          ws.close();
          reject(new Error(`POST messages failed: ${JSON.stringify(body)}`));
          return;
        }
        if (body.streaming === false && body.assistantMessage) {
          events.push({
            type: "non-stream-reply",
            content: String(body.assistantMessage.content).slice(0, 300),
          });
          clearTimeout(timer);
          ws.close();
          resolve(undefined);
        }
      } catch (err) {
        clearTimeout(timer);
        ws.close();
        reject(err);
      }
    });

    ws.on("message", (data) => {
      try {
        const envelope = JSON.parse(String(data));
        const type = envelope.type;
        if (type === "ping" || type === "pong") return;
        const summary = { type };
        if (type === "tool.started") {
          summary.name = envelope.payload?.name;
          summary.label = envelope.payload?.label;
        }
        if (type === "tool.finished") {
          summary.name = envelope.payload?.name;
          summary.ok = envelope.payload?.ok;
          summary.detail = envelope.payload?.detail;
        }
        if (type === "tool.error") {
          summary.name = envelope.payload?.name;
          summary.message = envelope.payload?.message;
        }
        if (type === "message.done") {
          summary.content = String(envelope.payload?.content ?? "").slice(
            0,
            400,
          );
        }
        if (type === "message.chunk") {
          events.push({ type });
          return;
        }
        events.push(summary);
        console.log("event", summary);
        if (type === "message.done") {
          clearTimeout(timer);
          setTimeout(() => {
            ws.close();
            resolve(undefined);
          }, 500);
        }
      } catch {
        console.log("ws raw", String(data).slice(0, 200));
      }
    });

    ws.on("error", (err) => {
      clearTimeout(timer);
      reject(err);
    });
  });

  const toolStarted = events.filter((e) => e.type === "tool.started");
  const toolFinished = events.filter((e) => e.type === "tool.finished");
  const toolError = events.filter((e) => e.type === "tool.error");
  const done = events.find((e) => e.type === "message.done");
  const chunks = events.filter((e) => e.type === "message.chunk").length;

  console.log("\n=== RESULT ===");
  console.log({
    toolStarted: toolStarted.length,
    toolFinished: toolFinished.length,
    toolError: toolError.length,
    chunks,
    tools: toolStarted.map((t) => t.name),
    finishedOk: toolFinished.map((t) => ({ name: t.name, ok: t.ok })),
    errors: toolError,
    replyPreview:
      done?.content ??
      events.find((e) => e.type === "non-stream-reply")?.content,
  });

  const searchOk = toolFinished.some(
    (t) => t.name === "web_search" && t.ok === true,
  );
  if (!searchOk) {
    process.exitCode = 1;
    console.log("FAIL: web_search did not finish ok");
  } else {
    console.log("PASS: web_search tool finished ok");
  }
}

main().catch((err) => {
  console.error("FATAL", err.message || err);
  process.exit(1);
});
