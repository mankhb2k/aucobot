import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { WebSocketServer } from "ws";

import { ACCESS_TOKEN_COOKIE, readCookieValue } from "../auth/auth-cookie.util";
import { ConversationAccessService } from "../conversations/service/conversation-access/conversation-access.service";

import type { ConversationEventsPort } from "./conversation-events.port";
import type { JwtPayload } from "../auth/strategies/jwt.strategy";
import type { WsEventEnvelope } from "@aucobot/shared";
import type { IncomingMessage } from "http";
import type { Duplex } from "stream";
import type { WebSocket } from "ws";

const WS_PATH_PREFIX = "/api/ws/conversations/";

function parseCookies(header: string | undefined): Record<string, string> {
  if (!header) return {};
  const out: Record<string, string> = {};
  for (const part of header.split(";")) {
    const idx = part.indexOf("=");
    if (idx === -1) continue;
    const key = part.slice(0, idx).trim();
    const value = part.slice(idx + 1).trim();
    if (key) out[key] = decodeURIComponent(value);
  }
  return out;
}

function conversationIdFromUrl(url: string | undefined): string | null {
  if (!url) return null;
  const path = url.split("?")[0] ?? "";
  if (!path.startsWith(WS_PATH_PREFIX)) return null;
  const id = path.slice(WS_PATH_PREFIX.length).split("/")[0];
  return id || null;
}

@Injectable()
export class ConversationsGateway
  implements OnModuleInit, OnModuleDestroy, ConversationEventsPort
{
  private readonly logger = new Logger(ConversationsGateway.name);
  private wss: WebSocketServer | null = null;
  private readonly rooms = new Map<string, Set<WebSocket>>();
  private upgradeHandler:
    ((req: IncomingMessage, socket: Duplex, head: Buffer) => void) | null = null;

  constructor(
    private readonly httpAdapterHost: HttpAdapterHost,
    private readonly jwtService: JwtService,
    private readonly access: ConversationAccessService,
  ) {}

  onModuleInit() {
    const server = this.httpAdapterHost.httpAdapter.getHttpServer() as {
      on: (event: string, handler: (...args: unknown[]) => void) => void;
      off?: (event: string, handler: (...args: unknown[]) => void) => void;
    };

    this.wss = new WebSocketServer({ noServer: true });

    this.upgradeHandler = (req, socket, head) => {
      void this.handleUpgrade(req, socket, head);
    };

    server.on("upgrade", this.upgradeHandler as (...args: unknown[]) => void);
    this.logger.log(`WebSocket gateway listening on ${WS_PATH_PREFIX}:conversationId`);
  }

  onModuleDestroy() {
    const server = this.httpAdapterHost.httpAdapter.getHttpServer() as {
      off?: (event: string, handler: (...args: unknown[]) => void) => void;
    };

    if (this.upgradeHandler && server.off) {
      server.off("upgrade", this.upgradeHandler as (...args: unknown[]) => void);
    }

    for (const clients of this.rooms.values()) {
      for (const client of clients) {
        client.close();
      }
    }
    this.rooms.clear();
    this.wss?.close();
    this.wss = null;
  }

  hasClients(conversationId: string): boolean {
    const room = this.rooms.get(conversationId);
    return Boolean(room && room.size > 0);
  }

  emit(conversationId: string, event: WsEventEnvelope): void {
    const room = this.rooms.get(conversationId);
    if (!room || room.size === 0) return;

    const raw = JSON.stringify(event);
    for (const client of room) {
      if (client.readyState === client.OPEN) {
        client.send(raw);
      }
    }
  }

  private async handleUpgrade(
    req: IncomingMessage,
    socket: Duplex,
    head: Buffer,
  ): Promise<void> {
    const conversationId = conversationIdFromUrl(req.url);
    if (!conversationId || !this.wss) {
      return;
    }

    try {
      const cookies = parseCookies(req.headers.cookie);
      const token = readCookieValue(cookies, ACCESS_TOKEN_COOKIE);
      if (!token) {
        this.rejectUpgrade(socket, 401, "Unauthorized");
        return;
      }

      const payload = this.jwtService.verify<JwtPayload>(token);
      if (!payload.sub || !payload.email) {
        this.rejectUpgrade(socket, 401, "Unauthorized");
        return;
      }

      await this.access.assert(payload.sub, conversationId);

      this.wss.handleUpgrade(req, socket, head, (ws) => {
        this.bindClient(ws, conversationId);
      });
    } catch (error) {
      this.logger.debug(
        `WS upgrade rejected for ${conversationId}: ${
          error instanceof Error ? error.message : "unknown"
        }`,
      );
      this.rejectUpgrade(socket, 401, "Unauthorized");
    }
  }

  private bindClient(ws: WebSocket, conversationId: string): void {
    let room = this.rooms.get(conversationId);
    if (!room) {
      room = new Set();
      this.rooms.set(conversationId, room);
    }
    room.add(ws);

    ws.on("message", (data) => {
      try {
        const raw =
          typeof data === "string"
            ? data
            : Buffer.isBuffer(data)
              ? data.toString("utf8")
              : Array.isArray(data)
                ? Buffer.concat(data).toString("utf8")
                : Buffer.from(data).toString("utf8");
        const parsed: unknown = JSON.parse(raw);
        if (
          parsed &&
          typeof parsed === "object" &&
          "type" in parsed &&
          parsed.type === "ping"
        ) {
          this.emit(conversationId, {
            type: "pong",
            conversationId,
            timestamp: new Date().toISOString(),
            payload: {},
          });
        }
      } catch {
        // ignore malformed client frames
      }
    });

    ws.on("close", () => {
      room?.delete(ws);
      if (room && room.size === 0) {
        this.rooms.delete(conversationId);
      }
    });
  }

  private rejectUpgrade(socket: Duplex, status: number, message: string): void {
    socket.write(`HTTP/1.1 ${status} ${message}\r\nConnection: close\r\n\r\n`);
    socket.destroy();
  }
}
