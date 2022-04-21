import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface GameState {
  id: number;
  words: string[][];
  gameOver: boolean;
  mode: "daily" | "practice";
  startDate: number;
  endDate: number | null;
  boardsCompleted: number[];
  initial?: boolean;
}

let initialState: GameState = {
  id: 0,
  words: [],
  gameOver: false,
  mode: "daily",
  startDate: 0,
  endDate: null,
  boardsCompleted: [],
  initial: true
};

export const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    loadGame(state, action: PayloadAction<GameState>) {
      const gs = action.payload;
      state.id = gs.id;
      state.words = gs.words;
      state.gameOver = gs.gameOver;
      state.mode = gs.mode;
      state.startDate = gs.startDate;
      state.endDate = gs.endDate;
      state.boardsCompleted = gs.boardsCompleted;
      state.initial = gs.initial;
    },

    start(state) {
      state.startDate = Date.now();
      state.initial = false;
    },

    end(state) {
      state.endDate = Date.now();
      state.gameOver = true;
    },

    setMode(state, action: PayloadAction<"daily" | "practice">) {
      state.mode = action.payload;
    },

    completeBoard(state, action: PayloadAction<number>) {
      state.boardsCompleted.push(action.payload);
    }
  }
});

export const { loadGame, start, end, setMode, completeBoard } =
  gameSlice.actions;

export default gameSlice.reducer;
