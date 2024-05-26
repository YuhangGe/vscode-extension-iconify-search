import { useEffect, useState, type FC } from 'react';
import { App as AntApp, Button, ConfigProvider, Segmented, Spin, theme } from 'antd';
import { locale } from './locale';
import { IconsView } from './IconsView';
import { FavoritesView } from './FavoritesView';
import { vscode } from './vscode';
import { globalStore } from './store';

export const App: FC = () => {
  const [isDark] = globalStore.useStore('darkMode');
  const [topTab, setTopTab] = globalStore.useStore('topTab');
  const [allIcons] = globalStore.useStore('allFlat');
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (allIcons.length > 0) {
      setLoading(false);
    }
  }, [allIcons.length]);

  useEffect(() => {
    vscode.postMessage({
      type: 'load',
    });
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
          <>
            <div className='flex items-center gap-4 mb-4'>
              <Segmented
                value={topTab}
                onChange={(v) => setTopTab(v as 'all')}
                options={[
                  {
                    label: '全部图标',
                    value: 'all',
                  },
                  {
                    label: '我的收藏',
                    value: 'favor',
                  },
                ]}
              />
              <Button
                size='small'
                icon={<span className='icon-[ant-design--setting-outlined]'></span>}
                type='text'
              />
            </div>
            {topTab === 'all' && <IconsView />}
            {topTab === 'favor' && <FavoritesView />}
          </>
        )}
      </AntApp>
    </ConfigProvider>
  );
};
