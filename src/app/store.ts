import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit";
import gameReducer from "../features/game/gameSlice";
import guessSlice from "../features/game/guessSlice";
import settingsSlice from "../features/game/settingsSlice";

export const store = configureStore({
  reducer: {
    game: gameReducer,
    guess: guessSlice,
    settings: settingsSlice
  },
  devTools: true
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
