import { Uri } from "vscode";
import { BasePanel } from "./BasePanel";

export class GamePanel extends BasePanel {
  constructor(extensionUri: Uri) {
    super(
      extensionUri,
      {
        viewType: "showGame",
        title: "Tic Tac Toe",
        contentId: "game"
      }
    );
  }
}
