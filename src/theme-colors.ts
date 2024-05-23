import { presetPalettes, presetDarkPalettes } from '@ant-design/colors';
import type { IntRange } from 'type-fest';
/** 需要引入的颜色名称 */
const PalleteNames = [
  'red',
  'volcano',
  'orange',
  'gold',
  'yellow',
  'lime',
  'green',
  'cyan',
  'blue',
  'geekblue',
  'purple',
  'magenta',
  'grey',
] as const;

type N = (typeof PalleteNames)[number];
type R = IntRange<1, 10>;
type R2 = `${R}00` | '50';
/** 动态生成每个颜色的色板类型，以 red 为例，包括 red, red-50, red-100 到 red-900。*/
type Pallete = {
  [p in N]: string;
} & {
  [p in `${N}-${R2}`]: string;
};

/**
 * 将 antd 的色板，转换成 tailwind 的常见色板名称体系，即 -red-50, -red-100 到 -red-900。
 * 同时，为了方便使用，增加了 -red 主色名，和 -red-500 等价。
 * 此外，参考 https://ant.design/docs/spec/colors，增加了常用颜色名称的映射。
 */
export interface AntdThemeColors extends Pallete {
  background: string;
  primary: string;
  'selected-background': string;
  hover: string;
  click: string;
  success: string;
  link: string;
  warning: string;
  error: string;
  'leading-text': string;
  'normal-text': string;
  'secondary-text': string;
  'disabled-text': string;
  border: string;
  separator: string;
  divider: string;
  'layout-background': string;
  white: string;
  black: string;
  transparent: string;
  'current-color': string;
}
/**
 * 将 antd 的色板，转换成 tailwind 的常见色板名称体系，即 -red-50, -red-100 到 -red-900。
 * 同时，为了方便使用，增加了 -red 主色名，和 -red-500 等价。
 * 此外，参考 https://ant.design/docs/spec/colors，增加了常用颜色名称的映射。
 *
 * -
 * 示例：
 *
 * ```html
 * <div className="text-brand text-success text-warning text-error">hello, world</div>
 * ```
 */
function AntdColors(dark = false) {
  const colors = {} as unknown as AntdThemeColors;
  PalleteNames.forEach((name) => {
    const clr = (dark ? presetDarkPalettes : presetPalettes)[name];
    // if (!clr) {
    //   console.log(dark, name, Object.keys(presetPalettes), presetPalettes[name]);
    // }
    Object.assign(colors, {
      ...Object.fromEntries(clr.map((c, i) => [`${name}-${i === 0 ? 50 : i * 100}`, c])),
      [name]: clr.primary ?? clr[5],
    });
  });
  /** https://ant.design/docs/spec/colors **/
  colors.primary = colors.blue; // 品牌主色，brand primary color
  colors['selected-background'] = colors['blue-50'];
  colors.hover = colors['blue-400'];
  colors.click = colors['blue-600'];
  colors.success = colors.green;
  colors.link = colors.blue;
  colors.warning = colors.gold;
  colors.error = colors['red-400'];
  colors.background = dark ? '#141414' : '#fff';
  colors['leading-text'] = dark ? 'rgba(255,255,255,0.851)' : 'rgba(0, 0, 0, 0.8784)';
  colors['normal-text'] = dark ? 'rgba(255,255,255,0.851)' : 'rgba(0, 0, 0, 0.8784)';
  colors['secondary-text'] = dark ? 'rgba(255,255,255,0.651)' : 'rgba(0, 0, 0, 0.651)';
  colors['disabled-text'] = dark ? 'rgba(255,255,255,0.251)' : 'rgba(0, 0, 0, 0.251)';
  colors.border = dark ? '#424242' : '#d9d9d9';
  colors.separator = dark ? 'rgba(253,253,253,0.1216)' : 'rgba(5, 5, 5, 0.0588)';
  colors.divider = dark ? 'rgba(253,253,253,0.1216)' : 'rgba(5, 5, 5, 0.0588)';
  colors['layout-background'] = dark ? '#000' : '#f5f5f5';
  colors.white = '#ffffff';
  colors.black = '#000000';
  colors.transparent = 'transparent';
  colors['current-color'] = 'currentcolor';
  return colors;
}

