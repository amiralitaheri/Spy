import MainMenu from "./pages/MainMenu.jsx";
import Game from "./pages/Game.jsx";
import NewGameSetup from "./pages/NewGameSetup.jsx";
import store from "./game-logic/store.js";
import { Show } from "solid-js";
import { cn } from "./utils.js";
import { language } from "./i18n.js";

const App = () => {
  return (
    <div class={cn("w-screen h-screen flex flex-col", language())}>
      <div class="flex flex-col flex-grow m-4 p-4 bg-base-100 gap-2 rounded-xl min-w-96 mx-auto">
        <Show when={store.currentPage === "/"}>
          <MainMenu />
        </Show>
        <Show when={store.currentPage === "/game"}>
          <Game />
        </Show>
        <Show when={store.currentPage === "/new-game"}>
          <NewGameSetup />
        </Show>
      </div>
      <footer class="text-center w-full h-fit p-4">
        View on{" "}
        <a
          href="https://github.com/amiralitaheri/Spy"
          rel="noopener"
          class="link link-hover"
        >
          GitHub
        </a>{" "}
        <br />
        Made with ❤️ by{" "}
        <a href="https://amiralitaheri.com" class="link link-hover">
          Amirali
        </a>
      </footer>
    </div>
  );
};

export default App;
