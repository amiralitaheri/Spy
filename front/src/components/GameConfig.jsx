import { For, Show } from "solid-js";
import { getWords, t } from "../i18n.js";
import { createStore, unwrap } from "solid-js/store";
import { cn } from "../utils.js";

const GameConfig = (props) => {
  const [store, setStore] = createStore(props.defaults);

  const isFormValid = () => {
    if (
      !props.hide.includes("username") &&
      (store.username.length < 3 || store.username.length > 16)
    ) {
      setStore("usernameError", t("usernameError"));
      return false;
    }

    if (!props.hide.includes("numberOfPlayers") && store.numberOfPlayers <= 2) {
      setStore("numberOfPlayersError", t("shouldBeMoreThanTwo"));
      return false;
    }

    return true;
  };

  return (
    <form class="form-control flex w-full flex-grow flex-col gap-4 p-4">
      <Show when={!props.hide.includes("username")}>
        <div class="flex flex-col">
          <label class="label font-bold">{t("enterAUsername")}</label>
          <input
            class={cn(
              "input input-bordered w-full",
              store.usernameError && "input-error",
            )}
            minLength={2}
            maxLength={16}
            value={store.username}
            onInput={(e) => {
              setStore("usernameError", null);
              setStore("username", e.target.value);
            }}
          />
          <Show when={store.usernameError}>
            <div class="label label-text-alt text-error">
              {store.usernameError}
            </div>
          </Show>
        </div>
      </Show>
      <Show when={!props.hide.includes("categories")}>
        <div class="flex flex-grow flex-col">
          <label class="label label-text font-bold">
            {t("selectCategories")}
          </label>
          <div class="h-4 flex-grow overflow-y-auto">
            <Show
              when={!getWords.loading}
              fallback={<span class="loading loading-spinner" />}
            >
              <For each={Object.keys(getWords())}>
                {(category) => (
                  <label class="label cursor-pointer">
                    <span class="label-text">{t(category)}</span>
                    <input
                      onChange={(event) => {
                        if (event.currentTarget.checked) {
                          setStore(
                            "categories",
                            store.categories.length,
                            event.target.value,
                          );
                        } else {
                          setStore("categories", (prev) =>
                            prev.filter((c) => c !== event.target.value),
                          );
                        }
                      }}
                      value={category}
                      type="checkbox"
                      checked={
                        store.categories.includes(category)
                          ? "checked"
                          : undefined
                      }
                      class="checkbox-primary checkbox"
                    />
                  </label>
                )}
              </For>
            </Show>
          </div>
        </div>
      </Show>
      <Show when={!props.hide.includes("numberOfPlayers")}>
        <div>
          <label class="label label-text font-bold">
            {t("totalNumberOfPlayers")}
          </label>
          <input
            type="number"
            class={cn(
              "input input-bordered w-full",
              store.numberOfPlayersError && "input-error",
            )}
            value={store.numberOfPlayers}
            min={3}
            onChange={(e) => {
              setStore("numberOfPlayersError", null);
              setStore("numberOfPlayers", +e.target.value);
              setStore("numberOfSpies", Math.ceil(e.target.value / 4));
            }}
          />
          <Show when={store.numberOfPlayersError}>
            <div class="label label-text-alt text-error">
              {store.numberOfPlayersError}
            </div>
          </Show>
        </div>
      </Show>
      <Show when={!props.hide.includes("numberOfSpies")}>
        <div>
          <label class="label label-text font-bold">{t("numberOfSpies")}</label>
          <input
            type="number"
            class={cn(
              "input input-bordered w-full",
              store.numberOfSpiesError && "input-error",
            )}
            value={store.numberOfSpies}
            min={1}
            onChange={(e) => {
              setStore("numberOfSpies", +e.target.value);
            }}
          />
          <div class="label">
            <span class="label-text-alt">{t("leaveEmptyForAuto")}</span>
          </div>
        </div>
      </Show>

      <button
        type="submit"
        class="btn btn-primary w-full"
        disabled={store.categories.length === 0}
        onClick={(e) => {
          e.preventDefault();
          if (isFormValid()) {
            props.onFinish(unwrap(store));
          }
        }}
      >
        {props.submitText}
      </button>
    </form>
  );
};

export default GameConfig;
