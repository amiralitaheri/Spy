import { createEffect, For, onCleanup, onMount, Show } from "solid-js";
import onlineStore, {
  cleanup,
  joinRoom,
  kickPlayer,
  play,
  setLeader,
  setRoomId,
} from "../game-logic/onlineStore.js";
import { useNavigate, useParams } from "@solidjs/router";
import { language, t } from "../i18n.js";
import { cn } from "../utils.js";

const Room = () => {
  const navigate = useNavigate();
  const params = useParams();

  onMount(() => {
    if (params.id) {
      setRoomId(params.id);
    }
    joinRoom();
  });

  createEffect(() => {
    navigate(`/room/${onlineStore.roomId}`, { replace: true });
  });

  onCleanup(() => {
    cleanup();
  });

  const isLeader = () => onlineStore.leaderId === onlineStore.playerId;
  const waitingForMorePlayers = () => onlineStore.players.length < 3;
  return (
    <>
      <div class="flex flex-col gap-4 flex-grow">
        <div class="bg-base-300 rounded-lg p-8 w-full text-center flex flex-col">
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
              <div class="font-bold text-4xl m-auto">{onlineStore.word}</div>
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
        <hr />
        <div class="flex flex-col">
          <label class="label font-bold">{t("roomLink")}</label>
          <div class="flex items-center gap-4 bg-base-300 rounded-lg justify-between py-2 px-4">
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
        <div class="flex flex-col flex-grow">
          <label class="label font-bold">{t("players")}</label>
          <ul class="flex flex-col gap-2 h-4 flex-grow overflow-y-auto">
            <For each={onlineStore.players}>
              {(player) => (
                <li class="rounded-xl flex items-center gap-2 px-4 py-2 bg-base-200">
                  <div class="avatar placeholder">
                    <div class="bg-neutral text-neutral-content w-8 rounded-full">
                      <span class="text">
                        {player.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div>{player.username}</div>
                  <Show when={onlineStore.leaderId === player.id}>
                    <div class="badge badge-warning gap-2">{t("leader")}</div>
                  </Show>
                  <Show when={isLeader() && player.id !== onlineStore.playerId}>
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
                        class="btn btn-outline btn-sm btn-error"
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
