import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { className, isValidWord, range } from "../../utils";
import { completeBoard } from "../game/gameSlice";
import BoardStyle from "./Board.module.css";

const Tile: React.FC<{
  letter: string;
  inWord: boolean;
  correctPlace: boolean;
  wordIncorrect: boolean;
  finishedGuess: boolean;
}> = (props) => {
  return (
    <div
      className={className(
        BoardStyle.Tile,
        props.correctPlace && BoardStyle.Green,
        props.inWord && !props.correctPlace && BoardStyle.Yellow,
        props.wordIncorrect && BoardStyle.Incorrect,
        props.finishedGuess && BoardStyle.UsedTile
      )}
    >
      <div className={BoardStyle.Letter}>{props.letter}</div>
    </div>
  );
};

const Row: React.FC<{
  guess: string[];
  correctWord: string[];
  isCurrentGuess: boolean;
}> = (props) => {
  return (
    <>
      {range(5).map((idx) => (
        <Tile
          key={idx}
          letter={props.guess[idx] || ""}
          inWord={
            !props.isCurrentGuess &&
            props.correctWord.includes(props.guess[idx] || "__")
          }
          correctPlace={
            !props.isCurrentGuess &&
            props.correctWord[idx] === (props.guess[idx] || "__")
          }
          wordIncorrect={!(isValidWord(props.guess) || props.guess.length < 5)}
          finishedGuess={!props.isCurrentGuess && props.guess.length < 5}
        />
      ))}
    </>
  );
};

const RowMemo = React.memo(Row, function (prev, next) {
  return (
    prev.guess.join("") === next.guess.join("") &&
    prev.correctWord.join("") === next.correctWord.join("") &&
    prev.isCurrentGuess === next.isCurrentGuess
  );
});

const Board: React.FC<{ index: number }> = (props) => {
  const game = useAppSelector((state) => state.game);
  const guess = useAppSelector((state) => state.guess);
  const dispatch = useAppDispatch();

  const correctWord = useMemo(() => {
    return game.words[props.index] || ["_", "_", "_", "_", "_"];
  }, [game.words, props.index]);

  const correctGuessIdx = useMemo(() => {
    return guess.guesses.findIndex(
      (letters) => letters.join("") === correctWord?.join("")
    );
  }, [guess.guesses, correctWord]);

  const boardComplete = useMemo(() => {
    return correctGuessIdx >= 0;
  }, [correctGuessIdx]);

  if (boardComplete && !game.boardsCompleted.includes(props.index)) {
    dispatch(completeBoard(props.index));
  }

  const shownGuesses = useMemo(() => {
    return correctGuessIdx >= 0
      ? guess.guesses.slice(0, correctGuessIdx + 1)
      : guess.guesses;
  }, [correctGuessIdx, guess.guesses]);

  return (
    <div
      className={className(
        BoardStyle.Board,
        boardComplete && BoardStyle.Complete
      )}
    >
      {range(37).map((idx) => (
        <RowMemo
          key={idx}
          guess={
            idx >= shownGuesses.length
              ? idx === shownGuesses.length && !boardComplete
                ? guess.current
                : []
              : shownGuesses[idx]
          }
          isCurrentGuess={idx === shownGuesses.length}
          correctWord={correctWord}
        />
      ))}
    </div>
  );
};

const BoardContainer: React.FC<{}> = () => {
  return (
    <div className={BoardStyle.Container}>
      {range(32).map((idx) => (
        <Board key={idx} index={idx} />
      ))}
    </div>
  );
};

export default BoardContainer;
