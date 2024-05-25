import { useEffect, useRef, useState, type FC } from 'react';
import { App as AntApp, ConfigProvider, Spin, theme } from 'antd';
import type { Setting, Icon, IconCategory, ViewBox } from '../common';
import { Header } from './Header';
import { locale } from './locale';
import { IconStore, searchEngine } from './store';
import { vscode } from './vscode';
import { Gallery } from './GalleryV';
import { SettingContext } from './setting';
import { useIsDarkMode } from './util';

export const App: FC = () => {
  const isDark = useIsDarkMode();
  const [icons, setIcons] = useState<Icon[]>([]);
  const [setting, setSetting] = useState<Setting>({});
  const [loading, setLoading] = useState(true);

  const filter = useRef({ text: '' });

  const searchIcons = () => {
    const { text } = filter.current;
    if (!text) {
      setIcons(IconStore.allFlat);
    } else {
      // const r = new RegExp('\\b' + text + '\\b', 'i');
      // const arr1: Icon[] = [];
      // const arr2: Icon[] = [];
      // IconStore.allFlat.forEach((ic) => {
      //   if (r.test(ic.name)) {
      //     arr1.push(ic);
      //   } else if (ic.name.includes(text)) {
      //     arr2.push(ic);
      //   }
      // });
      // const ics = arr1.concat(arr2);
      // // console.log('do search', text, ics);
      // setIcons(ics);
      // const result = search(text) as number[];
      // console.log('SS RE', result);
      // const ics = result.map((index) => IconStore.allFlat[index]);
      // setIcons(ics);
      const result = searchEngine.search(text);
      setIcons(
        result.map((item) => {
          return IconStore.allFlat[item.id];
        }),
      );
      // console.log(result);
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
              const xml = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewPort}'>${icon.body}</svg>`;
              icon.body = xml;
              return icon;
            }),
          };

          IconStore.all.push(icgroup);
          icgroup.icons.forEach((ic, idx) => {
            searchEngine.add({ id: IconStore.allFlat.length + idx, name: ic.name });
          });
          // searchEngine.addAll(icgroup.icons);
          IconStore.allFlat = IconStore.allFlat.concat(icgroup.icons);
          searchIcons();
          setLoading(false);
          break;
        }
        case 'load:file:end': {
          // searchEngine.addAll(IconStore.allFlat);
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
              onSearch={(t) => {
                if (filter.current.text !== t) {
                  filter.current.text = t;
                  searchIcons();
                }
              }}
            />
            <Gallery icons={icons} />
          </SettingContext.Provider>
        )}
      </AntApp>
    </ConfigProvider>
  );
};
