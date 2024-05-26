import type { FC } from 'react';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Spin, Tabs } from 'antd';
import type { Icon } from '../../common';
import { vscode } from '../vscode';
import { IconStore, simpleSearchIcons } from '../store';
import { InitDataContext } from '../context';
import { parseJsonBuffer } from './helper';
import { Gallery } from './Gallery';
import { Search } from './Search';

const ALL_TAB_KEY = '--all--';
export const IconsView: FC = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  const { setting, searchText } = useContext(InitDataContext) ?? {};
  const [loading, setLoading] = useState(true);
  const [tabs, setTabs] = useState<
    {
      label: string;
      key: string;
    }[]
  >([
    {
      label: '全部',
      key: ALL_TAB_KEY,
    },
  ]);
  const [tab, setTab] = useState(() => {
    if (setting?.favors?.length) {
      return setting.favors[0];
    } else {
      return ALL_TAB_KEY;
    }
  });

  const filter = useRef({ text: searchText, category: tab });

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
  const updateTabs = useCallback(() => {
    const favors = setting?.favors ?? [];
    setTabs((v) => {
      const newTabs = [...new Set([...favors, ...IconStore.all.keys()]).values()]
        .filter((k) => IconStore.all.has(k))
        .map((key) => {
          return {
            label: IconStore.all.get(key)?.name as string,
            key,
          };
        });
      newTabs.unshift(v[0]);
      return newTabs;
    });
  }, [setting?.favors]);
  const onMessage = useCallback((evt: MessageEvent) => {
    if (typeof evt.data !== 'object' || !evt.data) return;
    switch (evt.data.type) {
      case 'load:files': {
        const bufs = evt.data.bufs as ArrayBuffer[];
        bufs.forEach((buffer) => {
          const group = parseJsonBuffer(buffer);
          IconStore.all.set(group.category, group);
          IconStore.allFlat = IconStore.allFlat.concat(group.icons);
        });
        updateTabs();
        searchIcons();
        setLoading(false);
        break;
      }
    }
  }, []);

  useEffect(() => {
    window.addEventListener('message', onMessage);
    if (!IconStore.allFlat.length) {
      vscode.postMessage({
        type: 'load',
      });
    } else {
      setLoading(false);
      updateTabs();
      searchIcons();
    }

    return () => {
      window.removeEventListener('message', onMessage);
    };
  }, []);

  const selectTab = (tab: string) => {
    setTab(tab);
    const category = tab === ALL_TAB_KEY ? '' : tab;
    if (filter.current.category !== category) {
      filter.current.category = category;
      searchIcons();
    }
  };

  return (
    <>
      <Search
        defaultValue={filter.current.text}
        onSearch={(t) => {
          if (filter.current.text !== t) {
            filter.current.text = t;
            searchIcons();
          }
        }}
      />
      <Tabs
        size='small'
        items={tabs}
        activeKey={tab}
        onChange={(k) => {
          selectTab(k);
        }}
      />
      {!icons.length && loading && (
        <div className='flex justify-center mt-4'>
          <Spin />
        </div>
      )}
      {!!icons.length && <Gallery icons={icons} />}
      {!icons.length && !loading && filter.current.category && (
        <div
          className='mt-2 py-1 text-center cursor-pointer hover:text-hover text-xs'
          onClick={() => {
            selectTab(ALL_TAB_KEY);
          }}
        >
          暂无图标，点击查看全部图标
        </div>
      )}
      {!icons.length && !loading && !filter.current.category && (
        <div className='mt-2 py-1 text-center text-xs'>暂无图标</div>
      )}
    </>
  );
};