/**
 * 将 antd 的色板，转换成 tailwind 的常见色板名称体系，即 -red-50, -red-100 到 -red-900。
 * 同时，为了方便使用，增加了 -red 主色名，和 -red-500 等价。
 * 此外，参考 https://ant.design/docs/spec/colors，增加了常用颜色名称的映射。
 *
 * tailwind.config.js 配置文件和业务模块代码都从此文件中引用色板，
 * 从而统一 html 和 js（比如 echarts） 的样式。
 */
export const themeColors = AntdColors();
export const themeDarkColors = AntdColors(true);

/**
 * 在 vscode 的 webview 中可直接使用的颜色（css 变量）。该颜色列表通过以下代码获取：
 * 
 * ```ts
 * workspace.openTextDocument(Uri.parse('vscode://schemas/workbench-colors')).then(
    (doc) => {
      const x = JSON.parse(doc.getText()).properties;
      const y = JSON.stringify(Object.keys(x).map((k) => k.replace(/\./g, '-')));
      console.log(y);
    }
  );
  ```
 * 将这些可使用的颜色（css 变量）通过 tailwind 注入给代码，使用时额外加上 `vs-` 前缀，例如：`text-vs-foreground`
 */
export const vscodeColors = Object.fromEntries(
  [
    'foreground',
    'disabledForeground',
    'errorForeground',
    'descriptionForeground',
    'icon-foreground',
    'focusBorder',
    'contrastBorder',
    'contrastActiveBorder',
    'selection-background',
    'textLink-foreground',
    'textLink-activeForeground',
    'textSeparator-foreground',
    'textPreformat-foreground',
    'textPreformat-background',
    'textBlockQuote-background',
    'textBlockQuote-border',
    'textCodeBlock-background',
    'sash-hoverBorder',
    'badge-background',
    'badge-foreground',
    'scrollbar-shadow',
    'scrollbarSlider-background',
    'scrollbarSlider-hoverBackground',
    'scrollbarSlider-activeBackground',
    'progressBar-background',
    'editor-background',
    'editor-foreground',
    'editorStickyScroll-background',
    'editorStickyScrollHover-background',
    'editorStickyScroll-border',
    'editorStickyScroll-shadow',
    'editorWidget-background',
    'editorWidget-foreground',
    'editorWidget-border',
    'editorWidget-resizeBorder',
    'editorError-background',
    'editorError-foreground',
    'editorError-border',
    'editorWarning-background',
    'editorWarning-foreground',
    'editorWarning-border',
    'editorInfo-background',
    'editorInfo-foreground',
    'editorInfo-border',
    'editorHint-foreground',
    'editorHint-border',
    'editorLink-activeForeground',
    'editor-selectionBackground',
    'editor-selectionForeground',
    'editor-inactiveSelectionBackground',
    'editor-selectionHighlightBackground',
    'editor-selectionHighlightBorder',
    'editor-findMatchBackground',
    'editor-findMatchHighlightBackground',
    'editor-findRangeHighlightBackground',
    'editor-findMatchBorder',
    'editor-findMatchHighlightBorder',
    'editor-findRangeHighlightBorder',
    'editor-hoverHighlightBackground',
    'editorHoverWidget-background',
    'editorHoverWidget-foreground',
    'editorHoverWidget-border',
    'editorHoverWidget-statusBarBackground',
    'editorInlayHint-foreground',
    'editorInlayHint-background',
    'editorInlayHint-typeForeground',
    'editorInlayHint-typeBackground',
    'editorInlayHint-parameterForeground',
    'editorInlayHint-parameterBackground',
    'editorLightBulb-foreground',
    'editorLightBulbAutoFix-foreground',
    'editorLightBulbAi-foreground',
    'editor-snippetTabstopHighlightBackground',
    'editor-snippetTabstopHighlightBorder',
    'editor-snippetFinalTabstopHighlightBackground',
    'editor-snippetFinalTabstopHighlightBorder',
    'diffEditor-insertedTextBackground',
    'diffEditor-removedTextBackground',
    'diffEditor-insertedLineBackground',
    'diffEditor-removedLineBackground',
    'diffEditorGutter-insertedLineBackground',
    'diffEditorGutter-removedLineBackground',
    'diffEditorOverview-insertedForeground',
    'diffEditorOverview-removedForeground',
    'diffEditor-insertedTextBorder',
    'diffEditor-removedTextBorder',
    'diffEditor-border',
    'diffEditor-diagonalFill',
    'diffEditor-unchangedRegionBackground',
    'diffEditor-unchangedRegionForeground',
    'diffEditor-unchangedCodeBackground',
    'widget-shadow',
    'widget-border',
    'toolbar-hoverBackground',
    'toolbar-hoverOutline',
    'toolbar-activeBackground',
    'breadcrumb-foreground',
    'breadcrumb-background',
    'breadcrumb-focusForeground',
    'breadcrumb-activeSelectionForeground',
    'breadcrumbPicker-background',
    'merge-currentHeaderBackground',
    'merge-currentContentBackground',
    'merge-incomingHeaderBackground',
    'merge-incomingContentBackground',
    'merge-commonHeaderBackground',
    'merge-commonContentBackground',
    'merge-border',
    'editorOverviewRuler-currentContentForeground',
    'editorOverviewRuler-incomingContentForeground',
    'editorOverviewRuler-commonContentForeground',
    'editorOverviewRuler-findMatchForeground',
    'editorOverviewRuler-selectionHighlightForeground',
    'problemsErrorIcon-foreground',
    'problemsWarningIcon-foreground',
    'problemsInfoIcon-foreground',
    'input-background',
    'input-foreground',
    'input-border',
    'inputOption-activeBorder',
    'inputOption-hoverBackground',
    'inputOption-activeBackground',
    'inputOption-activeForeground',
    'input-placeholderForeground',
    'inputValidation-infoBackground',
    'inputValidation-infoForeground',
    'inputValidation-infoBorder',
    'inputValidation-warningBackground',
    'inputValidation-warningForeground',
    'inputValidation-warningBorder',
    'inputValidation-errorBackground',
    'inputValidation-errorForeground',
    'inputValidation-errorBorder',
    'dropdown-background',
    'dropdown-listBackground',
    'dropdown-foreground',
    'dropdown-border',
    'button-foreground',
    'button-separator',
    'button-background',
    'button-hoverBackground',
    'button-border',
    'button-secondaryForeground',
    'button-secondaryBackground',
    'button-secondaryHoverBackground',
    'checkbox-background',
    'checkbox-selectBackground',
    'checkbox-foreground',
    'checkbox-border',
    'checkbox-selectBorder',
    'keybindingLabel-background',
    'keybindingLabel-foreground',
    'keybindingLabel-border',
    'keybindingLabel-bottomBorder',
    'list-focusBackground',
    'list-focusForeground',
    'list-focusOutline',
    'list-focusAndSelectionOutline',
    'list-activeSelectionBackground',
    'list-activeSelectionForeground',
    'list-activeSelectionIconForeground',
    'list-inactiveSelectionBackground',
    'list-inactiveSelectionForeground',
    'list-inactiveSelectionIconForeground',
    'list-inactiveFocusBackground',
    'list-inactiveFocusOutline',
    'list-hoverBackground',
    'list-hoverForeground',
    'list-dropBackground',
    'list-dropBetweenBackground',
    'list-highlightForeground',
    'list-focusHighlightForeground',
    'extensionButton-foreground',
    'extensionButton-hoverBackground',
    'extensionButton-separator',
    'extensionButton-prominentBackground',
    'extensionButton-prominentForeground',
    'extensionButton-prominentHoverBackground',
    'extensionIcon-starForeground',
    'extensionIcon-verifiedForeground',
    'extensionIcon-preReleaseForeground',
    'extensionIcon-sponsorForeground',
    'interactive-activeCodeBorder',
    'interactive-inactiveCodeBorder',
    'searchEditor-textInputBorder',
  ].map((c) => [`vs-${c}`, `var(--vscode-${c})`]),
);
