import { MessageSubscriber, vscode } from "../utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useEffect, useState } from "react";
import styles from "./HelloWorld.module.css";

export function HelloWorld() {
  const [value, setValue] = useState(0);

  useEffect(() => {
    window.addEventListener('message', event => {
      const message = event.data;
      if (message.command === "addOneResponse") {
        setValue(message.value);
      }
    });
  });

  function handleHowdyClick() {
    vscode.postMessage({
      command: "addOneRequest",
      value,
    });
  }

  return (
    <main className={styles.main}>
      <h1>Hello World!</h1>
      <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
      <p>{value}</p>
    </main>
  );
}

export const fakeSubscriber: MessageSubscriber = {
  addOneRequest: message => {
    window.postMessage({
      command: "addOneResponse",
      value: message.value + 1
    });
  }
};