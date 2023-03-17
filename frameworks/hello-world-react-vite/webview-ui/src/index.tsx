import React, { useState } from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { Game } from "./Game";

const contentMap: { [contentId: string]: () => JSX.Element } = {
  app: () => <App />,
  game: () => <Game />
};

const rootElem = document.getElementById("root");
const content = getContent(rootElem?.dataset.content);

ReactDOM.render(
  <React.StrictMode>
    {content}
  </React.StrictMode>,
  document.getElementById("root")
);

function getContent(contentId?: string): JSX.Element {
  if (!contentId || !(contentId in contentMap)) {
    return <ContentSelector />
  }

  return contentMap[contentId]();
}

function ContentSelector() {
  const [selected, setSelected] = useState("");

  if (selected) {
    return contentMap[selected]();
  }

  return (
    <ul>
    {
      Object.keys(contentMap).map(id => (
        <li key={id}>
          <button onClick={() => setSelected(id)}>{id}</button>
        </li>
      ))
    }
    </ul>
  );
}