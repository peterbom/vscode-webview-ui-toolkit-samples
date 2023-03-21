import { commands, ExtensionContext, ExtensionMode } from "vscode";
import { GameDataProvider, GamePanel } from "./panels/GamePanel";
import { HelloWorldDataProvider, HelloWorldPanel } from "./panels/HelloWorldPanel";
import { PeriscopeDataProvider, PeriscopePanel } from "./panels/PeriscopePanel";

export function activate(context: ExtensionContext) {
  const helloWorldPanel = new HelloWorldPanel(context.extensionUri);
  const gamePanel = new GamePanel(context.extensionUri);
  const periscopePanel = new PeriscopePanel(context.extensionUri);

  const showHelloWorldCommand = commands.registerCommand("hello-world.showHelloWorld", () => {
    helloWorldPanel.show(new HelloWorldDataProvider());
  });

  const showGameCommand = commands.registerCommand("hello-world.showGame", () => {
    gamePanel.show(new GameDataProvider());
  });

  const showPeriscopeCommand = commands.registerCommand("hello-world.showPeriscope", () => {
    periscopePanel.show(new PeriscopeDataProvider());
  });

  // Add command to the extension context
  context.subscriptions.push(showHelloWorldCommand);
  context.subscriptions.push(showGameCommand);
  context.subscriptions.push(showPeriscopeCommand);
}
