import React from "react";
import { Maximize2, Minimize2 } from "react-feather";

const WideMode: React.FC<{
  checked: boolean;
  onChange: (checked: boolean) => void;
}> = (props) => {
  return (
    <div
      onClick={() => void props.onChange(!props.checked)}
      style={{
        whiteSpace: "nowrap",
        display: "flex",
        placeItems: "center",
        cursor: "pointer",
        color: "var(--text)",
        margin: "0 0.3rem"
      }}
    >
      {!props.checked ? <Maximize2 /> : <Minimize2 />}
    </div>
  );
};

export default WideMode;
