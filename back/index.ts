import { randomUUID } from "crypto";
import GameRoom, { type PlayerInfo } from "./logic/GameRoom.ts";
import SpyGameRoom from "./logic/SpyGameRoom.ts";

const rooms = new Map<string, GameRoom>();

const server = Bun.serve<PlayerInfo>({
  fetch(request, server) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      const success = server.upgrade(request, {
        data: {
          createdAt: Date.now(),
          roomId:
            new URL(request.url).searchParams.get("roomId") || randomUUID(),
          username: new URL(request.url).searchParams.get("username"),
          playerId: randomUUID(),
        },
      });
      return success
        ? undefined
        : new Response("WebSocket upgrade error", { status: 400 });
    }
    if (url.pathname === "/health") return new Response("alive!");
    return new Response("404!", { status: 404 });
  },
  websocket: {
    message(ws, message) {
      const room = rooms.get(ws.data.roomId);
      if (!room) {
        return;
        // FIXME?
      }
      if (typeof message === "string") {
        room.parseMessage(ws, JSON.parse(message));
      }
    },
    open(ws) {
      let room = rooms.get(ws.data.roomId);
      if (!room) {
        room = new SpyGameRoom({
          id: ws.data.roomId,
          broadcast: (message: string) =>
            server.publish(ws.data.roomId, message),
        });
        rooms.set(ws.data.roomId, room);
      }

      ws.subscribe(ws.data.roomId);
      room.addPlayer(ws);
    },
    close(ws, code, message) {
      const room = rooms.get(ws.data.roomId);
      if (!room) {
        return;
        // FIXME?
      }
      if (room.removePlayer(ws.data.playerId)) {
        rooms.delete(ws.data.roomId);
      }
      ws.unsubscribe(ws.data.roomId); // Is this necessary?
    },
    drain(ws) {},
  },
});
