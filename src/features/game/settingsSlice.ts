import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SettingsState {
  showTimer: boolean;
  colorBlind: boolean;
  hideKeyboard: boolean;
  darkMode: boolean;
  wideMode: boolean;
}

const initialState: SettingsState = {
  showTimer: false,
  colorBlind: false,
  hideKeyboard: false,
  darkMode: false,
  wideMode: false
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    showTimer(state, action: PayloadAction<boolean>) {
      state.showTimer = action.payload;
    },

    colorBlind(state, action: PayloadAction<boolean>) {
      state.colorBlind = action.payload;
    },

    hideKeyboard(state, action: PayloadAction<boolean>) {
      state.hideKeyboard = action.payload;
    },

    darkMode(state, action: PayloadAction<boolean>) {
      state.darkMode = action.payload;
    },

    wideMode(state, action: PayloadAction<boolean>) {
      state.wideMode = action.payload;
    },

    loadSettings(state, action: PayloadAction<SettingsState>) {
      const settings = action.payload;

      state.showTimer = settings.showTimer;
      state.colorBlind = settings.colorBlind;
      state.hideKeyboard = settings.hideKeyboard;
      state.darkMode = settings.darkMode;
      state.wideMode = settings.wideMode;
    }
  }
});

export const {
  showTimer,
  colorBlind,
  hideKeyboard,
  darkMode,
  wideMode,
  loadSettings
} = settingsSlice.actions;

export default settingsSlice.reducer;
