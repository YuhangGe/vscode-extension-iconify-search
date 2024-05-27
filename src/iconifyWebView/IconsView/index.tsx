import type { FC } from 'react';
import { useEffect, useState } from 'react';
import { Tabs } from 'antd';
import type { Icon } from '../../common';
import { simpleSearchIcons } from '../search';
import { GROUP_ALL_KEY, globalStore } from '../store';
import { t } from '../locale';
import { Gallery } from './Gallery';
import { Search } from './Search';

export const IconsView: FC = () => {
  const [icons, setIcons] = useState<Icon[]>([]);
  const [searchText, setSearchText] = globalStore.useStore('searchText');
  const [favorTabs] = globalStore.useStore('favorTabs');
  const [tabs, setTabs] = useState<
    {
      label: string;
      key: string;
    }[]
  >([
    {
      label: t('ALL'),
      key: GROUP_ALL_KEY,
    },
  ]);
  const [groupTab, setGroupTab] = globalStore.useStore('groupTab');

  const searchIcons = () => {
    const { searchText, groupTab, all } = globalStore.getStore();
    const t = searchText?.trim() ?? '';
    if (!t) {
      if (groupTab === GROUP_ALL_KEY) setIcons(globalStore.get('allFlat'));
      else {
        setIcons(all.get(groupTab)?.icons ?? []);
      }
    } else {
      const result = simpleSearchIcons(t, groupTab === GROUP_ALL_KEY ? '' : groupTab);
      setIcons(result);
    }
  };

  const [all] = globalStore.useStore('all');
  useEffect(() => {
    setTabs((v) => {
      const newTabs = [...new Set([...favorTabs, ...all.keys()]).values()]
        .filter((k) => all.has(k))
        .map((key) => {
          return {
            label: all.get(key)?.name as string,
            key,
          };
        });
      newTabs.unshift(v[0]);
      return newTabs;
    });
  }, [favorTabs, all]);

  const selectTab = (tab: string) => {
    setGroupTab(tab);
    searchIcons();
  };

  useEffect(() => {
    searchIcons();
  }, [all]);

  return (
    <>
      <Search
        value={searchText}
        onSearch={(t) => {
          if (searchText !== t) {
            setSearchText(t);
            searchIcons();
          }
        }}
      />
      <Tabs
        size='small'
        items={tabs}
        activeKey={groupTab}
        onChange={(k) => {
          selectTab(k);
        }}
      />

      {!!icons.length && <Gallery icons={icons} />}
      {!icons.length && groupTab !== GROUP_ALL_KEY && (
        <div
          className='mt-2 cursor-pointer py-1 text-center text-xs hover:text-hover'
          onClick={() => {
            selectTab(GROUP_ALL_KEY);
          }}
        >
          {t('No icons yet, click to view all icons')}
        </div>
      )}
      {!icons.length && groupTab === GROUP_ALL_KEY && (
        <div className='mt-2 py-1 text-center text-xs'>{t('No Icons')}</div>
      )}
    </>
  );
};
