import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { HelloWorld, fakeSubscriber as fakeHelloWorldSubscriber } from "./HelloWorld/HelloWorld";
import { Game } from "./Game/Game";
import { ContentSelector } from "./ContentSelector";
import { MessageSubscriber, subscribeToPostMessages } from "./utilities/vscode";

const contentMap: { [contentId: string]: () => JSX.Element } = {
  hello: () => <HelloWorld />,
  game: () => <Game />
};

const subscriberMap: { [contentId: string]: MessageSubscriber } = {
  hello: fakeHelloWorldSubscriber
};

const rootElem = document.getElementById("root");
const content = getContent(rootElem?.dataset.content);

ReactDOM.render(
  <StrictMode>
    {content}
  </StrictMode>,
  document.getElementById("root")
);

function getContent(contentId?: string): JSX.Element {
  if (!contentId || !(contentId in contentMap)) {
    return <ContentSelector contentMap={contentMap} onContentChange={updateSubscriber} />
  }

  return contentMap[contentId]();
}

function updateSubscriber(contentId: string) {
  const subscriber = subscriberMap[contentId];
  if (subscriber) {
    subscribeToPostMessages(subscriber);
  }
}
