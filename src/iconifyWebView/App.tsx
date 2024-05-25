import { useEffect, useState, type FC } from 'react';
import { App as AntApp, ConfigProvider, Spin, theme } from 'antd';
import type { Icon, IconCategory, ViewBox } from '../common';
import { Header } from './Header';
import { locale } from './locale';
import { IconStore } from './store';
import { vscode } from './vscode';
import { Gallery } from './GalleryV';

function bodyHasDark() {
  return (
    document.body.getAttribute('data-theme') === 'dark' ||
    document.body.getAttribute('data-vscode-theme-kind') === 'vscode-dark'
  );
}

export const App: FC = () => {
  const [isDark, setIsDark] = useState(() => bodyHasDark());
  const [icons, setIcons] = useState<Icon[]>([]);

  const searchIcons = (keyword: string) => {
    if (!keyword) {
      setIcons(IconStore.allFlat.slice(0, 100));
      return;
    }
  };

  useEffect(() => {
    const onMessage = (evt: MessageEvent) => {
      if (typeof evt.data !== 'object' || !evt.data) return;
      switch (evt.data.type) {
        case 'load:file': {
          const { category, buffer } = evt.data as { category: string; buffer: ArrayBuffer };
          const cnt = new TextDecoder().decode(buffer);
          const data = JSON.parse(cnt) as {
            info: { name: string } & ViewBox;
            icons: Record<string, Icon & ViewBox>;
          } & ViewBox;
          const left = data.left ?? data.info.left ?? 0;
          const top = data.top ?? data.info.top ?? 0;
          const width = data.width ?? data.info.width ?? 16;
          const height = data.height ?? data.info.height ?? 16;
          // console.log(category);
          const icgroup: IconCategory = {
            category: category,
            name: data.info.name,
            icons: Object.entries(data.icons).map(([name, icon]) => {
              icon.name = name;
              icon.id = category + '::' + name;
              const l = icon.left ?? left;
              const t = icon.top ?? top;
              const w = icon.width ?? width;
              const h = icon.height ?? height;
              const viewPort = `${l} ${t} ${w} ${h}`;
              const body = icon.body.replace(/currentColor/gi, 'red');
              const xml = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewPort}' width='${w}' height='${h}'>${body}</svg>`;
              icon.body = xml;
              return icon;
            }),
          };
          IconStore.all.push(icgroup);
          IconStore.allFlat = IconStore.allFlat.concat(icgroup.icons);
          searchIcons('');
          break;
        }
        case 'load:favors': {
          IconStore.favors = evt.data.favors;
          break;
        }
      }
    };
    window.addEventListener('message', onMessage);
    vscode.postMessage({
      type: 'load',
    });
    const onThemeChange = () => {
      const isDark = bodyHasDark();
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      setIsDark(isDark);
    };
    onThemeChange(); // call first time
    const ob = new MutationObserver(onThemeChange);
    ob.observe(document.body, { attributes: true });
    return () => {
      window.removeEventListener('message', onMessage);
      ob.disconnect();
    };
  }, []);

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntApp className='flex size-full flex-col p-4'>
        {!icons.length ? (
          <Spin />
        ) : (
          <>
            <Header />
            <Gallery icons={icons} />
          </>
        )}
      </AntApp>
    </ConfigProvider>
  );
};
