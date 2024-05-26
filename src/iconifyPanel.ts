import path from 'path';
import fs from 'fs/promises';
import type { Disposable, Webview, WebviewPanel } from 'vscode';
import { Uri, ViewColumn, l10n, window, workspace } from 'vscode';
import _tpl from './iconifyPanel.html?raw';
import { getNonce, replaceTpl } from './util';
import type { WebviewInitData } from './common';
// import type { IconCategory } from './common';

const PanelTitle = l10n.t('Iconify Icons');

function getConf() {
  const conf = workspace.getConfiguration('iconifySearch');
  return {
    favors: conf.get('favorites', []),
  };
}
export class IconifySearchPanel {
  public static readonly viewType = 'iconifySearch';
  private _panel?: WebviewPanel;
  private _initData: WebviewInitData;

  private _disposables: Disposable[] = [];

  constructor(private readonly _extensionUri: Uri) {
    this._initData = {
      searchText: '',
      setting: getConf(),
      mode: 'search',
    };
    // workspace.onDidChangeConfiguration(() => {
    //   this._setting = getConf();
    //   void this._panel?.webview.postMessage({
    //     type: 'load:setting',
    //     setting: this._setting,
    //   });
    // });
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

  private async _loadIcons() {
    const root = workspace.workspaceFolders?.[0].uri.fsPath;
    if (!root) {
      void window.showErrorMessage('Please Open a File to Insert Iconify Icon');
      return;
    }
    const iconifyJsonDir = path.join(root, 'node_modules', '@iconify/json', 'json');
    try {
      const st = await fs.stat(iconifyJsonDir);
      if (!st.isDirectory()) {
        void window.showErrorMessage(
          '@iconify/json not found, please install it by npm/pnpm/yarn first.',
        );
        return;
      }
    } catch (ex) {
      console.error(ex);
      if ((ex as { code: string }).code === 'ENOENT') {
        void window.showErrorMessage(
          '@iconify/json not found, please install it by npm/pnpm/yarn first.',
        );
      } else {
        void window.showErrorMessage(`${ex}`);
      }
      return;
    }
    const files = await fs.readdir(iconifyJsonDir);
    const GROUP_SIZE = 35;
    const groups = Math.ceil(files.length / GROUP_SIZE);
    // const st = Date.now();
    // console.log('send start');
    for (let i = 0; i < groups; i++) {
      const bufs = await Promise.all(
        files.slice(i * GROUP_SIZE, (i + 1) * GROUP_SIZE).map((f) => {
          return fs.readFile(path.join(iconifyJsonDir, f));
        }),
      );
      await this._panel?.webview.postMessage({
        type: 'load:files',
        bufs: bufs.map((buf) => buf.buffer),
      });
    }
  }
  public async show(options: { mode: WebviewInitData['mode']; searchText?: string }) {
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
    this._initData.mode = options.mode;
    this._initData.searchText = options.searchText ?? '';

    const column = window.activeTextEditor ? window.activeTextEditor.viewColumn : undefined;

    this._panel = window.createWebviewPanel(
      IconifySearchPanel.viewType,
      PanelTitle,
      column || ViewColumn.One,
      { enableScripts: true },
    );
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
    this._panel.iconPath = {
      dark: Uri.joinPath(this._extensionUri, 'resources', 'iconify.svg'),
      light: Uri.joinPath(this._extensionUri, 'resources', 'iconify.svg'),
    };
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview);
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.type) {
          case 'load':
            void this._loadIcons();
            break;
        }
      },
      null,
      this._disposables,
    );
  }
  public dispose() {
    // Clean up our resources
    this._panel?.dispose();
    this._panel = undefined;

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
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
      initData: JSON.stringify(this._initData),
      cspSource: webview.cspSource,
      scriptUri,
      styleUri,
      nonce,
    });
  }
}
