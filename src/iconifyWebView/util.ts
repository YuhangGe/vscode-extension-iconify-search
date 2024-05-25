import { useEffect, useState } from 'react';

function bodyHasDark() {
  return (
    document.body.getAttribute('data-theme') === 'dark' ||
    document.body.getAttribute('data-vscode-theme-kind') === 'vscode-dark'
  );
}

const theme: {
  isDark: boolean;
  watchers: Set<() => void>;
} = {
  isDark: bodyHasDark(),
  watchers: new Set(),
};
document.documentElement.classList[theme.isDark ? 'add' : 'remove']('dark');

const ob = new MutationObserver(() => {
  const isDark = bodyHasDark();
  if (theme.isDark !== isDark) {
    theme.isDark = isDark;
    theme.watchers.forEach((fn) => fn());
    document.documentElement.classList[isDark ? 'add' : 'remove']('dark');
  }
});
ob.observe(document.body, { attributes: true });

export function useIsDarkMode() {
  const [isDark, setIsDark] = useState(theme.isDark);
  useEffect(() => {
    const onChange = () => {
      setIsDark(theme.isDark);
    };
    theme.watchers.add(onChange);
    return () => {
      theme.watchers.delete(onChange);
    };
  }, []);
  return isDark;
}

export const copyToClipboard = (textToCopy: string) => {
  // navigator clipboard needs a secure context (HTTPS)
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(textToCopy);
  }
  const textArea = document.createElement('textarea');
  textArea.value = textToCopy;
  // set textArea invisible
  textArea.style.position = 'absolute';
  textArea.style.opacity = '0';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  return new Promise<void>((res, rej) => {
    // exec copy command and remove text area
    document.execCommand('copy') ? res() : rej();
    textArea.remove();
  });
};

export function sortedInsert<T extends { weight: number }>(arr: T[], el: T) {
  let high = arr.length;
  if (high === 0 || arr[high - 1].weight >= el.weight) {
    arr.push(el);
    return;
  }
  let low = 0;
  if (arr[low].weight < el.weight) {
    arr.unshift(el);
    return;
  }
  while (low < high) {
    const mid = (low + high) >>> 1;
    if (arr[mid].weight > el.weight) low = mid + 1;
    else high = mid;
  }
  arr.splice(low, 0, el);
}
