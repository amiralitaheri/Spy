import store, { startNewGame } from "../game-logic/store.js";
import { createSignal, For } from "solid-js";
import { getWords, t } from "../i18n.js";
import { createStore, unwrap } from "solid-js/store";

const NewGameSetup = () => {
  const [numberOfPlayers, setNumberOfPlayers] = createSignal(
    store.numberOfPlayers,
  );
  const [numberOfSpies, setNumberOfSpies] = createSignal(store.numberOfSpies);
  const [categories, setCategories] = createStore(unwrap(store.wordCategories));

  return (
    <div class="form-control w-full flex flex-col flex-grow p-4 gap-4">
      <div class="flex flex-col flex-grow">
        <div class="label">
          <span class="label-text font-bold">{t("selectCategories")}</span>
        </div>
        <div class="h-4 flex-grow overflow-y-auto">
          <For each={Object.keys(getWords())}>
            {(category) => (
              <label class="label cursor-pointer">
                <span class="label-text">{t(category)}</span>
                <input
                  onChange={(event) => {
                    if (event.currentTarget.checked) {
                      setCategories(categories.length, event.target.value);
                    } else {
                      setCategories(
                        categories.filter((c) => c !== event.target.value),
                      );
                    }
                  }}
                  value={category}
                  type="checkbox"
                  checked={
                    store.wordCategories.includes(category)
                      ? "checked"
                      : undefined
                  }
                  class="checkbox checkbox-primary"
                />
              </label>
            )}
          </For>
        </div>
      </div>
      <div>
        <div class="label">
          <span class="label-text font-bold">{t("totalNumberOfPlayers")}</span>
        </div>
        <input
          type="number"
          class="input input-bordered w-full"
          value={numberOfPlayers()}
          min={3}
          onChange={(e) => {
            setNumberOfPlayers(+e.target.value);
            setNumberOfSpies(Math.ceil(e.target.value / 4));
          }}
        />
      </div>
      <div>
        <div class="label">
          <span class="label-text font-bold">{t("numberOfSpies")}</span>
        </div>
        <input
          type="number"
          class="input input-bordered w-full "
          value={numberOfSpies()}
          min={1}
          max={Math.floor(numberOfPlayers() / 2)}
          onChange={(e) => {
            setNumberOfSpies(+e.target.value);
          }}
        />
      </div>

      <button
        class="btn btn-primary w-full"
        disabled={categories.length === 0}
        onClick={() => {
          startNewGame({
            wordCategories: categories,
            numberOfSpies: numberOfSpies(),
            numberOfPlayers: numberOfPlayers(),
          });
        }}
      >
        {t("startTheGame")}
      </button>
    </div>
  );
};

export default NewGameSetup;
