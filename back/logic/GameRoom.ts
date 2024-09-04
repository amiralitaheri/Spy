import type { ServerWebSocket } from "bun";

const isValidUsername = (username?: string) =>
  username && /\w{2,16}$/.test(username);

export type PlayerInfo = {
  createdAt: number;
  playerId: string;
  roomId: string;
  username: string;
};

const findOldestPlayerId = (players: ServerWebSocket<PlayerInfo>[]) => {
  let oldestId = players[0].data.playerId;
  let oldestCreatedAt = players[0].data.createdAt;
  for (let i = 1; i < players.length; i++) {
    if (players[i].data.createdAt < oldestCreatedAt) {
      oldestCreatedAt = players[i].data.createdAt;
      oldestId = players[i].data.playerId;
    }
  }
  return oldestId;
};

class GameRoom {
  protected players: Map<string, ServerWebSocket<PlayerInfo>>;
  private leaderId?: string;
  private readonly roomId: string;
  private readonly _broadcast: (message: string) => any;

  constructor({
    id,
    broadcast,
  }: {
    id: string;
    broadcast: (message: string) => any;
  }) {
    this.players = new Map();
    this.roomId = id;
    this._broadcast = broadcast;
  }

  addPlayer(ws: ServerWebSocket<PlayerInfo>) {
    if (!isValidUsername(ws.data.username)) {
      ws.close(1000, "Username is invalid");
      return;
    }
    this.players.set(ws.data.playerId, ws);

    if (!this.leaderId) {
      this.leaderId = ws.data.playerId;
    }

    this.broadcast({
      type: "playerJoined",
      payload: {
        id: ws.data.playerId,
        username: ws.data.username,
      },
    });

    ws.send(
      JSON.stringify({
        type: "roomInfo",
        payload: {
          roomId: this.roomId,
          playerId: ws.data.playerId,
          players: [...this.players.values()].map((player) => ({
            id: player.data.playerId,
            username: player.data.username,
          })),
          leaderId: this.leaderId,
        },
      }),
    );
  }

  removePlayer(id: string, kick = false) {
    const player = this.players.get(id);
    if (!player) return;
    this.players.delete(id);

    if (this.isLeader(player.data.playerId) && this.playerCount() > 0) {
      this.changeLeader(findOldestPlayerId([...this.players.values()]));
    }

    this.broadcast({
      type: kick ? "playerKicked" : "playerLeft",
      payload: {
        id,
        username: player.data.username,
      },
    });

    return this.playerCount() === 0;
  }

  isLeader(id?: string) {
    return this.leaderId === id;
  }

  broadcast(message: any) {
    this._broadcast(JSON.stringify(message));
  }

  broadcastPlayersList() {
    this._broadcast(
      JSON.stringify({
        type: "roomUpdate",
        payload: {
          players: [...this.players.values()].map((player) => ({
            id: player.data.playerId,
            username: player.data.username,
          })),
        },
      }),
    );
  }

  playerCount() {
    return this.players.size;
  }

  changeLeader(newLeaderId: string) {
    if (this.players.has(newLeaderId)) {
      this.leaderId = newLeaderId;
      this.broadcast({
        type: "leaderChange",
        payload: { leaderId: this.leaderId },
      });
    }
  }

  parseMessage(ws: ServerWebSocket<PlayerInfo>, message: any) {
    if (this.isLeader(ws.data.playerId)) {
      if (message.action === "kickPlayer") {
        this.removePlayer(message.payload.playerId, true);
        return true;
      }
      if (message.action === "changeLeader") {
        this.changeLeader(message.payload.playerId);
        return true;
      }
    }
    return false;
  }
}

export default GameRoom;
