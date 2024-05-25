import { useEffect, useRef, useState, type FC } from 'react';
import { App as AntApp, ConfigProvider, Spin, theme } from 'antd';
import type { Setting, Icon, ViewBox } from '../common';
import { ALL_TAB_KEY, Header } from './Header';
import { locale } from './locale';
import { IconStore, simpleSearchIcons } from './store';
import { vscode } from './vscode';
import { Gallery } from './GalleryV';
import { SettingContext } from './setting';
import { useIsDarkMode } from './util';

export const App: FC = () => {
  const isDark = useIsDarkMode();
  const [icons, setIcons] = useState<Icon[]>([]);
  const [setting, setSetting] = useState<Setting>({});
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState<string[]>([]);

  const filter = useRef({ text: '', category: '' });

  const searchIcons = () => {
    const { text, category } = filter.current;
    if (!text) {
      if (!category) setIcons(IconStore.allFlat);
      else {
        setIcons(IconStore.all.get(category)?.icons ?? []);
      }
    } else {
      const result = simpleSearchIcons(text, category);
      setIcons(result);
    }
  };

  useEffect(() => {
    const onMessage = (evt: MessageEvent) => {
      if (typeof evt.data !== 'object' || !evt.data) return;
      switch (evt.data.type) {
        case 'load:setting': {
          setSetting(evt.data.setting);
          break;
        }
        case 'load:files': {
          const bufs = evt.data.bufs as ArrayBuffer[];
          bufs.forEach((buffer) => {
            const cnt = new TextDecoder().decode(buffer);
            const data = JSON.parse(cnt) as {
              prefix: string;
              info: { name: string } & ViewBox;
              icons: Record<string, Icon & ViewBox>;
            } & ViewBox;
            const left = data.left ?? data.info.left ?? 0;
            const top = data.top ?? data.info.top ?? 0;
            const width = data.width ?? data.info.width ?? 16;
            const height = data.height ?? data.info.height ?? 16;
            const category = data.prefix;
            const icons = Object.entries(data.icons).map(([name, icon]) => {
              icon.name = name;
              icon.id = category + ':' + name;
              const l = icon.left ?? left;
              const t = icon.top ?? top;
              const w = icon.width ?? width;
              const h = icon.height ?? height;
              const viewPort = `${l} ${t} ${w} ${h}`;
              const xml = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewPort}'>${icon.body}</svg>`;
              icon.body = xml;
              icon.category = category;
              return icon;
            });
            IconStore.all.set(category, {
              category,
              name: data.info.name,
              icons,
            });
            setTabs((v) => [...v, category]);

            IconStore.allFlat = IconStore.allFlat.concat(icons);
          });
          // console.log('load icons:', IconStore.allFlat.length);
          searchIcons();
          setLoading(false);
          break;
        }
      }
    };
    window.addEventListener('message', onMessage);
    vscode.postMessage({
      type: 'load',
    });

    return () => {
      window.removeEventListener('message', onMessage);
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
        {loading ? (
          <Spin />
        ) : (
          <SettingContext.Provider value={setting}>
            <Header
              tabs={tabs}
              onTabChange={(v) => {
                const category = v === ALL_TAB_KEY ? '' : v;
                if (filter.current.category !== category) {
                  filter.current.category = category;
                  searchIcons();
                }
              }}
              onSearch={(t) => {
                if (filter.current.text !== t) {
                  filter.current.text = t;
                  searchIcons();
                }
              }}
            />
            {!!icons.length && <Gallery icons={icons} />}
            {!icons.length && filter.current.category && (
              <div
                className='mt-2 py-1 text-center cursor-pointer hover:text-hover text-xs'
                onClick={() => {
                  //
                }}
              >
                暂无图标，点击查看全部图标
              </div>
            )}
            {!icons.length && !filter.current.category && (
              <div className='mt-2 py-1 text-center text-xs'>暂无图标</div>
            )}
          </SettingContext.Provider>
        )}
      </AntApp>
    </ConfigProvider>
  );
};
