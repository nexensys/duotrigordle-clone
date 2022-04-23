import React from "react";
import { START_DATE } from "../../duotrigordle-copied/consts";
import InterfaceStyle from "./Interface.module.css";

function getHoursRemaining() {
  const now = new Date();
  const diff = now.getTime() - START_DATE.getTime();
  const hoursRemaining = 24 - ((diff / 1000 / 60 / 60) % 24);
  if (hoursRemaining > 0.95) {
    return hoursRemaining.toFixed(0);
  } else {
    return hoursRemaining.toFixed(1);
  }
}

const Seperator: React.FC<{}> = () => {
  return (
    <div
      style={{
        height: 2,
        backgroundColor: "white",
        margin: "0.5em 0"
      }}
    />
  );
};

const About: React.FC<{
  close: () => void;
}> = (props) => {
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
        About
      </p>
      <Seperator />
      <div>
        <p>
          Guess all 32 of the words in 37 tries! Looking for an extra challenge?
          Try to keep your guess score positive!
        </p>{" "}
        <p>
          The next duotrigordle puzzle will be avalible in {getHoursRemaining()}{" "}
          hours.
        </p>
      </div>
      <Seperator />
      <div>
        <p>
          ErrorGamer2000's clone of{" "}
          <a
            href="https://duotrigordle.com"
            style={{
              color: "currentcolor"
            }}
          >
            Duotrigordle
          </a>
          , with a few extra features.
        </p>
        <p>
          The source code is avaliable on{" "}
          <a
            href="https://github.com/ErrorGamer2000/duotrigordle-clone"
            style={{
              color: "currentcolor"
            }}
          >
            GitHub
          </a>
          .
        </p>
      </div>
      <Seperator />
      <p>
        Heavily based on Bryan Chen's{" "}
        <a
          href="https://duotrigordle.com"
          style={{
            color: "currentcolor"
          }}
        >
          Duotrigordle
        </a>{" "}
        and{" "}
        <a
          href="https://www.nytimes.com/games/wordle/index.html"
          style={{
            color: "currentcolor"
          }}
        >
          Wordle
        </a>
        .
      </p>
      <Seperator />
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

export default About;
