import { language, setLanguage, t } from "../i18n.js";
import { useRegisterSW } from "virtual:pwa-register/solid";
import { Show, createResource } from "solid-js";
import { cn } from "../utils.js";

const fetchApiHealthCheck = async () => {
  const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/health`);
  return await response.text();
};

const MainMenu = () => {
  let ul;

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  const [data] = createResource(fetchApiHealthCheck);

  return (
    <>
      <img class="w-1/2 mx-auto mt-4 mb-8" src="/logo.png" alt="Spy" />
      <a
        class={cn(
          "btn btn-block",
          (data.loading || data.error) && "btn-disabled",
        )}
        href={data() ? "/r" : ""}
      >
        <Show when={data.loading}>
          <span class="loading loading-spinner"></span>
        </Show>
        {t("onlineGame")}
      </a>
      <a class="btn btn-block" href="/new-game">
        {t("offlineGame")}
      </a>
      <a
        class="btn btn-block"
        href={`https://github.com/amiralitaheri/Spy/blob/master/HowToPlay-${language()}.md`}
        target="_blank"
      >
        {t("howToPlay")}
      </a>
      <div class="dropdown">
        <div tabIndex={0} role="button" class="btn btn-block">
          {t("Language")}
        </div>
        <ul
          tabIndex={0}
          ref={ul}
          class="dropdown-content menu bg-base-100 rounded-box z-[1] w-full p-2 shadow"
        >
          <li
            onClick={() => {
              setLanguage("fa");
              ul.blur();
            }}
          >
            <a>فارسی</a>
          </li>
          <li
            onClick={() => {
              setLanguage("en");
              ul.blur();
            }}
          >
            <a>English</a>
          </li>
        </ul>
      </div>
      <a class="btn btn-block" href="https://amiralitaheri.com/games">
        {t("moreGames!")}
      </a>
      <Show when={needRefresh()}>
        <button
          class="btn btn-block btn-success animate-pulse"
          onClick={() => updateServiceWorker(true)}
        >
          {t("update")}
        </button>
      </Show>
    </>
  );
};

export default MainMenu;
