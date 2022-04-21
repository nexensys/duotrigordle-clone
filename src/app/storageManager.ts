import { START_DATE } from "../duotrigordle-copied/consts";
import { getTodaysId } from "../duotrigordle-copied/funcs";
import { GameState } from "../features/game/gameSlice";
import { GuessState } from "../features/game/guessSlice";
import { SettingsState } from "../features/game/settingsSlice";
import { newDaily } from "./createGame";

export function saveSettings(settings: SettingsState) {
  localStorage.setItem("savedSettings", JSON.stringify(settings));
}

export function saveGame(game: GameState) {
  localStorage.setItem("savedGame", JSON.stringify(game));
}

export function saveGuesses(guesses: GuessState) {
  localStorage.setItem("savedGuesses", JSON.stringify(guesses));
}

function verifyGameState(data: any): data is GameState {
  return (
    typeof data === "object" &&
    typeof data.id == "number" &&
    Array.isArray(data.words) &&
    (data.words as any[]).every(
      (letters) =>
        Array.isArray(letters) &&
        (letters as any[]).every(
          (letter) => typeof letter === "string" && /^[A-Z]$/.test(letter)
        )
    ) &&
    typeof data.gameOver === "boolean" &&
    (data.mode === "daily" || data.mode === "practice") &&
    typeof data.startDate === "number" &&
    (typeof data.endDate === "number" || data.endDate === null) &&
    Array.isArray(data.boardsCompleted) &&
    data.boardsCompleted.every((idx: any) => typeof idx === "number")
  );
}

export function loadSavedGame(): GameState {
  const saved = localStorage.getItem("savedGame");
  if (!saved) {
    return newDaily();
  }

  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch {
    return newDaily();
  }

  if (verifyGameState(parsed)) {
    return parsed;
  }

  return newDaily();
}

function verifySettingsState(data: any): data is SettingsState {
  return (
    typeof data === "object" &&
    typeof data.showTimer === "boolean" &&
    typeof data.colorBlind === "boolean" &&
    typeof data.hideKeyboard === "boolean" &&
    typeof data.darkMode === "boolean" &&
    typeof data.wideMode === "boolean"
  );
}

export function loadSavedSettings(): SettingsState {
  const saved = localStorage.getItem("savedSettings");
  if (!saved) {
    return {
      showTimer: false,
      colorBlind: false,
      hideKeyboard: false,
      darkMode: false,
      wideMode: false
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch {
    return {
      showTimer: false,
      colorBlind: false,
      hideKeyboard: false,
      darkMode: false,
      wideMode: false
    };
  }

  if (verifySettingsState(parsed)) {
    return parsed;
  }

  return {
    showTimer: false,
    colorBlind: false,
    hideKeyboard: false,
    darkMode: false,
    wideMode: false
  };
}

function verifyGuessState(data: any): data is GuessState {
  return (
    typeof data === "object" &&
    Array.isArray(data.current) &&
    data.current.every((l: any) => typeof l === "string") &&
    Array.isArray(data.guesses) &&
    data.guesses.every(
      (g: any) => Array.isArray(g) && g.every((l: any) => typeof l === "string")
    ) &&
    Array.isArray(data.guessedLetters) &&
    data.guessedLetters.every((l: any) => typeof l === "string")
  );
}

export function loadSavedGuesses(): GuessState {
  const saved = localStorage.getItem("savedGuesses");

  if (!saved) {
    return {
      current: [],
      guessedLetters: [],
      guesses: []
    };
  }

  let parsed;
  try {
    parsed = JSON.parse(saved);
  } catch {
    return {
      current: [],
      guessedLetters: [],
      guesses: []
    };
  }

  if (verifyGuessState(parsed)) {
    parsed.current = [];
    return parsed;
  }

  return {
    current: [],
    guessedLetters: [],
    guesses: []
  };
}
