import { useNavigate, useParams } from "@solidjs/router";
import { language, t } from "../i18n.js";
import onlineStore, {
  joinRoom,
  setConfig,
  setUsername,
} from "../game-logic/onlineStore.js";
import GameConfig from "../components/GameConfig.jsx";
import { unwrap } from "solid-js/store";

const RoomEntry = () => {
  const params = useParams();
  const navigate = useNavigate();

  // TODO: Health check and show unavailable
  return (
    <GameConfig
      defaults={{
        username: onlineStore.username,
        language: onlineStore.language,
        numberOfSpies: onlineStore.numberOfSpies,
        categories: unwrap(onlineStore.categories),
      }}
      hide={[
        "numberOfPlayers",
        ...(params.id ? ["categories", "language", "numberOfSpies"] : []),
      ]}
      submitText={params.id ? t("joinRoom") : t("createRoom")}
      onFinish={({ username, categories, language, numberOfSpies }) => {
        setUsername(username);
        setConfig({ language, categories, numberOfSpies });
        navigate(`/room/${params.id || ""}`);
      }}
    />
  );
};

export default RoomEntry;
