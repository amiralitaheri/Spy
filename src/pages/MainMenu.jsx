import { setLanguage, t } from "../i18n.js";
import { gotoNewGame } from "../game-logic/store.js";
import { useRegisterSW } from "virtual:pwa-register/solid";
import { Show } from "solid-js";

const MainMenu = () => {
  let ul;

  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();

  return (
    <>
      <img class="w-1/2 mx-auto mt-4 mb-8" src="/logo.png" alt="Spy" />
      <button class="btn btn-block" onClick={() => gotoNewGame()}>
        {t("newGame")}
      </button>
      <button class="btn btn-block">{t("howToPlay")}</button>
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
