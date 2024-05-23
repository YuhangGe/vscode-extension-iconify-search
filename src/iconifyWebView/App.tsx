import { useEffect, useState, type FC } from 'react';
import { App as AntApp, ConfigProvider, theme } from 'antd';
import en from 'antd/locale/en_US';
import { Header } from './Header';
// import zhCn from 'antd/locale/zh_CN';
// import zhHk from 'antd/locale/zh_HK'
// import zhHk from 'antd/locale/zh_HK'

function bodyHasDark() {
  return (
    document.body.getAttribute('data-theme') === 'dark' ||
    document.body.getAttribute('data-vscode-theme-kind') === 'vscode-dark'
  );
}
export const App: FC = () => {
  const [isDark, setIsDark] = useState(() => bodyHasDark());
  useEffect(() => {
    const ob = new MutationObserver(() => {
      setIsDark(bodyHasDark());
    });
    ob.observe(document.body, { attributes: true });
    return () => {
      ob.disconnect();
    };
  }, []);
  return (
    <ConfigProvider
      locale={en}
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <AntApp>
        <Header />
      </AntApp>
    </ConfigProvider>
  );
};
