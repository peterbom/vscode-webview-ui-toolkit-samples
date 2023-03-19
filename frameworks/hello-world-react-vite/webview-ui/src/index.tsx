import React, { useState } from "react";
import ReactDOM from "react-dom";
import { HelloWorld } from "./HelloWorld/HelloWorld";
import { Game } from "./Game/Game";
import { ContentSelector } from "./ContentSelector";

const contentMap: { [contentId: string]: () => JSX.Element } = {
  hello: () => <HelloWorld />,
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
    return <ContentSelector contentMap={contentMap} />
  }

  return contentMap[contentId]();
}
