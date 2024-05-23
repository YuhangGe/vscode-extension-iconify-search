/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { l10n, window, commands } from 'vscode';
import type { ExtensionContext } from 'vscode';
import { IconifySearchPanel } from './iconifyPanel';

// class MyButton implements QuickInputButton {
//   constructor(
//     public iconPath: { light: Uri; dark: Uri },
//     public tooltip: string,
//   ) {}
// }

function readSearchText() {
  return new Promise<string | undefined>((resolve) => {
    let value = '';
    const input = window.createInputBox();
    input.placeholder = l10n.t('Search Iconify Icons');
    // input.buttons = [createResourceGroupButton, createResourceGroupButton2];
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

  // context.subscriptions.push(
  //   window.registerWebviewViewProvider(IconfiyViewProvider.viewType, iconifyViewProvider),
  // );

  context.subscriptions.push(
    commands.registerCommand('iconify.search', async () => {
      await iconifySearchPanel.show();

      // const text = await readSearchText();

      // if (!text?.trim()) {
      //   return;
      // }

      // iconifySearchPanel.show();

      // void window.showInformationMessage(`Got: ${matchedIcons.length}, ${hasMore}`);
    }),
  );
}
