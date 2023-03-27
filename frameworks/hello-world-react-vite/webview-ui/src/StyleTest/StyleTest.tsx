import { useEffect, useState } from "react";
import { StyleTestContract } from "../../../src/contract/webviewContracts";
import { getWebviewMessageContext } from "../utilities/vscode";

export function StyleTest() {
  const vscode = getWebviewMessageContext<StyleTestContract.ToVsCodeMessage, never>();

  const [cssVars, setCssVars] = useState<string[]>([]);
  const [cssRules, setCssRules] = useState<StyleTestContract.CssRule[]>([]);

  useEffect(() => {
    const cssVars = getCssVars();
    setCssVars(cssVars);

    const cssRules = getCssRules();
    setCssRules(cssRules);

    vscode.postMessage({ command: "reportCssVars", cssVars });
    vscode.postMessage({ command: "reportCssRules", rules: cssRules });
  }, []);

  function getCssVars(): string[] {
    const htmlStyle = document.querySelector('html')?.getAttribute('style');
    if (!htmlStyle) {
      return [];
    }
  
    return htmlStyle.split(';').map(s => s.trim()).filter(s => s.startsWith('--vscode-'));
  }

  function getCssRules(): StyleTestContract.CssRule[] {
    const defaultStyleSheetNode = document.getElementById('_defaultStyles');
    let [defaultStyleSheet] = [...document.styleSheets].filter(s => s.ownerNode === defaultStyleSheetNode);
    if (!defaultStyleSheet) {
      return [];
    }

    const isStyleRule = (r: CSSRule): r is CSSStyleRule => 'selectorText' in r;

    return [...defaultStyleSheet.cssRules].filter<CSSStyleRule>(isStyleRule).map(r => ({
      selector: r.selectorText,
      text: r.cssText
    }));
  }
  
  function showCssVars() {
    return `:root {\n${cssVars.map(s => `  ${s};`).join('\n')}\n}`;
  }

  function showRules() {
    return cssRules.map(r => r.text).join('\n');
  }

  return (
    <>
      <pre>{showCssVars()}{'\n'}{showRules()}</pre>
    </>
  )
}
