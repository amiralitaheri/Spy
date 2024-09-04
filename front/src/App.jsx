import MainMenu from "./pages/MainMenu.jsx";
import Game from "./pages/Game.jsx";
import NewGameSetup from "./pages/NewGameSetup.jsx";
import { cn } from "./utils.js";
import { language } from "./i18n.js";
import { Route, Router } from "@solidjs/router";
import RoomEntry from "./pages/RoomEntry.jsx";
import Room from "./pages/Room.jsx";

const Layout = (props) => {
  return (
    <div class={cn("w-screen h-screen flex flex-col", language())}>
      <div class="flex flex-col flex-grow m-4 p-8 bg-base-100 gap-4 rounded-xl min-w-96 mx-auto">
        {props.children}
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
