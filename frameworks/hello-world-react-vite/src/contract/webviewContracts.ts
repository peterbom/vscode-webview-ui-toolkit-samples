import { Command } from "./messaging";

export interface ViewInfo {
  title: string
  contentId: string
}

export module HelloWorldContract {
  export const viewInfo: ViewInfo = {
    title: "Hello World",
    contentId: "hello"
  };

  export interface InitialState {
    value: number
  }

  export interface AddOneRequest extends Command<"addOneRequest"> {
    value: number
  }

  export interface AddOneResponse extends Command<"addOneResponse"> {
    value: number
  }

  export type ToVsCodeMessage = AddOneRequest;
  export type ToWebViewMessage = AddOneResponse;
}

export module GameContract {
  export const viewInfo: ViewInfo = {
    title: "Tic Tac Toe",
    contentId: "game"
  };
}

export module StyleTestContract {
  export const viewInfo: ViewInfo = {
    title: "Style Test",
    contentId: "style"
  };

  export interface ReportCssVars extends Command<"reportCssVars"> {
    cssVars: string[]
  }

  export interface ReportCssRules extends Command<"reportCssRules"> {
    rules: CssRule[]
  }

  export interface CssRule {
    selector: string,
    text: string
  }

  export type ToVsCodeMessage = ReportCssVars | ReportCssRules;
  export type ToWebViewMessage = never;
}

export module PeriscopeContract {
  export const viewInfo: ViewInfo = {
    title: "Periscope",
    contentId: "periscope"
  };

  export interface NodeUploadStatus {
    nodeName: string
    isUploaded: boolean
  }

  export interface PodLogs {
    podName: string
    logs: string
  }

  export interface InitialState {
    clusterName: string
    runId: string
    state: "error" | "noDiagnosticsConfigured" | "success"
    message: string
    nodes: string[]
  }

  export interface UploadStatusRequest extends Command<"uploadStatusRequest"> {}

  export interface NodeLogsRequest extends Command<"nodeLogsRequest"> {
    nodeName: string
  }

  export interface UploadStatusResponse extends Command<"uploadStatusResponse"> {
    uploadStatuses: NodeUploadStatus[]
  };

  export interface NodeLogsResponse extends Command<"nodeLogsResponse"> {
    nodeName: string
    logs: PodLogs[]
  }

  export type ToVsCodeMessage = UploadStatusRequest | NodeLogsRequest;
  export type ToWebViewMessage = UploadStatusResponse | NodeLogsResponse;
}