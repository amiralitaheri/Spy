import { createStore } from "solid-js/store";

let ws;

let messageQueue = [];

const Defaults = {
  players: [],
  // logs: [],
  leaderId: "",
  roomId: "",
  numberOfSpies: 0,
  word: "",
  round: 0,
  playerId: "",
};

const [store, setStore] = createStore({
  language: "",
  categories: [],
  username: "",
  ...Defaults,
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

  ws.addEventListener("open", (event) => {
    while (messageQueue.length) {
      ws.send(messageQueue.shift());
    }
  });

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
  setStore({ language, categories, numberOfSpies });
  const message = JSON.stringify({
    action: "config",
    payload: { language, categories, numberOfSpies },
  });
  if (ws && ws.readyState === ws.OPEN) {
    ws.send(message);
  } else {
    messageQueue.push(message);
  }
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

const onLeave = () => {
  ws && ws.close();
  setStore(Defaults);
};

export {
  joinRoom,
  setConfig,
  setLeader,
  play,
  kickPlayer,
  onLeave,
  setUsername,
  setRoomId,
};
export default store;
