import { useEffect, useState, type FC } from 'react';
import { App as AntApp, ConfigProvider, Spin, theme } from 'antd';
import type { Icon } from '../common';
import { Header } from './Header';
import { locale } from './locale';
import { IconStore } from './store';
import { vscode } from './vscode';
import { Gallery } from './Gallery';

function bodyHasDark() {
  return (
    document.body.getAttribute('data-theme') === 'dark' ||
    document.body.getAttribute('data-vscode-theme-kind') === 'vscode-dark'
  );
}

export const App: FC = () => {
  const [isDark, setIsDark] = useState(() => bodyHasDark());
  const [icons, setIcons] = useState<Icon[]>([]);
  const [loading, setLoading] = useState(true);

  const searchIcons = (keyword: string) => {
    if (!keyword) {
      setIcons(IconStore.allFlat);
      return;
    }
  };

  useEffect(() => {
    const onMessage = (evt: MessageEvent) => {
      if (typeof evt.data !== 'object' || !evt.data) return;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { type, value } = evt.data as { type: string; value: any };
      switch (type) {
        case 'load-all-icons': {
          IconStore.all = value;
          IconStore.allFlat = IconStore.all.reduce((p, c) => {
            return p.concat(c.icons);
          }, [] as Icon[]);
          setLoading(false);
          searchIcons('');
          break;
        }
      }
    };
    window.addEventListener('message', onMessage);
    vscode.postMessage({
      type: 'load-all-icons',
    });
    const ob = new MutationObserver(() => {
      setIsDark(bodyHasDark());
    });
    ob.observe(document.body, { attributes: true });
    return () => {
      window.removeEventListener('message', onMessage);
      ob.disconnect();
    };
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
            <Header />
            <Gallery icons={icons} />
          </>
        )}
      </AntApp>
    </ConfigProvider>
  );
};
