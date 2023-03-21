import { PeriscopeContract } from "../../../src/contract/webviewContracts"

export interface NodeLogsProps {
  node: string
  podLogs: PeriscopeContract.PodLogs[]
}

export function NodeLogs(props: NodeLogsProps) {
  return (
    <>
      <h3>{props.node} Node Logs</h3>
      {
        (props.podLogs || []).map(podLog => (
          <div key={podLog.podName}>
            <h4>{podLog.podName}</h4>
            <pre>{podLog.logs}</pre>
          </div>
        ))
      }
    </>
  );
}