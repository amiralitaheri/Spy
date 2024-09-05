import GameRoom, { type PlayerInfo } from "./GameRoom.js";
import wordsFa from "../../front/public/fa/words.json";
import wordsEn from "../../front/public/en/words.json";
import type { ServerWebSocket } from "bun";

type Language = "fa" | "en";
const LANGUAGES = ["fa", "en"];
const DefaultLanguage: Language = "fa";

class SpyGameRoom extends GameRoom {
  private playedWords: string[];
  private language: Language;
  private categories: string[];
  private numberOfSpies: number;

  constructor(args: any) {
    super(args);
    this.playedWords = [];
    this.language = DefaultLanguage;
    this.categories = [];
    this.numberOfSpies = 0;
  }

  setGameConfig({
    language,
    categories,
    numberOfSpies,
  }: {
    language: Language;
    categories: string[];
    numberOfSpies: number;
  }) {
    this.language = LANGUAGES.includes(language) ? language : DefaultLanguage;
    const validCategories = Object.keys(this.getWords());
    this.categories = categories.filter((c) => validCategories.includes(c));
    this.numberOfSpies =
      !isNaN(numberOfSpies) && numberOfSpies > 0 ? numberOfSpies : 0;

    this.broadcast({
      type: "config",
      payload: {
        language: this.language,
        categories: this.categories,
        numberOfSpies: this.numberOfSpies,
      },
    });
  }

  parseMessage(ws: ServerWebSocket<PlayerInfo>, message: any) {
    if (super.parseMessage(ws, message)) {
      return true;
    }
    if (this.isLeader(ws.data.playerId)) {
      if (message.action === "config") {
        this.setGameConfig({
          language: message.payload.language,
          categories: message.payload.categories,
          numberOfSpies: message.payload.numberOfSpies,
        });
        return true;
      }
      if (message.action === "play") {
        this.dealRoles();
        return true;
      }
    }

    return false;
  }

  private getWords(): Record<string, string[]> {
    if (this.language === "fa") {
      return wordsFa;
    }
    if (this.language === "en") {
      return wordsEn;
    }
    throw new Error("Unsupported language " + this.language);
  }

  private getWord() {
    const words = [];
    for (const category of this.categories.length
      ? this.categories
      : Object.keys(this.getWords())) {
      words.push(...this.getWords()[category]);
    }
    let filteredWords = words.filter((w) => !this.playedWords.includes(w));
    if (!words.length) {
      this.playedWords = [];
      filteredWords = words;
    }
    const word =
      filteredWords[Math.floor(Math.random() * filteredWords.length)];

    this.playedWords.push(word);
    return word;
  }

  private createRoleArray(): [boolean[], number] {
    const numberOfSpies =
      this.numberOfSpies || Math.max(Math.floor(this.playerCount() / 4), 1);
    const roleArray = new Array(this.playerCount()).fill(false);
    for (let i = 0; i < numberOfSpies; ) {
      const r = Math.floor(Math.random() * this.playerCount());
      if (!roleArray[r]) {
        roleArray[r] = true;
      } else {
        continue;
      }
      i++;
    }
    return [roleArray, numberOfSpies];
  }

  dealRoles() {
    const players = [...this.players.values()];
    const [roles, numberOfSpies] = this.createRoleArray();
    const word = this.getWord();
    for (let i = 0; i < roles.length; i++) {
      players[i].send(
        JSON.stringify({
          type: "word",
          payload: {
            word: roles[i] ? null : word,
            round: this.playedWords.length,
            numberOfSpies,
          },
        }),
      );
    }
  }

  onJoinData() {
    return {
      ...super.onJoinData(),
      language: this.language,
      categories: this.categories,
      numberOfSpies: this.numberOfSpies,
    };
  }
}

export default SpyGameRoom;
