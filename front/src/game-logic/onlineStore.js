import { createStore } from "solid-js/store";

let ws;

const [store, setStore] = createStore({
  players: [],
  // logs: [],
  leaderId: "",
  roomId: "",
  language: "",
  categories: [],
  numberOfSpies: 0,
  word: "",
  round: 0,
  username: "",
  playerId: "",
});

const parseMessage = ({ type, payload }) => {
  if (type === "roomInfo") {
    setStore(payload);
    return;
  }
  if (type === "playerJoined") {
    setStore("players", store.players.length, payload);
    // setStore("logs", store.logs.length, t("playerJoinedTemplate")(payload));
    return;
  }
  if (type === "playerLeft") {
    setStore("players", (allPlayers) => [
      ...allPlayers.filter((p) => p.id !== payload.id),
    ]);
    // setStore("logs", store.logs.length, t("playerLeftTemplate")(payload));
    return;
  }
  if (type === "playerKicked") {
    setStore("players", (allPlayers) => [
      ...allPlayers.filter((p) => p.id !== payload.id),
    ]);
    // setStore("logs", store.logs.length, t("playerKickedTemplate")(payload));
    return;
  }
  if (type === "leaderChange") {
    setStore(payload);
    // setStore("logs", store.logs.length, t("newLeaderTemplate")(payload));
    return;
  }
  if (type === "config") {
    setStore(payload);
    return;
  }
  if (type === "word") {
    setStore(payload);
    return;
  }
};

const _connect = ({ roomId, username }) => {
  ws = new WebSocket(
    `${import.meta.env.VITE_API_WS_URL}/?username=${username}&roomId=${roomId || ""}`,
  );
  ws.addEventListener("message", (event) => {
    parseMessage(JSON.parse(event.data));
  });

  ws.addEventListener("open", (event) => {});

  ws.addEventListener("close", (event) => {});

  ws.addEventListener("error", (event) => {});
};

const joinRoom = () => {
  _connect({
    roomId: store.roomId,
    username: store.username || localStorage.getItem("username") || "John",
  });
};

const setConfig = ({ language, categories, numberOfSpies }) => {
  ws.send(
    JSON.stringify({
      action: "config",
      payload: { language, categories, numberOfSpies },
    }),
  );
};

const setLeader = (playerId) => {
  ws.send(
    JSON.stringify({
      action: "changeLeader",
      payload: { playerId },
    }),
  );
};

const play = () => {
  ws.send(
    JSON.stringify({
      action: "play",
    }),
  );
};

const kickPlayer = (playerId) => {
  ws.send(
    JSON.stringify({
      action: "kickPlayer",
      payload: { playerId },
    }),
  );
};

const setUsername = (username) => {
  setStore("username", username);
  localStorage.setItem("username", username);
};

const setRoomId = (roomId) => {
  setStore("roomId", roomId);
};

const cleanup = () => {
  ws && ws.close();
};

export {
  joinRoom,
  setConfig,
  setLeader,
  play,
  kickPlayer,
  cleanup,
  setUsername,
  setRoomId,
};
export default store;
