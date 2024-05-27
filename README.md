<p align="center">
<a href="https://iconify.design">
<img src="https://github.com/YuhangGe/vscode-extension-iconify-search/blob/main/resources/logo.png?raw=true" alt="logo" width='128'/>
</a>
</p>

<p align="center">
<a href="https://marketplace.visualstudio.com/items?itemName=YuhangGe.vscode-extension-iconify-search" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/v/YuhangGe.vscode-extension-iconify-search.svg?color=blue&amp;label=VS%20Code%20Marketplace&logo=visual-studio-code" alt="Visual Studio Marketplace Version" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=YuhangGe.vscode-extension-iconify-search" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/d/YuhangGe.vscode-extension-iconify-search.svg?color=4bdbe3" alt="Visual Studio Marketplace Downloads" /></a>
<a href="https://marketplace.visualstudio.com/items?itemName=YuhangGe.vscode-extension-iconify-search" target="__blank"><img src="https://img.shields.io/visual-studio-marketplace/i/YuhangGe.vscode-extension-iconify-search.svg?color=63ba83" alt="Visual Studio Marketplace Installs" /></a>
<br/>
<a href="https://github.com/antfu/vscode-iconify" target="__blank"><img src="https://img.shields.io/github/last-commit/YuhangGe/vscode-extension-iconify-search.svg?color=c977be" alt="GitHub last commit" /></a>
<a href="https://github.com/YuhangGe/vscode-extension-iconify-search/issues" target="__blank"><img src="https://img.shields.io/github/issues/YuhangGe/vscode-extension-iconify-search.svg?color=a38eed" alt="GitHub issues" /></a>
<a href="https://github.com/YuhangGe/vscode-extension-iconify-search" target="__blank"><img alt="GitHub stars" src="https://img.shields.io/github/stars/YuhangGe/vscode-extension-iconify-search?style=social"></a>
</p>

# Iconify Search

Search [Iconify](https://icon-sets.iconify.design/) icons directly in VSCode and insert the icons into the code editor.

在 VSCode 中直接搜索 [Iconify](https://icon-sets.iconify.design/) 图标，并可将图标插入到代码编辑器中。

## Usage / 使用方法

This extension needs to read all icon data in the `@iconify/json` package. Please install the `@iconify/json` dependency through `npm/pnpm/yarn` under any project you want to user iconify icons.

当前扩展需要读取 `@iconify/json` 包里的所有图标数据。请在项目里通过 `npm/pnpm/yarn` 安装 `@iconify/json` 依赖。

## Features / 功能

* View and search all Iconify icons. / 查看和搜索所有 Iconify 图标。
* Favorite any icon and quickly view all favorite icons. / 收藏任何图标，并可以快捷查看所有收藏图标。
* Copy the icon's code to the clipboard. / 将图标的代码拷贝到剪切板。
* Insert the icon's code directly into the currently active text editor. / 直接将图标的代码插入到当前激活的文本编辑器。


## Screenshots / 录屏示例

#### View All Icons / 查看全部图标

<p align='center'>
  <img src="https://github.com/YuhangGe/vscode-extension-iconify-search/blob/main/resources/screenshots/view.gif?raw=true" alt='View All Icons'>
</p>

#### Search Icons / 搜索图标

<p align='center'>
  <img src="https://github.com/YuhangGe/vscode-extension-iconify-search/blob/main/resources/screenshots/search.gif?raw=true" alt='Search Icons'>
</p>

#### Save to My Favorites / 收藏图标

<p align='center'>
  <img src="https://github.com/YuhangGe/vscode-extension-iconify-search/blob/main/resources/screenshots/favor.gif?raw=true" alt="Favorite Icons">
</p>

#### Copy Icon Code to Clipboard / 复制图标代码到剪贴板

<p align='center'>
  <img src="https://github.com/YuhangGe/vscode-extension-iconify-search/blob/main/resources/screenshots/copy.gif?raw=true" alt='Copy Icon Code to Clipboard'>
</p>

#### Insert Icon Code to Text Editor / 插入图标代码到文本

<p align='center'>
  <img src="https://github.com/YuhangGe/vscode-extension-iconify-search/blob/main/resources/screenshots/insert.gif?raw=true" alt='Insert Icon Code to Editor'>
</p>

## Limitation / 限制

After switching from the Iconify Search Extension tab to other tabs (such as other text code tab), and executing Iconify Search Extension commands through VSCode Command again, it is unable to automatically active the Iconify Search Extension tab.

从 Iconify 图标界面切换到其它 Tab（比如其它代码文件）后，再次通过 VSCode Command 执行 Iconify Search 扩展的命令后，无法自动切换回 Iconify 图标界面。

This is due to the fact that VSCode Extension API currently does not support activating the Webview Panel created by Extension. The official already has relevant issue and will support it in the feature. For details, please see: https://github.com/microsoft/vscode/issues/188572

这是受 VSCode 扩展接口当前暂不支持激活由 Extension 创建的 Webview Panel 所致。官方已经有相关的 Issue 以及功能迭代计划，详见：https://github.com/microsoft/vscode/issues/188572
