import path from 'path';
import fs from 'fs/promises';
import type { Disposable, Tab, Webview, WebviewPanel } from 'vscode';
import { Uri, ViewColumn, env, l10n, window, workspace } from 'vscode';
import _tpl from './iconifyPanel.html?raw';
import { getNonce, replaceTpl } from './util';
import type { SettingsData, WebviewInitData } from './common';
// import type { IconCategory } from './common';

const PanelTitle = l10n.t('Iconify Icons');

const ExtensionId = 'iconifySearch';
const FavorTabs = 'favorTabs';
const FavorIcons = 'favorIcons';
const FavorGroup = 'favorGroup';
const CodeType = 'codeType';

function getConf<T>(key: string, defaultValue: T) {
  return (workspace.getConfiguration(ExtensionId)?.get(key) ?? defaultValue) as T;
}
function setConf<T>(key: string, value: T) {
  return workspace.getConfiguration(ExtensionId)?.update(key, value);
}
const getConfFavorTabs = () => getConf<string[]>(FavorTabs, []);
const getConfFavorIcons = () => getConf<string[]>(FavorIcons, []);
export class IconifySearchPanel {
  public static readonly viewType = ExtensionId;
  private _panel?: WebviewPanel;

  private _disposables: Disposable[] = [];

  constructor(private readonly _extensionUri: Uri) {
    // workspace.onDidChangeConfiguration(
    //   () => {
    //     void this._panel?.webview.postMessage({
    //       type: 'update:setting',
    //     });
    //   },
    //   null,
    //   this._disposables,
    // );
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
  private async _saveSettings(data: SettingsData) {
    const entries = Object.entries(data);
    for await (const ent of entries) {
      await setConf(ent[0], ent[1]);
    }
  }
  private _getIconifyTab(): Tab | undefined {
    let tab = undefined;
    window.tabGroups.all.some((tg) => {
      tab = tg.tabs.find((t) => t.label === PanelTitle);
      return !!tab;
    });
    return tab;
  }
  private async _upFavorIcon(op: 'add' | 'rm', id: string) {
    const fics = getConfFavorIcons();
    const idx = fics.indexOf(id);
    if (op === 'add') {
      if (idx >= 0) return;
      fics.push(id);
    } else {
      if (idx < 0) return;
      fics.splice(idx, 1);
    }
    await setConf(FavorIcons, fics);
  }
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
    // 优先加载搜藏的图标分类
    const favorFiles = getConfFavorTabs()
      .map((t) => `${t}.json`)
      .filter((f) => files.includes(f));
    const allFiles =
      favorFiles.length > 0 ? [...new Set(favorFiles.concat(files)).values()] : files;
    if (files.length !== allFiles.length) {
      throw new Error('impossible');
    }

    const GROUP_SIZE = 35;
    const groups = Math.ceil(allFiles.length / GROUP_SIZE);
    // const st = Date.now();
    // console.log('send start');
    for (let i = 0; i < groups; i++) {
      const bufs = await Promise.all(
        allFiles.slice(i * GROUP_SIZE, (i + 1) * GROUP_SIZE).map((f) => {
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
      await this._panel.webview.postMessage({
        type: 'update:mode',
        ...options,
      });
      const tab = this._getIconifyTab();
      if (!tab) throw new Error('impossible');
      if (!tab.isActive) {
        // 当前版本 vscode 暂不支持打开已经存在但不是激活状态的 tab。
        // 但官方已经规划支持：https://github.com/microsoft/vscode/issues/188572
        // 待 API 支持后，激活已经存在的 iconify-search tab。
        void window.showInformationMessage(
          `TODO: Active iconify-search tab when vscode api is ready`,
        );
        // window.activeTab(tab);
      }

      return;
    }

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
    this._panel.webview.html = this._getHtmlForWebview(this._panel.webview, options);
    this._panel.webview.onDidReceiveMessage(
      (message) => {
        switch (message.type) {
          case 'load':
            void this._loadIcons();
            break;
          case 'insert':
            void this._insertCode(message.code);
            break;
          case 'add-favor-icon': {
            void this._upFavorIcon('add', message.id);
            break;
          }
          case 'rm-favor-icon': {
            void this._upFavorIcon('rm', message.id);
            break;
          }
          case 'save:settings': {
            void this._saveSettings(message.data);
            break;
          }
        }
      },
      null,
      this._disposables,
    );
  }
  private async _insertCode(code: string) {
    const tab = this._getIconifyTab();
    if (!tab) return;
    await window.tabGroups.close(tab);
    setTimeout(async () => {
      const editor = window.activeTextEditor;
      if (!editor) {
        void window.showErrorMessage('no editor');
        return;
      }
      // console.log('try insert', editor.selection);
      void editor.edit((editBuilder) => {
        editBuilder.insert(editor.selection.start, code);
      });
    }, 200);
  }
  public dispose() {
    // console.log('Dispose webview');
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
  private _getHtmlForWebview(
    webview: Webview,
    options: { mode: WebviewInitData['mode']; searchText?: string },
  ) {
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
      initData: JSON.stringify({
        ...options,
        locale: env.language,
        favorTabs: getConfFavorTabs(),
        favorIcons: getConfFavorIcons(),
        favorGroup: getConf(FavorGroup, ''),
        codeType: getConf(CodeType, ''),
      }),
      cspSource: webview.cspSource,
      scriptUri,
      styleUri,
      nonce,
    });
  }
}
