import { VSCodeButton } from "@vscode/webview-ui-toolkit/react";
import { useEffect, useState } from "react";
import styles from "./HelloWorld.module.css";
import { HelloWorldContract } from "../../../src/contract/webviewContracts";
import { getVscodeInterceptorMessageContext, getWebviewMessageContext } from "../utilities/vscode";
import { MessageSubscriber } from "../../../src/contract/messaging";
import { Scenario } from "../utilities/manualTest";

export function HelloWorld(props: HelloWorldContract.InitialState) {
  const [value, setValue] = useState(props.value);
  const vscode = getWebviewMessageContext<HelloWorldContract.ToVsCodeMessage, HelloWorldContract.ToWebViewMessage>();

  useEffect(() => {
    vscode.subscribeToMessages(createMessageSubscriber());
  }, []);

  function createMessageSubscriber(): MessageSubscriber<HelloWorldContract.ToWebViewMessage> {
    return MessageSubscriber.create<HelloWorldContract.ToWebViewMessage>()
      .withHandler("addOneResponse", handleResponse);
  }

  function sendRequest() {
    vscode.postMessage({
      command: "addOneRequest",
      value,
    });
  }

  function handleResponse(message: HelloWorldContract.AddOneResponse) {
    setValue(message.value);
  }

  return (
    <main className={styles.main}>
      <h1>Hello World!</h1>
      <VSCodeButton onClick={sendRequest}>Howdy!</VSCodeButton>
      <p>{value}</p>
    </main>
  );
}

export function getHelloWorldScenarios() {
  const webview = getVscodeInterceptorMessageContext<HelloWorldContract.ToWebViewMessage, HelloWorldContract.ToVsCodeMessage>();
  const subscriber = MessageSubscriber.create<HelloWorldContract.ToVsCodeMessage>().withHandler("addOneRequest", handleAddOneRequest);
  
  function handleAddOneRequest(message: HelloWorldContract.AddOneRequest) {
    webview.postMessage({
      command: "addOneResponse",
      value: message.value + 1
    });
  }
  
  const initialState: HelloWorldContract.InitialState = {
    value: 42
  };
  
  return [
    Scenario.create(HelloWorldContract.viewInfo.title, () => <HelloWorld {...initialState} />).withSubscription(webview, subscriber)
  ];
}
