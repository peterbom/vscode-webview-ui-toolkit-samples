import { Uri } from "vscode";
import { MessageSink, MessageSubscriber } from "../contract/messaging";
import { HelloWorldContract } from "../contract/webviewContracts";
import { BasePanel, PanelDataProvider } from "./BasePanel";

export class HelloWorldPanel extends BasePanel<HelloWorldContract.InitialState, HelloWorldContract.ToWebViewMessage, HelloWorldContract.ToVsCodeMessage> {
  constructor(extensionUri: Uri) {
    super(extensionUri, HelloWorldContract.viewInfo);
  }
}

export class HelloWorldDataProvider implements PanelDataProvider<HelloWorldContract.InitialState, HelloWorldContract.ToWebViewMessage, HelloWorldContract.ToVsCodeMessage> {
  getInitialState(): HelloWorldContract.InitialState {
    return { value: 10 };
  }

  createSubscriber(webview: MessageSink<HelloWorldContract.ToWebViewMessage>): MessageSubscriber<HelloWorldContract.ToVsCodeMessage> | null {
    return MessageSubscriber.create<HelloWorldContract.ToVsCodeMessage>()
      .withHandler("addOneRequest", msg => this.handleAddOneRequest(msg, webview));
  }

  handleAddOneRequest(message: HelloWorldContract.AddOneRequest, webview: MessageSink<HelloWorldContract.ToWebViewMessage>) {
    webview.postMessage({
      command: "addOneResponse",
      value: message.value + 1
    });
  }
}
