import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { App, Tooltip } from 'antd';
import type { Icon } from '../common';
import { copyToClipboard } from './util';

const Ic: FC<{ icon: Icon }> = ({ icon }) => {
  const uri = useMemo(() => {
    return `data:image/svg+xml,${encodeURIComponent(icon.body)}`;
  }, [icon.body]);
  return null; // <img className='block size-14' src={uri} />;
};

export const Gallery: FC<{ icons: Icon[] }> = ({ icons }) => {
  const el = useRef<HTMLDivElement>(null);
  // const [renderIcons, setRenderIcons] = useState<Icon[]>([]);
  const { message } = App.useApp();

  useEffect(() => {
    if (!el.current?.parentElement) return;
    const W = el.current.parentElement.offsetWidth;
    const H = el.current.parentElement.offsetHeight;
    let rowC = Math.floor(W / (56 + 16));
    if (W - rowC * (56 + 16) === 56) {
      rowC += 1;
    }
    const rowN = Math.ceil(icons.length / rowC);
    el.current.style.height = `${(rowN - 1) * (56 + 16) + 56}px`;
  }, [icons]);

  const renderTooltip = (icon: Icon) => (
    <div>
      <div>分类：{icon.name}</div>
      <div>名称：{icon.name}</div>
    </div>
  );
  return (
    <div className='w-full flex-1 overflow-y-auto'>
      <div ref={el} className='flex w-full flex-wrap gap-4'>
        {/* {icons.map((ic) => {
          return (
            <div key={ic.name} className='size-14'>
              <Ic icon={ic} />
            </div>
          );
        })} */}
      </div>
    </div>
  );
};
