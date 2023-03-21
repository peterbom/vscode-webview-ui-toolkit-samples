import { VSCodeButton, VSCodeLink } from "@vscode/webview-ui-toolkit/react";

export function NodeActions() {
  return (
    <>
      <VSCodeButton>Show Logs</VSCodeButton>
      <VSCodeButton>Copy 7-Day Shareable Link</VSCodeButton>
      <VSCodeLink>Download Zip</VSCodeLink>
    </>
  )
}