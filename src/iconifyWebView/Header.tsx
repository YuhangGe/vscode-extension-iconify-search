import { Button, Input, Segmented, Space, Tabs } from 'antd';
import { useState, type FC } from 'react';
import { t } from './locale';

export const Header: FC<{
  onSearch: (v: string) => void;
}> = ({ onSearch }) => {
  const [text, setText] = useState('');

  return (
    <div className='w-full shrink-0'>
      <Segmented
        className='mb-2'
        options={[
          {
            label: '全部图标',
            value: 'all',
          },
          {
            label: '最近使用',
            value: 'recent',
          },
        ]}
      />
      <Space.Compact className='w-full'>
        <Input
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
        items={[
          {
            key: 'all',
            label: '全部',
          },
          {
            key: 'ant-design',
            label: 'Ant Design',
          },
        ]}
      />
    </div>
  );
};
