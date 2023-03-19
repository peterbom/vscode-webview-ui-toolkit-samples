import { vscode } from "../utilities/vscode";
import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import "./HelloWorld.css";
import { useEffect, useState } from "react";

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
    <main>
      <h1>Hello World!</h1>
      <VSCodeButton onClick={handleHowdyClick}>Howdy!</VSCodeButton>
      <p>{value}</p>
    </main>
  );
}
