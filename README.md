# Iconify Search

Search [Iconify](https://icon-sets.iconify.design/) icons directly in VSCode and insert the icons into the code editor.

在 VSCode 中直接搜索 [Iconify](https://icon-sets.iconify.design/) 图标，并可将图标插入到代码编辑器中。

## Usage / 使用方法

This extension needs to read all icon data in the `@iconify/json` package. Please install the `@iconify/json` dependency through `npm/pnpm/yarn` under any project you want to user iconify icons.

当前扩展需要读取 `@iconify/json` 包里的所有图标数据。请在项目里通过 `npm/pnpm/yarn` 安装 `@iconify/json` 依赖。

## Features / 功能

* 查看和搜索所有 Iconify 图标。
* 收藏任何图标，并可以快捷查看所有收藏图标。
* 将图标的代码拷贝到剪切板。
* 直接将图标的代码插入到当前激活的文本编辑器。


## Screenshot / 录屏示例

#### Search Icons / 搜索图标

#### View All Icons / 查看全部图标

#### Copy Icon Code to Clipboard / 复制图标代码到剪贴板

#### Insert Icon Code to Text Editor / 插入图标代码到文本

#### Save to My Favorites / 收藏图标

## Limitation / 限制

After switching from the Iconify Search Extension tab to other tabs (such as other text code tab), and executing Iconify Search Extension commands through VSCode Command again, it is unable to automatically active the Iconify Search Extension tab.

从 Iconify 图标界面切换到其它 Tab（比如其它代码文件）后，再次通过 VSCode Command 执行 Iconify Search 扩展的命令后，无法自动切换回 Iconify 图标界面。

This is due to the fact that VSCode Extension API currently does not support activating the Webview Panel created by Extension. The official already has relevant issue and will support it in the feature. For details, please see: https://github.com/microsoft/vscode/issues/188572

这是受 VSCode 扩展接口当前暂不支持激活由 Extension 创建的 Webview Panel 所致。官方已经有相关的 Issue 以及功能迭代计划，详见：https://github.com/microsoft/vscode/issues/188572
