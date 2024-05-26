import { useState, type FC } from 'react';
import { App as AntApp, Button, ConfigProvider, Segmented, theme } from 'antd';
import type { WebviewInitData } from '../common';
import { locale } from './locale';
import { InitDataContext } from './context';
import { useIsDarkMode } from './util';
import { IconsView } from './IconsView';
import { FavoritesView } from './FavoritesView';

export const App: FC = () => {
  const isDark = useIsDarkMode();
  const [initData] = useState<WebviewInitData>(window.ICONIFY_INIT_DATA);
  const [tab, setTab] = useState<'all' | 'favorites'>(() => {
    return initData.mode === 'insert.favorites' || initData.mode === 'view.favorites'
      ? 'favorites'
      : 'all';
  });

  return (
    <ConfigProvider
      locale={locale}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntApp className='flex size-full flex-col p-4'>
        <InitDataContext.Provider value={initData}>
          <div className='flex items-center gap-4 mb-4'>
            <Segmented
              value={tab}
              onChange={(v) => setTab(v as 'all')}
              options={[
                {
                  label: '全部图标',
                  value: 'all',
                },
                {
                  label: '我的收藏',
                  value: 'favorites',
                },
              ]}
            />
            <Button
              size='small'
              icon={<span className='icon-[ant-design--setting-outlined]'></span>}
              type='text'
            />
          </div>
          {tab === 'all' && <IconsView />}
          {tab === 'favorites' && <FavoritesView />}
        </InitDataContext.Provider>
      </AntApp>
    </ConfigProvider>
  );
};
