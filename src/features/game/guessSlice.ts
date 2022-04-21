import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WORDS_VALID } from "../../duotrigordle-copied/consts";

export interface GuessState {
  current: string[];
  guesses: string[][];
  guessedLetters: string[];
  disabled?: boolean;
}

const initialState: GuessState = {
  current: [],
  guesses: [],
  guessedLetters: [],
  disabled: false
};

export const guessSlice = createSlice({
  name: "guess",
  initialState,
  reducers: {
    addLetter(state, action: PayloadAction<string>) {
      if (
        state.current.length < 5 &&
        state.guesses.length < 37 &&
        !state.disabled
      ) {
        state.current.push(action.payload.toUpperCase());
      }
    },

    backspace(state) {
      state.current.pop();
    },

    addCurrentGuess(state) {
      if (state.current.length < 5)
        console.warn("Guess length too small, failing silently.");
      else if (
        ![...WORDS_VALID].includes(state.current.join("")) ||
        state.disabled
      )
        return;
      else {
        state.guesses.push(state.current);
        state.current.forEach((letter) => {
          if (!state.guessedLetters.includes(letter))
            state.guessedLetters.push(letter);
        });
        state.current = [];
      }
    },

    loadGuesses(state, action: PayloadAction<GuessState>) {
      state.current = action.payload.current;
      state.guesses = action.payload.guesses;
      state.guessedLetters = action.payload.guessedLetters;
      state.disabled = !!action.payload.disabled;
    },

    disable(state, action: PayloadAction<boolean>) {
      state.disabled = action.payload;
    }
  }
});

export const { addLetter, backspace, addCurrentGuess, loadGuesses, disable } =
  guessSlice.actions;

export default guessSlice.reducer;
