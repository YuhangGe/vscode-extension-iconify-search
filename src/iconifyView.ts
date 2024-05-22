import path from 'path';
import fs from 'fs/promises';
import * as vscode from 'vscode';
import { getNonce, replaceTpl } from './util';
import _tpl from './iconifyView.html?raw';
import type { IconCategory } from './common';

export class IconfiyViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'iconifySearch.iconsView';

  private _view?: vscode.WebviewView;
  private _store?: IconCategory[];
  // private _icons: IconGroup[];
  private _favors: Set<string>;

  constructor(private readonly _extensionUri: vscode.Uri) {
    // this._store = new Map();
    // this._icons = [];
    this._favors = new Set(vscode.workspace.getConfiguration('iconifySearch').get('favorites', []));
    vscode.workspace.onDidChangeConfiguration(() => {
      this._favors = new Set(
        vscode.workspace.getConfiguration('iconifySearch').get('favorites', []),
      );
    });
  }

  private async _loadIcons() {
    if (this._store) return this._store;
    console.log('do load json store');
    const root = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
    if (!root) {
      void vscode.window.showErrorMessage('Please Open a File to Insert Iconify Icon');
      return null;
    }
    const iconifyJsonDir = path.join(root, 'node_modules', '@iconify/json', 'json');
    try {
      const st = await fs.stat(iconifyJsonDir);
      if (!st.isDirectory()) {
        void vscode.window.showErrorMessage(
          '@iconify/json not found, please install it by npm/pnpm/yarn first.',
        );
        return null;
      }
    } catch (ex) {
      console.error(ex);
      if ((ex as { code: string }).code === 'ENOENT') {
        void vscode.window.showErrorMessage(
          '@iconify/json not found, please install it by npm/pnpm/yarn first.',
        );
      } else {
        void vscode.window.showErrorMessage(`${ex}`);
      }
      return null;
    }
    const allGroups: IconCategory[] = [];
    const files = await fs.readdir(iconifyJsonDir);
    const favorGroups = new Map<string, IconCategory>();
    for await (const file of files) {
      if (!file.endsWith('.json')) continue;
      const cnt = await fs.readFile(path.join(iconifyJsonDir, file), 'utf-8');
      const data = JSON.parse(cnt);
      const category = file.slice(0, file.length - 5);
      const icgroup: IconCategory = {
        category: category,
        name: data.info.name,
        icons: [],
      };
      Object.entries<{ body: string }>(data.icons).forEach(([name, icon]) => {
        icgroup.icons.push({
          name,
          body: icon.body,
        });
      });
      if (this._favors.has(category)) {
        favorGroups.set(category, icgroup);
      } else {
        allGroups.push(icgroup);
      }
    }
    const favorGroupsArr = [...this._favors.values()]
      .map((favor) => {
        return favorGroups.get(favor);
      })
      .filter((v) => !!v) as IconCategory[];
    allGroups.unshift(...favorGroupsArr);
    this._store = allGroups;
    return allGroups;
  }
  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    // context: vscode.WebviewViewResolveContext,
    // _token: vscode.CancellationToken,
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case 'load-icons': {
          console.log('load json store');
          void this._loadIcons()
            .then((store) => {
              if (store) {
                console.log('post icons');
                void this._view?.webview.postMessage({
                  type: 'icons-loaded',
                  value: store.slice(0, 1),
                });
              }
            })
            .catch((err) => {
              void vscode.window.showErrorMessage(`${err}`);
            });

          break;
        }
        case 'icon-selected': {
          // vscode.window.activeTextEditor?.insertSnippet(new vscode.SnippetString(`#${data.value}`));
          break;
        }
      }
    });
  }

  public async searchIcons(keyword: string) {
    // await loadJsonStore(this._store);

    // this._icons.length = 0;
    // const ics = new Map<string, IconCategory>();
    // const search = (icset: IconCategory) => {
    //   icset.icons.forEach((ic) => {
    //     if (ic.name.includes(keyword)) {
    //       let icg = ics.get(icset.category);
    //       if (!icg) {
    //         ics.set(
    //           icset.category,
    //           (icg = {
    //             category: icset.category,
    //             name: icset.name,
    //             icons: [],
    //           }),
    //         );
    //         this._icons.push(icg);
    //       }
    //       icg.icons.push(ic);
    //     }
    //   });
    // };
    // this._favors.forEach((favor) => {
    //   const icset = this._store.get(favor);
    //   icset && search(icset);
    // });
    // this._store.forEach((icset, key) => {
    //   if (this._favors.has(key)) return;
    //   search(icset);
    // });

    void this._view?.webview.postMessage({ type: 'search-updated', value: keyword });
    // void this._view?.webview.postMessage({ type: 'icons-updated', value: this._icons });
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    // Get the local path to main script run in the webview, then convert it to a uri we can use in the webview.
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'iconifyWebView.js'),
    );

    const styleUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, 'out', 'iconifyWebView.css'),
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
