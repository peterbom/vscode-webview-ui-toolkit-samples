import * as assert from 'assert';

// You can import and use all API from the 'vscode' module
// as well as import your extension to test it
import * as vscode from 'vscode';
import { MessageSink, MessageSubscriber } from '../../contract/messaging';
import { StyleTestContract } from '../../contract/webviewContracts';
import { BasePanel, PanelDataProvider } from '../../panels/BasePanel';
const packageJson = require('../../../package.json');

const extension = vscode.extensions.getExtension(`${packageJson.publisher}.${packageJson.name}`);
const contextPromise: Thenable<vscode.ExtensionContext> = extension!.activate();

describe('Webview Styles', () => {
    it('should contain css variables and rules', async () => {
        const context = await contextPromise;
        const panel = new StyleTestPanel(context.extensionUri);
        const dataProvider = new StyleTestDataProvider();
        panel.show(dataProvider);

        const cssVars = await dataProvider.cssVarsPromise;
        const rules = await dataProvider.rulesPromise;

        // Place breakpoint here to see CSS variables and rules in test host webview.
        assert.notStrictEqual(cssVars.length, 0);
        assert.notStrictEqual(rules.length, 0);
    });
});

class StyleTestPanel extends BasePanel<void, StyleTestContract.ToWebViewMessage, StyleTestContract.ToVsCodeMessage> {
    constructor(extensionUri: vscode.Uri) {
        super(extensionUri, StyleTestContract.viewInfo);
    }
}

class StyleTestDataProvider implements PanelDataProvider<void, StyleTestContract.ToWebViewMessage, StyleTestContract.ToVsCodeMessage> {
    readonly cssVarsPromise: Promise<string[]>;
    private _cssVarsResolve?: (cssVars: string[]) => void;

    readonly rulesPromise: Promise<StyleTestContract.CssRule[]>;
    private _rulesResolve?: (rules: StyleTestContract.CssRule[]) => void;

    constructor() {
        this.cssVarsPromise = new Promise(resolve => this._cssVarsResolve = resolve);
        this.rulesPromise = new Promise(resolve => this._rulesResolve = resolve);
    }

    getInitialState(): void {
        return undefined;
    }

    createSubscriber(_webview: MessageSink<never>): MessageSubscriber<StyleTestContract.ToVsCodeMessage> | null {
        return MessageSubscriber.create<StyleTestContract.ToVsCodeMessage>()
            .withHandler("reportCssVars", msg => this._cssVarsResolve && this._cssVarsResolve(msg.cssVars))
            .withHandler("reportCssRules", msg => this._rulesResolve && this._rulesResolve(msg.rules));
    }
}
