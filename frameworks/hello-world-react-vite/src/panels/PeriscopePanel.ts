import { Uri } from "vscode";
import { MessageSink, MessageSubscriber } from "../contract/messaging";
import { PeriscopeContract } from "../contract/webviewContracts";
import { BasePanel, PanelDataProvider } from "./BasePanel";

export class PeriscopePanel extends BasePanel<PeriscopeContract.InitialState, PeriscopeContract.ToWebViewMessage, PeriscopeContract.ToVsCodeMessage> {
  constructor(extensionUri: Uri) {
    super(extensionUri, PeriscopeContract.viewInfo);
  }
}

export class PeriscopeDataProvider implements PanelDataProvider<PeriscopeContract.InitialState, PeriscopeContract.ToWebViewMessage, PeriscopeContract.ToVsCodeMessage> {
  private readonly _startDate = new Date();
  private readonly _nodes = ["test-node-001", "test-node-002", "test-node-003"];
  private readonly _runId = this._startDate.toISOString().slice(0, 19).replace(/:/g, '-') + 'Z';
  private _uploadStatusCallCount = 0;

  getInitialState(): PeriscopeContract.InitialState {
    return {
      clusterName: "test-cluster",
      runId: this._runId,
      nodes: this._nodes,
      state: "success",
      message: ""
    };
  }

  createSubscriber(webview: MessageSink<PeriscopeContract.ToWebViewMessage>) {
    return MessageSubscriber.create<PeriscopeContract.ToVsCodeMessage>()
      .withHandler("uploadStatusRequest", msg => this.handleUploadStatusRequest(msg, webview))
      .withHandler("nodeLogsRequest", msg => this.handleNodeLogsRequest(msg, webview));
  }

  handleUploadStatusRequest(_message: PeriscopeContract.UploadStatusRequest, webview: MessageSink<PeriscopeContract.ToWebViewMessage>) {
    const uploadStatuses = this.getNodeUploadStatuses();
    webview.postMessage({
      command: "uploadStatusResponse",
      uploadStatuses
    });
  }

  getNodeUploadStatuses(): PeriscopeContract.NodeUploadStatus[] {
    this._uploadStatusCallCount += 1;
    const callCount = this._uploadStatusCallCount;

    return this._nodes.map((n, nodeIndex) => ({
      nodeName: n,
      isUploaded: callCount >= (nodeIndex * 3)
    }));
  }

  async handleNodeLogsRequest(message: PeriscopeContract.NodeLogsRequest, webview: MessageSink<PeriscopeContract.ToWebViewMessage>): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    webview.postMessage({
      command: "nodeLogsResponse",
      nodeName: message.nodeName,
      logs: ["aks-periscope-pod", "diag-collector-pod"].map(podName => ({
        podName,
        logs: Array.from({length: Math.floor(Math.random() * 500)}, (_, i) => `${new Date(this._startDate.getTime() + i * 200).toISOString()} Doing thing ${i + 1}`).join('\n')
      }))
    });
  }
}
