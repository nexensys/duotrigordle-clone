import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { store } from "./app/store";
import { Provider } from "react-redux";
import * as serviceWorker from "./serviceWorker";
import {
  addCurrentGuess,
  addLetter,
  backspace
} from "./features/game/guessSlice";

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

window.addEventListener("keydown", (e) => {
  if (/^[a-z]$/.test(e.key) && !e.ctrlKey) {
    store.dispatch(addLetter(e.key.toLowerCase()));
  } else if (e.key.toLowerCase() === "backspace") {
    store.dispatch(backspace());
  } else if (e.key.toLowerCase() === "enter") {
    store.dispatch(addCurrentGuess());
    e.preventDefault();
  }
});

serviceWorker.register();
