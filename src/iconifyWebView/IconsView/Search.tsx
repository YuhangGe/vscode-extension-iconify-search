import { Button, Input, Space } from 'antd';
import { useEffect, useRef, useState, type FC } from 'react';
import { t } from '../locale';

export const Search: FC<{
  value?: string;
  onSearch: (v: string) => void;
}> = ({ onSearch, value }) => {
  const [text, setText] = useState(value ?? '');
  useEffect(() => {
    setText(value ?? '');
  }, [value]);
  const x = useRef(0);
  const onChange = (v: string) => {
    if (x.current) clearTimeout(x.current);
    x.current = window.setTimeout(() => {
      x.current = 0;
      onSearch(v);
    }, 600);
  };
  return (
    <Space.Compact className='mb-2 w-full'>
      <Input
        allowClear
        value={text}
        onKeyDown={(evt) => {
          if (evt.key === 'Enter') {
            if (x.current) {
              clearTimeout(x.current);
              x.current = 0;
            }
            onSearch(text);
          }
        }}
        onChange={(e) => {
          const t = e.target.value;
          setText(t);
          onChange(t);
        }}
        placeholder={t('Search Icons')}
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
