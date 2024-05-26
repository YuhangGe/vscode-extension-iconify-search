import { Button, Input, Space } from 'antd';
import { useRef, useState, type FC } from 'react';
import { t } from '../locale';

export const ALL_TAB_KEY = '--ALL--';
export const Search: FC<{
  defaultValue?: string;
  onSearch: (v: string) => void;
}> = ({ onSearch, defaultValue }) => {
  const [text, setText] = useState(defaultValue ?? '');
  const x = useRef(0);
  const onChange = (v: string) => {
    if (x.current) clearTimeout(x.current);
    x.current = window.setTimeout(() => {
      x.current = 0;
      onSearch(v);
    }, 600);
  };
  return (
    <Space.Compact className='w-full mb-2'>
      <Input
        allowClear
        value={text}
        onKeyDown={(evt) => {
          if (evt.key === 'Enter') {
            if (x.current) {
              clearTimeout(x.current);
              x.current = 0;
            }
            onSearch(text.trim());
          }
        }}
        onChange={(e) => {
          const t = e.target.value;
          setText(t);
          onChange(t.trim());
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
  );
};
