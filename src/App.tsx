import React from "react";
import AppStyle from "./App.module.css";
import Interface from "./features/interface/Interface";

function App() {
  return (
    <div className={AppStyle.App}>
      <Interface />
    </div>
  );
}

export default App;
