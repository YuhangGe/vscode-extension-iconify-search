/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { l10n, window, commands } from 'vscode';
import type { ExtensionContext } from 'vscode';
import { IconifySearchPanel } from './iconifyPanel';

function readSearchText() {
  return new Promise<string | undefined>((resolve) => {
    let value = '';
    const input = window.createInputBox();
    input.placeholder = l10n.t('Search Iconify Icons');
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
}

export function activate(context: ExtensionContext) {
  const iconifySearchPanel = new IconifySearchPanel(context.extensionUri);

  context.subscriptions.push(
    commands.registerCommand('iconify.search', async () => {
      const text = await readSearchText();
      if (!text?.trim()) {
        return;
      }
      await iconifySearchPanel.show({ mode: 'search', searchText: text });
    }),
    commands.registerCommand('iconify.view.all', async () => {
      await iconifySearchPanel.show({ mode: 'view.all' });
    }),
    commands.registerCommand('iconify.view.favorites', async () => {
      await iconifySearchPanel.show({ mode: 'view.favor' });
    }),
  );
}
