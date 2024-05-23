import path from 'path';
import { readFile } from 'fs/promises';
import type { Webview, WebviewPanel } from 'vscode';
import { ThemeColor, Uri, ViewColumn, l10n, window, workspace } from 'vscode';
import _tpl from './iconifyPanel.html?raw';
import { getNonce, replaceTpl } from './util';

const PanelTitle = l10n.t('Iconify Icons');

export class IconifySearchPanel {
  public static readonly viewType = 'iconifySearch';
  private _panel?: WebviewPanel;
  private _favors: Set<string>;
  // private _logo?: {
  //   dark: Uri;
  //   light: Uri;
  // };

  constructor(private readonly _extensionUri: Uri) {
    // this._store = new Map();
    // this._icons = [];
    this._favors = new Set(workspace.getConfiguration('iconifySearch').get('favorites', []));
    workspace.onDidChangeConfiguration(() => {
      this._favors = new Set(workspace.getConfiguration('iconifySearch').get('favorites', []));
    });
  }

  // private async _loadLogo() {
  //   if (this._logo) return this._logo;
  //   const icpath = Uri.joinPath(this._extensionUri, 'resources', 'iconify.svg');
  //   const ic = encodeURIComponent(await readFile(icpath.fsPath, 'utf-8'));

  //   this._logo = {
  //     dark: Uri.from({
  //       scheme: 'data',
  //       path: 'image/svg+xml,' + ic.replace('currentColor', 'red'), // 'rgb(23, 105, 170)'),
  //     }),
  //     light: Uri.from({
  //       scheme: 'data',
  //       path: 'image/svg+xml,' + ic.replace('currentColor', 'rgb(23, 105, 170)'),
  //     }),
  //   };
  //   return this._logo;
  // }

  public async show() {
    if (this._panel) {
      // 当前版本 vscode 支持激活打开 extenstion tab 后，查询并打开已经存在的 iconify-search tab
      // https://github.com/microsoft/vscode/issues/188572
      void window.showInformationMessage(
        `TODO: Active iconify-search tab when vscode api is ready`,
      );
      // window.tabGroups.all.some((tg) => {
      //   return tg.tabs.some((t) => {
      //     if (t.label === PanelTitle) {
      //       // window.activeTab(t);
      //       return true;
      //     }
      //     return false;
      //   });
      // });

      return;
    }
    const column = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

    this._panel = window.createWebviewPanel(
      IconifySearchPanel.viewType,
      PanelTitle,
      column || ViewColumn.One,
      { enableScripts: true },
    );
    this._panel.onDidDispose(() => {
      void window.showInformationMessage('panel dispose');
      this._panel = undefined;
    });
    this._panel.iconPath = {
      dark: Uri.joinPath(this._extensionUri, 'resources', 'iconify.svg'),
      light: Uri.joinPath(this._extensionUri, 'resources', 'iconify.svg'),
    };
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
  }
  private _getHtmlForWebview(webview: Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, 'out', 'iconifyWebView.js'),
    );

    const styleUri = webview.asWebviewUri(
      Uri.joinPath(this._extensionUri, 'out', 'iconifyWebView.css'),
    );

    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return replaceTpl(_tpl, {
      cspSource: webview.cspSource,
      scriptUri,
      styleUri,
      nonce,
    });
  }
}
