import {
  getTargetWords,
  getTodaysId,
  MersenneTwister
} from "../duotrigordle-copied/funcs";
import { GameState } from "../features/game/gameSlice";
import { memo } from "../utils";

export function newDaily(): GameState {
  const id = getTodaysId();
  const words: string[][] = memo(() => {
    return getTargetWords(id).map((w) => w.split(""));
  }, [id]);
  return {
    id: id,
    words,
    mode: "daily",
    startDate: 0,
    endDate: null,
    gameOver: false,
    boardsCompleted: [],
    initial: true
  };
}

export function newPractice(): GameState {
  const id = MersenneTwister().u32();
  const words: string[][] = memo(() => {
    return getTargetWords(id).map((w) => w.split(""));
  }, [id]);

  return {
    id: id,
    words,
    mode: "practice",
    startDate: 0,
    endDate: null,
    gameOver: false,
    boardsCompleted: [],
    initial: true
  };
}
