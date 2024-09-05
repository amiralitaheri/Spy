import store, { startNewGame } from "../game-logic/store.js";
import { language, t } from "../i18n.js";
import { unwrap } from "solid-js/store";
import { useNavigate } from "@solidjs/router";
import GameConfig from "../components/GameConfig.jsx";

const NewGameSetup = () => {
  const navigate = useNavigate();

  return (
    <GameConfig
      hide={["username", "language"]}
      defaults={{
        language: language(),
        numberOfPlayers: store.numberOfPlayers,
        numberOfSpies: store.numberOfSpies,
        categories: unwrap(store.wordCategories),
      }}
      onFinish={({ categories, numberOfSpies, numberOfPlayers }) => {
        navigate("/game");
        startNewGame({
          wordCategories: categories,
          numberOfSpies: numberOfSpies,
          numberOfPlayers: numberOfPlayers,
        });
      }}
      submitText={t("startTheGame")}
    />
  );
};

export default NewGameSetup;
