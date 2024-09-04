import { useNavigate, useParams } from "@solidjs/router";
import { t } from "../i18n.js";
import onlineStore, {
  joinRoom,
  setUsername,
} from "../game-logic/onlineStore.js";
import { cn } from "../utils.js";

const RoomEntry = () => {
  const params = useParams();
  const usernameIsInvalid = () =>
    onlineStore.username.length < 3 || onlineStore.username.length > 16;
  const navigate = useNavigate();

  // TODO: Health check and show unavailable

  return (
    <form class="flex flex-col gap-4">
      <div class="flex flex-col">
        <label class="label font-bold">{t("enterAUsername")}</label>
        <input
          class="input input-bordered w-full"
          minLength={2}
          maxLength={16}
          value={onlineStore.username}
          onInput={(e) => {
            setUsername(e.target.value);
          }}
        />
      </div>

      <button
        type="submit"
        class={cn(
          "btn btn-block btn-primary",
          usernameIsInvalid() && "btn-disabled",
        )}
        disabled={usernameIsInvalid()}
        onClick={() => {
          navigate(`/room/${params.id || ""}`);
        }}
      >
        {params.id ? t("joinRoom") : t("createRoom")}
      </button>
    </form>
  );
};

export default RoomEntry;
