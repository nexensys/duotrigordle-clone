import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { addCurrentGuess, addLetter, backspace } from "../game/guessSlice";
import KeyboardStyle from "./Keyboard.module.css";
import { CornerDownLeft, Delete } from "react-feather";
import { className } from "../../utils";

const Key: React.FC<
  | {
      backspace: true;
      enter: false;
    }
  | {
      backspace: false;
      letter: string;
      enter: false;
      index: number;
    }
  | {
      backspace: false;
      enter: true;
    }
> = (props) => {
  const dispatch = useAppDispatch();
  const words = useAppSelector((state) => state.game.words);
  const guesses = useAppSelector((state) => state.guess.guesses);
  const guessedLetters = useAppSelector((state) => state.guess.guessedLetters);
  /*
    ? 0 = not used
    ? 1 = in word
    ? 2 = correct placement
   */
  const colors: number[] = useMemo(() => {
    return words.map((word) => {
      if (props.backspace || props.enter) return 0;
      if (!word.includes(props.letter)) return 0;
      if (
        guesses.findIndex((guess) => {
          return guess.join("") === word.join("");
        }) >= 0
      )
        return 0;
      if (
        guesses.findIndex((guess) => {
          return guess[word.indexOf(props.letter)] === props.letter;
        }) >= 0
      )
        return 2;
      if (
        guesses.findIndex((guess) => {
          return guess.includes(props.letter);
        }) >= 0
      )
        return 1;
      return 0;
    });
  }, [
    words,
    guesses,
    props.enter,
    props.backspace,
    //@ts-ignore
    props.letter
  ]);
  return (
    <div
      key={props.backspace ? "backspace" : props.enter ? "enter" : props.index}
      className={
        props.enter
          ? KeyboardStyle.Enter
          : className(
              KeyboardStyle.Key,
              !props.backspace &&
                colors.every((c) => c === 0) &&
                guessedLetters.includes(props.letter) &&
                KeyboardStyle.KeyNotUsed,
              !props.backspace &&
                !props.enter &&
                props.letter === "L" &&
                KeyboardStyle.KeyL
            )
      }
      style={{
        gridRowStart: props.enter
          ? 2
          : props.backspace
          ? 3
          : 1 + (props.index < 19 ? Math.floor(props.index / 10) : 2),
        gridColumnStart: props.enter
          ? 9
          : props.backspace
          ? 1
          : 1 + (props.index < 19 ? props.index % 10 : (props.index + 2) % 10)
      }}
      onClick={() => {
        if (props.backspace) {
          dispatch(backspace());
        } else if (props.enter) {
          dispatch(addCurrentGuess());
        } else {
          dispatch(addLetter(props.letter));
        }
      }}
    >
      {props.backspace ? (
        <Delete className={KeyboardStyle.KeyLetter} height="1em" />
      ) : props.enter ? (
        <>
          <div
            className={KeyboardStyle.EnterPart}
            style={{
              gridRowStart: 2,
              gridColumnStart: 1,
              borderTopLeftRadius: "0.2em",
              borderBottomLeftRadius: "0.2em"
            }}
          ></div>
          <div
            className={KeyboardStyle.EnterPart}
            style={{
              gridRowStart: 2,
              gridColumnStart: 2,
              borderBottomRightRadius: "0.2em"
            }}
          >
            <CornerDownLeft height="1em" />
          </div>
          <div
            className={KeyboardStyle.EnterPart}
            style={{
              gridRowStart: 1,
              gridColumnStart: 2,
              borderTopRightRadius: "0.2em",
              borderTopLeftRadius: "0.2em"
            }}
          ></div>
        </>
      ) : (
        <div className={KeyboardStyle.KeyLetter}>{props.letter}</div>
      )}
      <div className={KeyboardStyle.KeyColors}>
        {colors.map((c, i) => (
          <div
            key={`${i}-${c}`}
            className={className(
              KeyboardStyle.KeyIndicator,
              c === 2 && KeyboardStyle.KeyIndicatorCorrect,
              c === 1 && KeyboardStyle.KeyIndicatorPartial
            )}
          ></div>
        ))}
      </div>
    </div>
  );
};

const keys = "qwertyuiopasdfghjklzxcvbnm";

const Keyboard: React.FC<{}> = () => {
  const hideKeyboard = useAppSelector((state) => state.settings.hideKeyboard);
  return !hideKeyboard ? (
    <div className={KeyboardStyle.Container}>
      {keys.split("").map((key, idx) => (
        <Key
          enter={false}
          backspace={false}
          letter={key.toUpperCase()}
          index={idx}
          key={key}
        />
      ))}
      <Key backspace={true} enter={false} />
      <Key backspace={false} enter={true} />
    </div>
  ) : (
    <React.Fragment />
  );
};

export default Keyboard;
