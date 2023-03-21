import { VSCodeDivider, VSCodeLink } from "@vscode/webview-ui-toolkit/react";
import { useEffect, useState } from "react";
import { MessageSubscriber } from "../../../src/contract/messaging";
import { PeriscopeContract } from "../../../src/contract/webviewContracts";
import { Scenario } from "../utilities/manualTest";
import { getVscodeInterceptorMessageContext, getWebviewMessageContext } from "../utilities/vscode";
import { ErrorView } from "./ErrorView";
import { NoDiagnosticSettingView } from "./NoDiagnosticSettingView";
import { SuccessView } from "./SuccessView";

export function Periscope(props: PeriscopeContract.InitialState) {
  const vscode = getWebviewMessageContext<PeriscopeContract.ToVsCodeMessage, PeriscopeContract.ToWebViewMessage>();

  const [nodeUploadStatuses, setNodeUploadStatuses] = useState<PeriscopeContract.NodeUploadStatus[]>(props.nodes.map(n => ({nodeName: n, isUploaded: false})));
  const [selectedNode, setSelectedNode] = useState<string>("");
  const [nodePodLogs, setNodePodLogs] = useState<PeriscopeContract.PodLogs[] | null>(null);

  useEffect(() => {
    vscode.subscribeToMessages(createMessageSubscriber());
    handleRequestUploadStatusCheck();
  }, []); // Empty list of dependencies to run only once: https://react.dev/reference/react/useEffect#useeffect

  function createMessageSubscriber(): MessageSubscriber<PeriscopeContract.ToWebViewMessage> {
    return MessageSubscriber.create<PeriscopeContract.ToWebViewMessage>()
      .withHandler("uploadStatusResponse", handleUploadStatusResponse)
      .withHandler("nodeLogsResponse", handleNodeLogsResponse);
  }

  function handleRequestUploadStatusCheck() {
    vscode.postMessage({ command: "uploadStatusRequest" });
  }

  function handleUploadStatusResponse(message: PeriscopeContract.UploadStatusResponse) {
    setNodeUploadStatuses(message.uploadStatuses);
  }

  function handleNodeClick(node: string) {
    setSelectedNode(node);
    setNodePodLogs(null);
    vscode.postMessage({ command: "nodeLogsRequest", nodeName: node });
  }

  function handleNodeLogsResponse(message: PeriscopeContract.NodeLogsResponse) {
    setNodePodLogs(message.logs);
  }

  return (
    <>
      <h2>AKS Periscope</h2>
      <p>
        AKS Periscope collects and exports node and pod logs into an Azure Blob storage account
        to help you analyse and identify potential problems or easily share the information
        during the troubleshooting process.
        <VSCodeLink href="https://aka.ms/vscode-aks-periscope">Learn more</VSCodeLink>
      </p>
      <VSCodeDivider />
      {
        {
          error: <ErrorView message={props.message} />,
          noDiagnosticsConfigured: <NoDiagnosticSettingView />,
          success: (
            <SuccessView
              runId={props.runId}
              clusterName={props.clusterName}
              uploadStatuses={nodeUploadStatuses}
              onRequestUploadStatusCheck={handleRequestUploadStatusCheck}
              onNodeClick={handleNodeClick}
              selectedNode={selectedNode}
              nodePodLogs={nodePodLogs}
            />)
        }[props.state]
      }
    </>
  )
}

export function getPeriscopeScenarios() {
  const testNodes = ["test-node-001", "test-node-002", "test-node-003"];
  const startDate = new Date();
  let uploadStatusCallCount = 0;
  
  const successState: PeriscopeContract.InitialState = {
    state: "success",
    clusterName: "test-cluster",
    runId: startDate.toISOString().slice(0, 19).replace(/:/g, '-') + 'Z',
    nodes: testNodes,
    message: ""
  };
  
  const webview = getVscodeInterceptorMessageContext<PeriscopeContract.ToWebViewMessage, PeriscopeContract.ToVsCodeMessage>();
  const subscriber = MessageSubscriber.create<PeriscopeContract.ToVsCodeMessage>()
    .withHandler("uploadStatusRequest", handleUploadStatusRequest)
    .withHandler("nodeLogsRequest", handleNodeLogsRequest);
  
  function handleUploadStatusRequest(_message: PeriscopeContract.UploadStatusRequest) {
    uploadStatusCallCount += 1;
    webview.postMessage({
      command: "uploadStatusResponse",
      uploadStatuses: testNodes.map((n, nodeIndex) => ({
        nodeName: n,
        isUploaded: uploadStatusCallCount >= (nodeIndex * 3)
      }))
    });
  }

  async function handleNodeLogsRequest(message: PeriscopeContract.NodeLogsRequest): Promise<void> {
    await new Promise(resolve => setTimeout(resolve, 1000));
    webview.postMessage({
      command: "nodeLogsResponse",
      nodeName: message.nodeName,
      logs: ["aks-periscope-pod", "diag-collector-pod"].map(podName => ({
        podName,
        logs: Array.from({length: Math.floor(Math.random() * 500)}, (_, i) => `${new Date(startDate.getTime() + i * 200).toISOString()} Doing thing ${i + 1}`).join('\n')
      }))
    })
  }
  
  return [
    Scenario.create(`${PeriscopeContract.viewInfo.title} (deployed)`, () => <Periscope {...successState} />).withSubscription(webview, subscriber)
  ]
}
