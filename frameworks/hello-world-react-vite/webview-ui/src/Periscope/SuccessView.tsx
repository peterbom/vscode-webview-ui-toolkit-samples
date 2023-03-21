import { VSCodeDataGrid, VSCodeDataGridCell, VSCodeDataGridRow, VSCodeDivider } from "@vscode/webview-ui-toolkit/react";
import { useEffect } from "react";
import { PeriscopeContract } from "../../../src/contract/webviewContracts";
import { NodeActions } from "./NodeActions";
import { NodeLogs } from "./NodeLogs";
import styles from "./SuccessView.module.css"

export interface SuccessViewProps {
  runId: string
  clusterName: string
  uploadStatuses: PeriscopeContract.NodeUploadStatus[]
  onRequestUploadStatusCheck: () => void
  onNodeClick: (node: string) => void
  selectedNode: string
  nodePodLogs: PeriscopeContract.PodLogs[] | null
}

export function SuccessView(props: SuccessViewProps) {
  // Once
  useEffect(() => {
    const interval = setInterval(props.onRequestUploadStatusCheck, 10 * 1000);
    return () => clearInterval(interval);
  }, []);

  function getNodeRowClassNames(nodeName: string): string {
    return [props.selectedNode === nodeName && styles.selected].filter(s => s).join(' ');
  }

  return (
    <>
      <p>
      <i className="fa status-icon fa-check-circle" style={{color: 'green'}}></i>
        AKS Periscope has successfully started run <b>{props.runId}</b> on cluster <b>{props.clusterName}</b>
      </p>

      <table>
        <thead>
          <tr>
            <th>Status</th>
            <th>Node Name</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
        {
          props.uploadStatuses.map(status => (
            <tr key={status.nodeName} onClick={() => props.onNodeClick(status.nodeName)} className={getNodeRowClassNames(status.nodeName)}>
              <td>{status.isUploaded ? <><i className="fa fa-check-circle"></i>Uploaded</> : <><i className="fa fa-spinner fa-spin"></i>Waiting for upload</>}</td>
              <td>{status.nodeName}</td>
              <td><NodeActions /></td>
            </tr>
          ))
        }
        </tbody>
      </table>

      <VSCodeDivider />

      {/* https://github.com/microsoft/vscode-webview-ui-toolkit/blob/b4f21bcbcc9353b624029bd2516ed8a416ad220d/src/data-grid/README.md */}
      <VSCodeDataGrid>
        <VSCodeDataGridRow row-type="header">
          <VSCodeDataGridCell cell-type="columnheader" grid-column="1">Status</VSCodeDataGridCell>
          <VSCodeDataGridCell cell-type="columnheader" grid-column="2">Node Name</VSCodeDataGridCell>
          <VSCodeDataGridCell cell-type="columnheader" grid-column="3">Actions</VSCodeDataGridCell>
        </VSCodeDataGridRow>
      </VSCodeDataGrid>
      {
        props.uploadStatuses.map(status => (
          <VSCodeDataGridRow key={status.nodeName}>
            <VSCodeDataGridCell grid-column="1">{status.isUploaded ? 'Completed' : 'Pending'}</VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="2">{status.nodeName}</VSCodeDataGridCell>
            <VSCodeDataGridCell grid-column="3"><NodeActions /></VSCodeDataGridCell>
          </VSCodeDataGridRow>
        ))
      }

      <VSCodeDivider />

      {props.selectedNode && props.nodePodLogs && <NodeLogs node={props.selectedNode} podLogs={props.nodePodLogs} />}
    </>
  );
}