import { createSignal, Show } from "solid-js";
import { t } from "../i18n.js";
import { cn } from "../utils.js";
import store, { newRound } from "../game-logic/store.js";

const Game = () => {
  const [playerIndex, setPlayerIndex] = createSignal(0);
  const [showTheWord, setShowTheWord] = createSignal(false);

  return (
    <>
      <Show
        when={playerIndex() < store.numberOfPlayers}
        fallback={
          <button
            class="btn btn-primary my-auto"
            onClick={() => {
              setShowTheWord(false);
              setPlayerIndex(0);
              newRound();
            }}
          >
            {t("newRound")}
          </button>
        }
      >
        <div
          class={cn(
            "swap my-auto w-full cursor-default",
            showTheWord() && "swap-active",
          )}
        >
          <div class="bg-base-300 rounded p-8 w-full text-center aspect-square flex flex-col swap-on">
            <Show when={store.roleArray[playerIndex()]}>
              <div class="my-auto">{t("youAreSpy")}</div>
            </Show>

            <Show when={!store.roleArray[playerIndex()]}>
              <div>{t("theWordIs")}</div>
              <div class="font-bold text-4xl m-auto">{store.word}</div>
            </Show>
          </div>

          <div class="bg-base-300 rounded p-8 w-full text-center aspect-square flex flex-col swap-off">
            <div class="my-auto">{t("clickTheButtonBelowToSeeTheWord")}</div>
          </div>
        </div>

        <button
          class="btn btn-primary"
          onClick={() => {
            setShowTheWord((prev) => !prev);
            if (!showTheWord()) {
              setPlayerIndex((prev) => prev + 1);
            }
          }}
        >
          {showTheWord() ? t("iGotIt") : t("showTheWord")}
        </button>
      </Show>
    </>
  );
};

export default Game;
