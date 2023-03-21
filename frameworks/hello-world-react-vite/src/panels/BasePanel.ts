import { Disposable, Webview, WebviewPanel, window, Uri, ViewColumn } from "vscode";
import { getNonce, getUri } from "../utilities/webview";
import { ViewInfo } from "../contract/webviewContracts";
import { MessageSink, MessageSubscriber } from "../contract/messaging";
import { WebviewMessageContext } from "../webview/webviewMessageContext";

const viewType = "aksVsCodeTools";

export interface PanelDataProvider<TInitialState, TPostMsg, TListenMsg> {
  getInitialState(): TInitialState
  createSubscriber(webview: MessageSink<TPostMsg>): MessageSubscriber<TListenMsg> | null
}

export abstract class BasePanel<TInitialState, TPostMsg, TListenMsg> {
  protected constructor(
    readonly extensionUri: Uri,
    readonly viewInfo: ViewInfo
  ) {}

  show(dataProvider: PanelDataProvider<TInitialState, TPostMsg, TListenMsg>) {
    const panelOptions = {
      enableScripts: true,
      // Restrict the webview to only load resources from the `out` and `webview-ui/build` directories
      localResourceRoots: [Uri.joinPath(this.extensionUri, "out"), Uri.joinPath(this.extensionUri, "webview-ui/build")],
    };

    const panel = window.createWebviewPanel(viewType, this.viewInfo.title, ViewColumn.One, panelOptions);
    const disposables: Disposable[] = [];

    // Set up messaging between VSCode and the webview.
    const messageContext = new WebviewMessageContext<TPostMsg, TListenMsg>(panel.webview, disposables);
    const subscriber = dataProvider.createSubscriber(messageContext);
    if (subscriber) {
      messageContext.subscribeToMessages(subscriber);
    }

    // Set an event listener to listen for when the panel is disposed (i.e. when the user closes
    // the panel or when the panel is closed programmatically)
    panel.onDidDispose(() => this._dispose(panel, disposables), null, disposables);

    // Set the HTML content for the webview panel
    const initialState = dataProvider.getInitialState();
    panel.webview.html = this._getWebviewContent(panel.webview, this.extensionUri, initialState);
  }

  private _dispose(panel: WebviewPanel, disposables: Disposable[]) {
    panel.dispose();
    disposables.forEach(d => d.dispose());
  }

  private _getWebviewContent(webview: Webview, extensionUri: Uri, initialState: TInitialState | undefined) {
    // The CSS file from the React build output
    const stylesUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.css"]);
    // The JS file from the React build output
    const scriptUri = getUri(webview, extensionUri, ["webview-ui", "build", "assets", "index.js"]);

    const nonce = getNonce();

    const initialStateJson = initialState ? JSON.stringify(initialState) : "";

    // Tip: Install the es6-string-html VS Code extension to enable code highlighting below
    return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} https://use.fontawesome.com; script-src 'nonce-${nonce}' https://use.fontawesome.com; font-src 'self' https://use.fontawesome.com">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>${this.viewInfo.title}</title>
          <script src="https://use.fontawesome.com/7dddd54b5c.js"></script>
        </head>
        <body>
          <div id="root" data-contentid=${this.viewInfo.contentId} data-initialstate=${initialStateJson}></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
        </body>
      </html>
    `;
  }
}
