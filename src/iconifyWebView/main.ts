import type { IconCategory } from '../common';
import { replaceTpl } from '../util';
import './style.css';

function createEl(tag: string, cls: string, text?: string) {
  const el = document.createElement(tag);
  el.className = cls;
  if (typeof text === 'string') {
    el.textContent = text;
  }
  return el;
}
const vscode = acquireVsCodeApi();
const $ipt = document.getElementById('search-input') as HTMLInputElement;
const $list = document.getElementById('icon-list') as HTMLDivElement;
let store: IconCategory[] = [];
window.addEventListener('message', (event) => {
  const message = event.data; // The json data that the extension sent
  switch (message.type) {
    case 'search-updated': {
      $ipt.value = message.value;
      renderIcons();
      break;
    }
    case 'icons-loaded': {
      console.log('icons loaded:', message.value.length);
      // store.length = 0;
      // store.push(...message.value);
      store = message.value;
      renderIcons();
      break;
    }
  }
});

setTimeout(() => {
  vscode.postMessage({
    type: 'load-icons',
  });
}, 100);

function searchIcons(keyword: string) {
  return store
    .map((icset) => {
      const newIc: IconCategory = {
        name: icset.name,
        category: icset.category,
        icons: [],
      };
      icset.icons.forEach((ic) => {
        if (ic.name.includes(keyword)) {
          newIc.icons.push(ic);
        }
      });
      return newIc;
    })
    .filter((v) => v.icons.length > 0);
}

function renderIcons() {
  const searchText = $ipt.value.trim();
  const icons = searchText ? searchIcons(searchText) : store;

  $list.innerHTML = '';

  icons.forEach((icgroup) => {
    $list.appendChild(createEl('div', '', icgroup.name));
    const $icons = createEl('div', 'flex flex-wrap gap-1 justify-between');
    icgroup.icons.forEach((ic) => {
      const $el = createEl('div', 'flex flex-col w-9');
      const $img = createEl('div', 'w-full h-9 text-icon-foreground');
      $img.innerHTML = `<svg class="w-full h-full">${ic.body}</svg>`;
      $el.appendChild($img);
      $el.appendChild(createEl('div', 'w-full overflow-hidden text-ellipsis', ic.name));

      $icons.appendChild($el);
    });
    $list.appendChild($icons);
  });
}
// document.body.innerHTML = '<p>Hello!</p>';
