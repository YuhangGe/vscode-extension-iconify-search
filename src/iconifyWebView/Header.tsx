import { App, Button, Input, Space } from 'antd';
import type { FC } from 'react';

export const Header: FC = () => {
  const { message } = App.useApp();

  return (
    <Space.Compact className='w-full'>
      <Input placeholder='Search Iconify Icons' />
      <Button
        type='primary'
        onClick={() => {
          void message.success('hello', 1000);
        }}
        icon={<span className='icon-[ant-design--search-outlined]'></span>}
      ></Button>
    </Space.Compact>
  );
};
