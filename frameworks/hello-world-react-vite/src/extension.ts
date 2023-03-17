import { commands, ExtensionContext } from "vscode";
import { BasePanel } from "./panels/BasePanel";
import { GamePanel } from "./panels/GamePanel";
import { HelloWorldPanel } from "./panels/HelloWorldPanel";

export function activate(context: ExtensionContext) {
  // Create the show hello world command
  const showHelloWorldCommand = commands.registerCommand("hello-world.showHelloWorld", () => {
    BasePanel.render(() => new HelloWorldPanel(context.extensionUri));
  });

  const showGameCommand = commands.registerCommand("hello-world.showGame", () => {
    BasePanel.render(() => new GamePanel(context.extensionUri));
  });

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
  context.subscriptions.push(showGameCommand);
}
