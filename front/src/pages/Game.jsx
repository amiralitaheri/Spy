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
            !showTheWord() && "fade-in",
          )}
        >
          <div class="swap-on flex aspect-square w-full flex-col rounded bg-base-300 p-8 text-center">
            <Show when={store.roleArray[playerIndex()]}>
              <div class="my-auto">{t("youAreSpy")}</div>
            </Show>

            <Show when={!store.roleArray[playerIndex()]}>
              <div>{t("theWordIs")}</div>
              <div class="m-auto text-4xl font-bold">{store.word}</div>
            </Show>
          </div>

          <div class="swap-off flex aspect-square w-full flex-col rounded bg-base-300 p-8 text-center">
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
