# TODO

* 搜索 debounce 自动生效（同时可回车）[done]
* 配置默认打开的分类 tab（不配置为全部）[done]
* vscode command 向 webview 下发搜索关键字。[done]
* webview 中实现配置弹窗，和 vscode 配置同步，可交互式配置。
* Copy 类型选择（svg, react, vue, html, tailwindcss, tailwindcss-react）[done]
* Tooltip 改 popover，可点击跳转到分类，支持搜藏操作，点击后关闭 popover。[done]
* Header.tsx 改成 forwardRef，支持切换到全部 tab[done]
* 双击关闭当前 tab 并自动把代码插入到被激活的 tab 里的文本中。[done]
* 优化交互，不使用双击交互。图标增加操作按钮蒙层。可能需要适当调大图标大小。[done]
* 我的搜藏页面。[done]
* 多语言
* Readme 文档完善


# QuickInput Sample

This is a sample extension that shows the QuickInput UI and usage of the QuickInput API.

It is not intended as a production quality extension.

- Open the command palette
- Run "Quick Input Samples"
- Pick one of the samples and see it run

## Demo

![Multi-step sample](https://raw.githubusercontent.com/Microsoft/vscode-extension-samples/main/quickinput-sample/preview.gif)

## How it works

- The extension uses the [`QuickPick`](https://code.visualstudio.com/api/references/vscode-api#QuickPick) and [`InputBox`](https://code.visualstudio.com/api/references/vscode-api#InputBox) API to show a UI for user input.
- Registers a command via `package.json` that will trigger the quick input

## VS Code API

### `vscode` module

- [`QuickPick`](https://code.visualstudio.com/api/references/vscode-api#QuickPick)
- [`InputBox`](https://code.visualstudio.com/api/references/vscode-api#InputBox)
- [`window.createQuickPick`](https://code.visualstudio.com/api/references/vscode-api#window.createQuickPick)
- [`window.showQuickPick`](https://code.visualstudio.com/api/references/vscode-api#window.showQuickPick)
- [`window.createInputBox`](https://code.visualstudio.com/api/references/vscode-api#window.createInputBox)
- [`window.showInputBox`](https://code.visualstudio.com/api/references/vscode-api#window.showInputBox)

# How to run locally

- Run `npm install` in terminal to install dependencies
- Run the `Run Extension` target in the Debug View. This will:
	- Start a task `npm: watch` to compile the code
	- Run the extension in a new VS Code window
