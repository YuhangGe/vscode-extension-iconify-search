import { useEffect, useState, type FC } from 'react';
import { App as AntApp, Button, ConfigProvider, Segmented, Spin, theme } from 'antd';
import { locale, t } from './locale';
import { IconsView } from './IconsView';
import { FavoritesView } from './FavoritesView';
import { vscode } from './vscode';
import { globalStore } from './store';
import { SettingsModal } from './Settings';

export const App: FC = () => {
  const [isDark] = globalStore.useStore('darkMode');
  const [topTab, setTopTab] = globalStore.useStore('topTab');
  const [allIcons] = globalStore.useStore('allFlat');
  const [loading, setLoading] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);

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
        <SettingsModal
          open={settingsOpen}
          onClose={() => {
            setSettingsOpen(false);
          }}
        />
        {loading ? (
          <Spin />
        ) : (
          <>
            <div className='mb-4 flex items-center gap-4'>
              <Segmented
                value={topTab}
                onChange={(v) => setTopTab(v as 'all')}
                options={[
                  {
                    label: t('ALL ICONS'),
                    value: 'all',
                  },
                  {
                    label: t('MY FAVORITES'),
                    value: 'favor',
                  },
                ]}
              />
              <Button
                size='small'
                icon={<span className='icon-[ant-design--setting-outlined]'></span>}
                type='text'
                onClick={() => {
                  setSettingsOpen(true);
                }}
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
