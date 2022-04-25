import React, { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import BoardContainer from "../board/Board";
import Keyboard from "../keyboard/Keyboard";
import InterfaceStyle from "./Interface.module.css";
import { DarkModeSwitch } from "react-toggle-dark-mode";
import WideMode from "./WideMode";
import FullScreen from "./FullScreen";
import { Calendar, HelpCircle, Menu } from "react-feather";
import { end, loadGame, start } from "../game/gameSlice";
import {
  colorBlind,
  darkMode,
  hideKeyboard,
  loadSettings,
  showTimer,
  wideMode
} from "../game/settingsSlice";
import {
  formatTimeElapsed,
  getTodaysId
} from "../../duotrigordle-copied/funcs";
import {
  NUM_BOARDS,
  NUM_GUESSES,
  START_DATE
} from "../../duotrigordle-copied/consts";
import {
  loadSavedGuesses,
  loadSavedGame,
  loadSavedSettings,
  saveSettings,
  saveGame,
  saveGuesses
} from "../../app/storageManager";
import { disable, loadGuesses } from "../game/guessSlice";
import { newDaily, newPractice } from "../../app/createGame";
import { className, range } from "../../utils";
import About from "./About";

const Header: React.FC<{
  openOptionsMenu: () => void;
  openAboutMenu: () => void;
}> = (props) => {
  const game = useAppSelector((state) => state.game);
  const settings = useAppSelector((state) => state.settings);
  const [fullScreen, setFullScreen] = useState(false);
  useEffect(() => {
    document.addEventListener("fullscreenchange", (e) => {
      console.log(e);
      if (!document.fullscreenElement) {
        setFullScreen(false);
      }
    });
  }, []);
  const dispatch = useAppDispatch();
  return (
    <div className={InterfaceStyle.TitleBar}>
      <button
        className={InterfaceStyle.PracticeButton}
        onClick={(e) => {
          dispatch(loadGame(newPractice()));
          dispatch(
            loadGuesses({
              current: [],
              guesses: [],
              guessedLetters: []
            })
          );
        }}
      >
        Practice
      </button>
      <p className={InterfaceStyle.Title}>
        {game.mode +
          " duotrigordle" +
          (game.mode === "daily" ? " #" + game.id : "")}
      </p>

      <div className={InterfaceStyle.ToolBar}>
        {/* Daily Button */}
        <div
          className={InterfaceStyle.Toggle}
          onClick={() => {
            if (game.mode === "practice") {
              dispatch(loadGame(loadSavedGame()));
              dispatch(loadGuesses(loadSavedGuesses()));
            }
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              display: "flex",
              placeItems: "center",
              cursor: "pointer",
              color: "var(--text)",
              margin: "0 0.3rem"
            }}
          >
            <Calendar />
          </div>
        </div>

        {/* About Button */}
        <div
          className={InterfaceStyle.Toggle}
          onClick={() => {
            props.openAboutMenu();
          }}
        >
          <div
            style={{
              whiteSpace: "nowrap",
              display: "flex",
              placeItems: "center",
              cursor: "pointer",
              color: "var(--text)",
              margin: "0 0.3rem"
            }}
          >
            <HelpCircle />
          </div>
        </div>

        {/* Dark Mode Button */}
        <div
          className={InterfaceStyle.Toggle}
          onClick={() => {
            dispatch(darkMode(!settings.darkMode));
          }}
        >
          <DarkModeSwitch
            checked={settings.darkMode}
            onChange={() => {}}
            className={InterfaceStyle.DarkModeToggle}
          />
        </div>

        {/* Wide Mode Button */}
        <div
          className={InterfaceStyle.Toggle}
          onClick={() => {
            dispatch(wideMode(!settings.wideMode));
          }}
        >
          <WideMode checked={settings.wideMode} onChange={() => {}} />
        </div>

        {/* Fullscreen Button */}
        <div
          className={InterfaceStyle.Toggle}
          onClick={() => {
            const elem = document.body;
            setFullScreen(!fullScreen);
            if (!fullScreen && elem) {
              (
                elem.requestFullscreen ||
                //@ts-ignore
                elem.mozRequestFullScreen ||
                //@ts-ignore
                elem.webkitRequestFullscreen ||
                //@ts-ignore
                elem.msRequestFullscreen
              ).call(elem);
            } else document.exitFullscreen();
          }}
        >
          <FullScreen checked={fullScreen} onChange={() => {}} />
        </div>

        {/* Menu Button */}
        <div
          className={InterfaceStyle.Toggle}
          onClick={() => {
            props.openOptionsMenu();
          }}
          style={{
            padding: "0 0.3rem"
          }}
        >
          <Menu />
        </div>
      </div>
      <div className={InterfaceStyle.TitleBarDivider} />
    </div>
  );
};

const OptionsMenu: React.FC<{
  close: () => void;
}> = (props) => {
  //const [hideKeyboard, setHideKeyboard] = useState(false);
  const settings = useAppSelector((state) => state.settings);
  const dispatch = useAppDispatch();
  return (
    <div className={InterfaceStyle.Menu}>
      <p
        style={{
          fontSize: "1.5em",
          textAlign: "center",
          margin: 0,
          lineHeight: 0
        }}
      >
        Options
      </p>
      <ul className={InterfaceStyle.OptionList}>
        <li>
          <label>
            <input
              type="checkbox"
              onChange={(e) => {
                dispatch(colorBlind(e.target.checked));
              }}
              checked={settings.colorBlind}
            />{" "}
            Colorblind mode
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              onChange={(e) => {
                dispatch(hideKeyboard(e.target.checked));
              }}
              checked={settings.hideKeyboard}
            />{" "}
            Hide keyboard
          </label>
        </li>
        <li>
          <label>
            <input
              type="checkbox"
              onChange={(e) => {
                if (e.target.checked) {
                  dispatch(showTimer(true));
                } else {
                  dispatch(showTimer(false));
                }
              }}
              checked={settings.showTimer}
            />{" "}
            Show speedrun timer
          </label>
        </li>
      </ul>
      <button
        className={InterfaceStyle.CloseMenu}
        onClick={() => {
          props.close();
        }}
      >
        Close
      </button>
    </div>
  );
};

const SpeedRunTimer: React.FC<{}> = () => {
  //const guesses = useAppSelector((state) => state.guess.guesses);
  const game = useAppSelector((state) => state.game);
  const settings = useAppSelector((state) => state.settings);
  const [updateTrigger, setTrigger] = useState(false);
  useEffect(() => {
    if (game.initial) return;
    const interval = setInterval(() => {
      setTrigger((t) => !t);
    }, 25);

    return () => void clearInterval(interval);
  }, [game.initial, updateTrigger]);

  const elapsed = useMemo(() => {
    return game.initial
      ? formatTimeElapsed(0)
      : formatTimeElapsed((game.endDate || Date.now()) - game.startDate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    game.endDate,
    game.startDate,
    game.initial,
    game.gameOver,
    updateTrigger
  ]);

  return (
    <div
      className={InterfaceStyle.StatsSpeedrun}
      style={{
        display: settings.showTimer ? "block" : "none"
      }}
    >
      {elapsed}
    </div>
  );
};

const Stats: React.FC<{}> = (props) => {
  const game = useAppSelector((state) => state.game);
  const guesses = useAppSelector((state) => state.guess.guesses);
  const extraGuesses =
    NUM_GUESSES -
    NUM_BOARDS -
    (guesses.length - game.boardsCompleted.length) -
    0; //! Figure out why this is necessary
  return (
    <div className={InterfaceStyle.Stats}>
      <div className={InterfaceStyle.StatsComplete}>
        Boards completed: {game.boardsCompleted.length}/32
      </div>
      <SpeedRunTimer />
      <div className={InterfaceStyle.StatsGuesses}>
        Guesses Used: {guesses.length}/37 (
        {extraGuesses > 0 ? "+" + extraGuesses : extraGuesses})
      </div>
    </div>
  );
};

const GameOver: React.FC<{}> = () => {
  const game = useAppSelector((state) => state.game);
  const guesses = useAppSelector((state) => state.guess.guesses);
  const numEmojis = [
    "0️⃣",
    "1️⃣",
    "2️⃣",
    "3️⃣",
    "4️⃣",
    "5️⃣",
    "6️⃣",
    "7️⃣",
    "8️⃣",
    "9️⃣"
  ];
  function compareWords(a: string[], b: string[]): boolean {
    return a.join("") === b.join("");
  }
  const text =
    `${
      game.mode === "daily" ? "Daily" : "Practice"
    } Duotrigordle\nGuesses: X/37\nTime: ${
      game.endDate && formatTimeElapsed(game.endDate - game.startDate)
    }\n` +
    range(8)
      .map((_idx) =>
        range(4)
          .map(
            (idx) =>
              "" +
              (guesses.findIndex(
                compareWords.bind(compareWords, game.words[4 * _idx + idx])
              ) < 9
                ? "0" +
                  (
                    guesses.findIndex(
                      compareWords.bind(
                        compareWords,
                        game.words[4 * _idx + idx]
                      )
                    ) + 1
                  ).toString()
                : (
                    guesses.findIndex(
                      compareWords.bind(
                        compareWords,
                        game.words[4 * _idx + idx]
                      )
                    ) + 1
                  ).toString())
          )
          .map((num) =>
            num !== "00"
              ? numEmojis[Number(num[0])] + numEmojis[Number(num[1])]
              : "🟥🟥"
          )
          .join(" ")
      )
      .join("\n");
  const [copySuccess, setCopySuccess] = useState<boolean | null>(null);
  return (
    <div className={InterfaceStyle.StatContainer}>
      <div className={InterfaceStyle.GameOverMask}>
        <div className={InterfaceStyle.GameOverStats}>
          <div className={InterfaceStyle.ShareCenter}>
            <pre className={InterfaceStyle.Guesses}>
              <div className={InterfaceStyle.GameStatsDisplay}>
                {`${
                  game.mode === "daily" ? "Daily" : "Practice"
                } Duotrigordle\nGuesses: X/37\nTime: ${
                  game.endDate &&
                  formatTimeElapsed(game.endDate - game.startDate)
                }`}
              </div>
              {range(32).map((idx) => {
                const boardGuesses =
                  guesses.findIndex(
                    compareWords.bind(compareWords, game.words[idx])
                  ) + 1;
                const formattedNum =
                  boardGuesses < 10
                    ? "0" + boardGuesses.toString()
                    : boardGuesses.toString();

                return (
                  <div className={InterfaceStyle.Guess}>
                    <div
                      className={className(
                        InterfaceStyle.GuessNum,
                        boardGuesses === 0 && InterfaceStyle.NotGuessed
                      )}
                    >
                      {formattedNum[0]}
                    </div>
                    <div
                      className={className(
                        InterfaceStyle.GuessNum,
                        boardGuesses === 0 && InterfaceStyle.NotGuessed
                      )}
                    >
                      {formattedNum[1]}
                    </div>
                  </div>
                );
              })}
            </pre>
            <button
              className={InterfaceStyle.CopyButton}
              onClick={() => {
                window.navigator.clipboard
                  .writeText(text)
                  .then(() => {
                    setCopySuccess(true);
                    setTimeout(() => setCopySuccess(null), 2000);
                  })
                  .catch(() => {
                    setCopySuccess(false);
                    setTimeout(() => setCopySuccess(null), 2000);
                  });
              }}
              style={{
                backgroundColor:
                  copySuccess === null
                    ? "var(--key-background)"
                    : copySuccess
                    ? "rgba(0, 255, 0, 0.25)"
                    : "rgba(255, 0, 0, 0.25)"
              }}
            >
              Copy
            </button>
          </div>
          <div className={InterfaceStyle.WordsList}>
            {game.words.map((word, idx) => (
              <p key={idx}>{word.join("")}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Interface: React.FC<{}> = () => {
  const dispatch = useAppDispatch();
  const id = getTodaysId();
  useLayoutEffect(() => {
    const savedGame = loadSavedGame();
    function getIDFromDate(d: number): number {
      const today = new Date(d);
      const diff = today.getTime() - START_DATE.getTime();
      return Math.ceil(diff / 1000 / 60 / 60 / 24);
    }
    if (getIDFromDate(savedGame.startDate) === id) {
      dispatch(loadGame(savedGame));
      dispatch(loadGuesses(loadSavedGuesses()));
    } else {
      dispatch(loadGame(newDaily()));
      dispatch(
        loadGuesses({
          current: [],
          guesses: [],
          guessedLetters: []
        })
      );
    }
    dispatch(loadSettings(loadSavedSettings()));
  }, [id, dispatch]);

  const settings = useAppSelector((state) => state.settings);
  useEffect(() => {
    document.body.classList[settings.hideKeyboard ? "add" : "remove"](
      "hidekeyboard"
    );
  }, [settings.hideKeyboard]);
  useEffect(() => {
    document.body.classList[settings.darkMode ? "add" : "remove"]("darkmode");
  }, [settings.darkMode]);
  useEffect(() => {
    document.body.classList[settings.wideMode ? "add" : "remove"]("widemode");
  }, [settings.wideMode]);
  useEffect(() => {
    document.body.classList[settings.colorBlind ? "add" : "remove"](
      "colorblind"
    );
  }, [settings.colorBlind]);

  useEffect(() => {
    saveSettings(settings);
  }, [settings]);

  const game = useAppSelector((state) => state.game);
  const guess = useAppSelector((state) => state.guess);
  const finished =
    game.boardsCompleted.length === 32 || guess.guesses.length === 37;
  useEffect(() => {
    if (finished && !game.gameOver) {
      dispatch(end());
      dispatch(disable(true));
    }
  }, [finished, game.gameOver, dispatch]);

  useEffect(() => {
    if (game.mode === "daily") saveGame(game);
  }, [game]);

  useEffect(() => {
    if (game.mode === "daily") saveGuesses(guess);
  }, [guess, game.mode]);

  useEffect(() => {
    if (guess.guesses.length === 1 && game.initial) {
      dispatch(start());
    }
  }, [dispatch, guess.guesses, game.startDate, game.initial]);

  const [optionsMenuOpen, setOptionsMenuOpen] = useState(false);
  const [aboutMenuOpen, setAboutMenuOpen] = useState(false);

  return (
    <div className={InterfaceStyle.Container}>
      <Header
        openOptionsMenu={setOptionsMenuOpen.bind(setOptionsMenuOpen, true)}
        openAboutMenu={setAboutMenuOpen.bind(setAboutMenuOpen, true)}
      />
      <Stats />
      <div className={InterfaceStyle.BoardSection}>
        <BoardContainer />
      </div>
      <div className={InterfaceStyle.KeyboardSection}>
        <Keyboard />
      </div>
      <div
        className={InterfaceStyle.MenuContainer}
        style={{
          ...(optionsMenuOpen
            ? {}
            : {
                display: "none"
              })
        }}
      >
        <OptionsMenu
          close={setOptionsMenuOpen.bind(setOptionsMenuOpen, false)}
        />
      </div>
      <div
        className={InterfaceStyle.MenuContainer}
        style={{
          ...(aboutMenuOpen
            ? {}
            : {
                display: "none"
              })
        }}
      >
        <About close={setAboutMenuOpen.bind(setAboutMenuOpen, false)} />
      </div>
      {game.gameOver ? <GameOver /> : <React.Fragment />}
    </div>
  );
};

export default Interface;
