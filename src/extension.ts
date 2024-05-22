/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { readFile, readdir, stat } from 'fs/promises';
import path from 'path';
import type { ExtensionContext, QuickInputButton } from 'vscode';
import { window, commands, Uri, workspace } from 'vscode';
import { IconfiyViewProvider } from './iconifyView';

class MyButton implements QuickInputButton {
  constructor(
    public iconPath: { light: Uri; dark: Uri },
    public tooltip: string,
  ) {}
}

interface IconSet {
  key: string;
  name: string;
  icons: {
    name: string;
    body: string;
  }[];
}
const store = new Map<string, IconSet>();
const storeKeys: string[] = [];
async function loadJsonStore() {
  if (store.size > 0) return true;
  const root = workspace.workspaceFolders?.[0].uri.fsPath;
  if (!root) {
    void window.showErrorMessage('Please Open a File to Insert Iconify Icon');
    return false;
  }
  const iconifyJsonDir = path.join(root, 'node_modules', '@iconify/json', 'json');
  try {
    const st = await stat(iconifyJsonDir);
    if (!st.isDirectory()) {
      void window.showErrorMessage(
        '@iconify/json not found, please install it by npm/pnpm/yarn first.',
      );
      return false;
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
    return false;
  }

  const files = await readdir(iconifyJsonDir);
  for await (const file of files) {
    if (!file.endsWith('.json')) continue;
    const cnt = await readFile(path.join(iconifyJsonDir, file), 'utf-8');
    const data = JSON.parse(cnt);
    const icset: IconSet = {
      key: file.slice(0, file.length - 5),
      name: data.info.name,
      icons: Object.keys(data.icons).map((ic) => {
        return {
          name: ic,
          body: data.icons[ic].body,
        };
      }),
    };
    store.set(icset.key, icset);
    storeKeys.push(icset.key);
  }
}

export function activate(context: ExtensionContext) {
  const iconifyViewProvider = new IconfiyViewProvider(context.extensionUri);

  context.subscriptions.push(
    window.registerWebviewViewProvider(IconfiyViewProvider.viewType, iconifyViewProvider),
  );

  context.subscriptions.push(
    commands.registerCommand('iconify.search', async () => {
      if (!(await loadJsonStore())) {
        return;
      }

      const text = await new Promise<string | undefined>((resolve) => {
        const createResourceGroupButton = new MyButton(
          {
            dark: Uri.file(context.asAbsolutePath('resources/dark/add.svg')),
            light: Uri.file(context.asAbsolutePath('resources/light/add.svg')),
          },
          'Create Resource Group',
        );
        const createResourceGroupButton2 = new MyButton(
          {
            dark: Uri.file(context.asAbsolutePath('resources/dark/add.svg')),
            light: Uri.file(context.asAbsolutePath('resources/light/add.svg')),
          },
          'Create Resource Group',
        );

        let value = '';
        const input = window.createInputBox();
        input.placeholder = 'Search Iconify Icons';
        input.prompt = 'eeeees';
        input.buttons = [createResourceGroupButton, createResourceGroupButton2];
        input.onDidChangeValue((v) => {
          value = v;
        });
        input.onDidAccept(() => {
          input.hide();
          resolve(value);
        });
        input.onDidHide(() => {
          resolve('');
        });
        input.show();
      });

      if (!text?.trim()) {
        return;
      }
      // window.showInformationMessage(`Got: ${text}`);

      const matchedIcons = [];
      let hasMore = false;
      out: for (const key of storeKeys) {
        const icset = store.get(key);
        if (!icset) continue;
        for (const ic of icset.icons) {
          if (ic.name.includes(text)) {
            if (matchedIcons.length === 5) {
              hasMore = true;
              break out;
            }
            matchedIcons.push(ic);
          }
        }
      }

      // console.log(matchedIcons);
      void window.showInformationMessage(`Got: ${matchedIcons.length}, ${hasMore}`);
    }),
  );
}
