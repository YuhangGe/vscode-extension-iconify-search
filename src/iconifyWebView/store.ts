import { createStore } from 'lrhs';
import type { Icon, IconCategory, WebviewInitData } from '../common';
import { bodyHasDark } from './util';
import { parseJsonBuffer } from './IconsView/helper';
import { vscode } from './vscode';

export const GROUP_ALL_KEY = '--all--';
export interface GlobalStore extends WebviewInitData {
  darkMode: boolean;
  all: Map<string, IconCategory>;
  allFlat: Icon[];
  topTab: 'all' | 'favor';
  groupTab: string;
}

const initData = window.ICONIFY_INIT_DATA;
let initState: Partial<GlobalStore> = vscode.getState() ?? {};

function getData() {
  return {
    mode: initData.mode,
    searchText: initState.searchText ?? initData.searchText,
    topTab:
      initState.topTab ??
      (initData.mode === 'insert.favorites' || initData.mode === 'view.favorites'
        ? 'favor'
        : 'all'),
    groupTab: initState.groupTab ?? GROUP_ALL_KEY,
  };
}
export const globalStore = createStore<GlobalStore>({
  darkMode: bodyHasDark(),
  all: new Map(),
  allFlat: [],
  favorIcons: initData.favorIcons,
  favorTabs: initData.favorTabs,
  ...getData(),
});
if (globalStore.get('darkMode')) {
  document.documentElement.classList.add('dark');
}

const ob = new MutationObserver(() => {
  const isDark = bodyHasDark();
  if (globalStore.get('darkMode') !== isDark) {
    globalStore.set('darkMode', isDark);
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  }
});
ob.observe(document.body, { attributes: true });

const onMessage = (evt: MessageEvent) => {
  if (typeof evt.data !== 'object' || !evt.data) return;
  switch (evt.data.type) {
    case 'load:files': {
      const bufs = evt.data.bufs as ArrayBuffer[];
      const all = globalStore.get('all');
      let allFlat = globalStore.get('allFlat');
      bufs.forEach((buffer) => {
        const group = parseJsonBuffer(buffer);
        all.set(group.category, group);
        allFlat = allFlat.concat(group.icons);
      });
      globalStore.set('all', new Map(all), true);
      globalStore.set('allFlat', allFlat);
      break;
    }
    case 'update:mode': {
      const options = evt.data as WebviewInitData;
      initState = {};
      vscode.setState(initState);
      initData.mode = options.mode;
      initData.searchText = options.searchText ?? '';
      const data = getData();
      Object.entries(data).forEach(([prop, value]) => {
        globalStore.set(prop as keyof GlobalStore, value);
      });
      break;
    }
  }
};
window.addEventListener('message', onMessage);

export function updateFavorIcon(op: 'add' | 'rm', icon: Icon) {
  const favorIcons = globalStore.get('favorIcons');
  if (op === 'rm') {
    const idx = favorIcons.indexOf(icon.id);
    idx >= 0 && favorIcons.splice(idx, 1);
  } else {
    favorIcons.push(icon.id);
  }
  vscode.postMessage({
    type: op === 'rm' ? 'rm-favor-icon' : 'add-favor-icon',
    id: icon.id,
  });
  globalStore.set('favorIcons', favorIcons.slice());
}

globalStore.hook('topTab', (v) => {
  initState.topTab = v;
  vscode.setState(initState);
});
globalStore.hook('groupTab', (v) => {
  initState.groupTab = v;
  vscode.setState(initState);
});
globalStore.hook('searchText', (v) => {
  initState.searchText = v;
  vscode.setState(initState);
});
