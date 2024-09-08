import MainMenu from "./pages/MainMenu.jsx";
import Game from "./pages/Game.jsx";
import NewGameSetup from "./pages/NewGameSetup.jsx";
import { cn } from "./utils.js";
import { language } from "./i18n.js";
import { Route, Router, useLocation, useNavigate } from "@solidjs/router";
import RoomEntry from "./pages/RoomEntry.jsx";
import Room from "./pages/Room.jsx";
import { Show } from "solid-js";

const Layout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <div class={cn("flex h-screen w-full flex-col", language())}>
      <Show when={location.pathname !== "/"}>
        <header class="relative mx-auto flex w-full max-w-96 justify-center p-2">
          <button
            class="btn btn-sm absolute start-0 text-start"
            onClick={() => navigate("/")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 24 24"
              class="size-6"
            >
              <path
                fill="currentColor"
                fill-rule="evenodd"
                d="M13.5,15.5c1.2,0,2.2,1,2.2,2.2v3.1c0,0.3,0.2,0.5,0.5,0.5H18c1.5,0,2.7-1.2,2.7-2.7V9.8
		c0-0.5-0.2-1-0.7-1.3l-6.6-5.3c-0.9-0.7-2.1-0.7-3,0L3.9,8.5C3.5,8.9,3.3,9.3,3.3,9.9v8.7c0,1.5,1.2,2.7,2.7,2.7h1.9
		c0.3,0,0.5-0.2,0.5-0.5c0-0.1,0-0.1,0-0.2v-2.9c0-1.2,1-2.2,2.2-2.2C10.6,15.5,13.5,15.5,13.5,15.5z M18,22.8h-1.9
		c-1.1,0-2-0.9-2-2v-3.1c0-0.4-0.3-0.7-0.7-0.7h-2.8c-0.4,0-0.7,0.3-0.7,0.7v3.1c0,0.1,0,0.1,0,0.2c-0.1,1-1,1.8-2,1.8H6
		c-2.3,0-4.2-1.9-4.2-4.2V9.9c0-1,0.5-1.9,1.3-2.5l6.5-5.2C11,1,13,1,14.4,2.1L21,7.4c0.8,0.6,1.2,1.5,1.2,2.5v8.7
		C22.2,20.9,20.4,22.8,18,22.8L18,22.8z"
              />
            </svg>
          </button>
          <h1 class="text-center text-xl font-bold">Spy</h1>
        </header>
      </Show>
      <div class="mx-auto flex w-full max-w-96 flex-grow flex-col gap-4 rounded-xl bg-base-100 p-8 py-2 sm:py-8">
        {props.children}
      </div>
      <footer class="h-fit w-full p-4 text-center text-sm">
        View on{" "}
        <a
          href="https://github.com/amiralitaheri/Spy"
          rel="noopener"
          class="link-hover link"
        >
          GitHub
        </a>{" "}
        <br />
        Made with ❤️ by{" "}
        <a href="https://amiralitaheri.com" class="link-hover link">
          Amirali
        </a>
      </footer>
    </div>
  );
};

const App = () => {
  return (
    <Router root={Layout}>
      <Route path="/" component={MainMenu} />
      <Route path="/game" component={Game} />
      <Route path="/new-game" component={NewGameSetup} />
      <Route path="/r/:id?" component={RoomEntry} />
      <Route path="/room/:id?" component={Room} />
      {/*<Route path="*404" component={NotFound} />*/}
    </Router>
  );
};

export default App;
