import { setLanguage, t } from "../i18n.js";
import { gotoNewGame } from "../game-logic/store.js";

const MainMenu = () => {
  let ul;
  return (
    <>
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
    </>
  );
};

export default MainMenu;
