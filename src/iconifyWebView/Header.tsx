import { Button, Input, Segmented, Space, Tabs } from 'antd';
import { useContext, useMemo, useState, type FC } from 'react';
import { t } from './locale';
import { SettingContext } from './setting';
import { IconStore } from './store';

export const ALL_TAB_KEY = '--ALL--';
export const Header: FC<{
  tabs: string[];
  onTabChange: (v: string) => void;
  onSearch: (v: string) => void;
}> = ({ onSearch, tabs, onTabChange }) => {
  const [text, setText] = useState('');
  const { favors } = useContext(SettingContext);
  const tabItems = useMemo(() => {
    const items = [...new Set((favors ?? []).concat(tabs)).values()].map((c) => {
      return {
        label: IconStore.all.get(c)?.name ?? c,
        key: c,
      };
    });
    items.unshift({
      label: '全部',
      key: ALL_TAB_KEY,
    });
    return items;
  }, [tabs, favors]);
  return (
    <div className='w-full shrink-0'>
      <div className='flex items-center gap-4'>
        <Segmented
          className='mb-2'
          options={[
            {
              label: '全部图标',
              value: 'all',
            },
            {
              label: '我的收藏',
              value: 'recent',
            },
          ]}
        />
        <Button
          size='small'
          icon={<span className='icon-[ant-design--setting-outlined]'></span>}
          type='text'
        />
      </div>
      <Space.Compact className='w-full'>
        <Input
          allowClear
          value={text}
          onKeyDown={(evt) => {
            if (evt.key === 'Enter') {
              onSearch(text);
            }
          }}
          onChange={(e) => {
            setText(e.target.value);
          }}
          placeholder={t('Search Iconify Icons')}
        />
        <Button
          type='primary'
          onClick={() => {
            onSearch(text);
          }}
          icon={<span className='icon-[ant-design--search-outlined]'></span>}
        ></Button>
      </Space.Compact>
      <Tabs
        size='small'
        items={tabItems}
        onChange={(k) => {
          onTabChange(k);
        }}
      />
    </div>
  );
};
