import { Uri, Webview } from "vscode";
import { BasePanel } from "./BasePanel";

export class HelloWorldPanel extends BasePanel {
  constructor(extensionUri: Uri) {
    super(
      extensionUri,
      {
        viewType: "showHelloWorld",
        title: "Hello World",
        contentId: "hello"
      },
      {
        addOneRequest: function(webview: Webview, message: any) {
          webview.postMessage({ command: "addOneResponse", value: message.value + 1 });
        }
      }
    );
  }
}
