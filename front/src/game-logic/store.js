import { createStore } from "solid-js/store";
import { getWords } from "../i18n.js";

const [store, setStore] = createStore({
  numberOfPlayers: 4,
  numberOfSpies: 1,
  roleArray: [], //IsSpyArray
  wordCategories: [],
  word: "",
});

let playedWords = [];

const saveState = () =>
  localStorage.setItem("GAMESTATE", JSON.stringify(store));

const init = () => {
  const raw = localStorage.getItem("GAMESTATE");
  if (raw) {
    setStore(JSON.parse(raw));
  }
  const p = localStorage.getItem("PLAYED");
  if (p) {
    playedWords = JSON.parse(p);
  }
};

init();

const getAWord = () => {
  const words = [];
  for (const category of store.wordCategories) {
    words.push(...getWords()[category]);
  }
  let filteredWords = words.filter((w) => !playedWords.includes(w));
  if (!words.length) {
    playedWords = [];
    filteredWords = words;
  }
  const word = filteredWords[Math.floor(Math.random() * filteredWords.length)];

  playedWords.push(word);
  localStorage.setItem("PLAYED", JSON.stringify(playedWords));
  return word;
};

const createRoleArray = ({ numberOfPlayers, numberOfSpies }) => {
  const roleArray = new Array(numberOfPlayers).fill(false);
  for (let i = 0; i < numberOfSpies; ) {
    const r = Math.floor(Math.random() * numberOfPlayers);
    if (!roleArray[r]) {
      roleArray[r] = true;
    } else {
      continue;
    }
    i++;
  }
  return roleArray;
};

const startNewGame = ({ wordCategories, numberOfPlayers, numberOfSpies }) => {
  setStore({
    wordCategories,
    numberOfPlayers,
    numberOfSpies,
    word: getAWord(wordCategories),
    roleArray: createRoleArray({ numberOfPlayers, numberOfSpies }),
  });
  saveState();
};

const newRound = () => {
  setStore({
    word: getAWord(store.wordCategories),
    roleArray: createRoleArray({
      numberOfPlayers: store.numberOfPlayers,
      numberOfSpies: store.numberOfSpies,
    }),
  });
  saveState();
};

export { startNewGame, newRound };

export default store;
