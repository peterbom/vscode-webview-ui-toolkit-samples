import { Uri } from "vscode";
import { MessageSink, MessageSubscriber } from "../contract/messaging";
import { GameContract } from "../contract/webviewContracts";
import { BasePanel, PanelDataProvider } from "./BasePanel";

export class GamePanel extends BasePanel<void, never, never> {
  constructor(extensionUri: Uri) {
    super(extensionUri, GameContract.viewInfo);
  }
}

export class GameDataProvider implements PanelDataProvider<void, never, never> {
  getInitialState(): void {
    return undefined;
  }

  createSubscriber(_webview: MessageSink<never>): MessageSubscriber<never> | null {
    return null;
  }
}