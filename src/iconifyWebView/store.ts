import { createStore } from 'lrhs';
import type { Icon, IconCategory, WebviewInitData } from '../common';
import { bodyHasDark } from './util';
import { parseJsonBuffer } from './IconsView/helper';
import { vscode } from './vscode';

export const GROUP_ALL_KEY = '--all--';
export interface WebviewState {
  darkMode: boolean;
  topTab: 'all' | 'favor';
  groupTab: string;
}
export type GlobalStore = WebviewState &
  WebviewInitData & {
    all: Map<string, IconCategory>;
    allFlat: Icon[];
  };

let initState = vscode.getState() as WebviewState & WebviewInitData;
// console.log('INIT STATE', initState);
if (!initState) {
  const initData = window.ICONIFY_INIT_DATA;
  initState = {
    ...initData,
    darkMode: bodyHasDark(),
    topTab: initData.mode === 'view.favor' ? 'favor' : 'all',
    groupTab: initData.favorGroup || GROUP_ALL_KEY,
  };
  vscode.setState(initState);
  // console.log('INIT STATE22', initState);
}

export const globalStore = createStore<GlobalStore>({
  ...initState,
  all: new Map(),
  allFlat: [],
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

      globalStore.set('mode', options.mode);
      globalStore.set('searchText', options.searchText ?? '');
      globalStore.set('topTab', options.mode === 'view.favor' ? 'favor' : 'all');

      break;
    }
    case 'update:settings': {
      Object.entries(evt.data as GlobalStore).forEach(([prop, value]) => {
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

['topTab', 'mode', 'groupTab', 'searchText', 'codeType', 'favorTabs', 'favorGroup'].forEach((p) => {
  globalStore.hook(p as keyof GlobalStore, (v) => {
    (initState as unknown as Record<string, unknown>)[p] = v;
    vscode.setState(initState);
  });
});
