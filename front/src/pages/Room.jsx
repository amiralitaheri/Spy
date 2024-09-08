import { createEffect, For, onMount, Show } from "solid-js";
import onlineStore, {
  joinRoom,
  kickPlayer,
  onLeave,
  play,
  setConfig,
  setLeader,
  setRoomId,
} from "../game-logic/onlineStore.js";
import { useNavigate, useParams } from "@solidjs/router";
import { language, t } from "../i18n.js";
import { cn } from "../utils.js";
import GameConfig from "../components/GameConfig.jsx";
import { unwrap } from "solid-js/store";

const Room = () => {
  const navigate = useNavigate();
  const params = useParams();
  let configModal;

  onMount(() => {
    if (params.id) {
      setRoomId(params.id);
    }
    joinRoom();
  });

  createEffect(() => {
    navigate(`/room/${onlineStore.roomId}`, { replace: true });
  });

  const isLeader = () => onlineStore.leaderId === onlineStore.playerId;
  const waitingForMorePlayers = () => onlineStore.players.length < 3;
  return (
    <>
      <dialog ref={configModal} class="modal">
        <div class="modal-box flex h-[80vh] flex-col">
          <GameConfig
            defaults={{
              language: onlineStore.language,
              numberOfSpies: onlineStore.numberOfSpies,
              categories: unwrap(onlineStore.categories),
            }}
            hide={["numberOfPlayers", "username"]}
            submitText={t("editConfig")}
            onFinish={({ categories, language, numberOfSpies }) => {
              setConfig({ language, categories, numberOfSpies });
              configModal.close();
            }}
          />
        </div>
        <form method="dialog" class="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
      <div class="flex flex-grow flex-col gap-4">
        <div class="flex w-full flex-col rounded-lg bg-base-300 p-8 text-center">
          <Show
            when={onlineStore.word !== ""}
            fallback={
              isLeader() ? (
                <div>{t("waitingForYouToStartTheGame")}</div>
              ) : (
                <div>{t("pleaseWaitForTheNextRound")}</div>
              )
            }
          >
            <div class="mb-4">{`${t("round")} ${onlineStore.round}`}</div>
            <Show when={onlineStore.word === null}>
              <div class="my-auto text-xl">{t("youAreSpy")}</div>
            </Show>

            <Show when={onlineStore.word}>
              <div>{t("theWordIs")}</div>
              <div class="m-auto text-4xl font-bold">{onlineStore.word}</div>
            </Show>
          </Show>
        </div>
        <Show when={isLeader()}>
          <button
            class="btn btn-primary"
            onClick={() => play()}
            disabled={waitingForMorePlayers()}
          >
            {waitingForMorePlayers()
              ? t("waitingForMorePlayers")
              : t(onlineStore.round > 0 ? "newRound" : "startTheGame")}
          </button>
        </Show>
        <div class="flex flex-col">
          <label class="label font-bold">{t("config")}</label>
          <div class="relative rounded-lg bg-base-300 px-4 py-2">
            <ul>
              <li class="flex gap-2">
                <div>{t("language")}</div>:<div>{onlineStore.language}</div>
              </li>
              <li class="flex gap-2">
                <div>{t("categories")}</div>:
                <div>{onlineStore.categories.map((c) => t(c)).join(", ")}</div>
              </li>
              <li class="flex gap-2">
                <div>{t("numberOfSpies")}</div>:
                <div>{onlineStore.numberOfSpies || t("auto")}</div>
              </li>
            </ul>
            <Show when={isLeader()}>
              <button
                class="btn btn-outline btn-sm absolute end-2 top-2"
                onClick={() => {
                  configModal.showModal();
                }}
              >
                {t("edit")}
              </button>
            </Show>
          </div>
        </div>
        <hr class="divider" />
        <div class="flex flex-col">
          <label class="label font-bold">{t("roomLink")}</label>
          <div class="flex items-center justify-between gap-4 rounded-lg bg-base-300 px-4 py-2">
            <div class="font-mono">{`${import.meta.env.VITE_SHORT_URL}/${onlineStore.roomId}`}</div>
            <button
              class="btn btn-outline btn-sm"
              onClick={() => {
                copy(`${import.meta.env.VITE_SHORT_URL}/${onlineStore.roomId}`);
              }}
            >
              {t("copy")}
            </button>
          </div>
        </div>
        <div class="flex flex-grow flex-col">
          <label class="label font-bold">{t("players")}</label>
          <ul class="flex h-4 flex-grow flex-col gap-2 overflow-y-auto">
            <For each={onlineStore.players}>
              {(player) => (
                <li class="flex items-center gap-2 rounded-xl bg-base-200 px-4 py-2">
                  <div class="avatar placeholder">
                    <div class="w-8 rounded-full bg-neutral text-neutral-content">
                      <span class="text">
                        {player.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>{player.username}</div>
                  <Show when={onlineStore.leaderId === player.id}>
                    <div class="badge badge-warning gap-2">{t("leader")}</div>
                  </Show>
                  <Show
                    when={isLeader() && player.id !== onlineStore.playerId}
                    fallback={
                      <div
                        class={cn(
                          language() === "fa" ? "mr-auto" : "ml-auto",
                          "flex gap-2",
                        )}
                      >
                        <button
                          class="btn btn-outline btn-sm"
                          onClick={() => {
                            onLeave(player.id);
                            navigate("/");
                          }}
                        >
                          {t("leave")}
                        </button>
                      </div>
                    }
                  >
                    <div
                      class={cn(
                        language() === "fa" ? "mr-auto" : "ml-auto",
                        "flex gap-2",
                      )}
                    >
                      <button
                        class="btn btn-outline btn-sm"
                        onClick={() => {
                          setLeader(player.id);
                        }}
                      >
                        {t("promote")}
                      </button>
                      <button
                        class="btn btn-outline btn-error btn-sm"
                        onClick={() => {
                          kickPlayer(player.id);
                        }}
                      >
                        {t("kick")}
                      </button>
                    </div>
                  </Show>
                </li>
              )}
            </For>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Room;
