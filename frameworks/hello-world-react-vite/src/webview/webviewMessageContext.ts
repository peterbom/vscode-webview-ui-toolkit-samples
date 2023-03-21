import { Disposable, Webview } from "vscode";
import { MessageContext, MessageSubscriber } from "../contract/messaging";

export class WebviewMessageContext<TPostMsg, TListenMsg> implements MessageContext<TPostMsg, TListenMsg> {
  constructor(
    private readonly _webview: Webview,
    private readonly _disposables: Disposable[]
   ) {}

  postMessage(message: TPostMsg) {
    this._webview.postMessage(message);
  }

  subscribeToMessages(subscriber: MessageSubscriber<TListenMsg>) {
    this._webview.onDidReceiveMessage(
      (message: any) => {
        const command = message.command;
        if (!command) {
          throw new Error(`No 'command' property for message ${JSON.stringify(message)}`);
        }

        const handler = subscriber.getHandler(command);
        if (handler) {
          handler(message);
        }
      },
      undefined,
      this._disposables
    );
  }
}
