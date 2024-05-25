/** this file is deprecated */

import { useCallback, useEffect, useMemo, useRef, useState, type FC } from 'react';
import { Tooltip } from 'antd';
import type { Icon } from '../common';
import { Scroll } from './Scroll';

const ICON_SIZE = 56;
const ICON_GAP = 16;

const Ic: FC<{ icon: Icon; className?: string }> = ({ icon, className }) => {
  const uri = useMemo(() => {
    return `data:image/svg+xml,${encodeURIComponent(icon.body)}`;
  }, [icon.body]);
  return <img className={className} src={uri} />;
};

export const Gallery: FC<{ icons: Icon[] }> = ({ icons }) => {
  const el = useRef<HTMLDivElement>(null);
  const [renderIcons, setRenderIcons] = useState<Icon[]>([]);
  const [scroll, setScroll] = useState({
    scrollHeight: 0,
    scrollTop: 0,
    domHeight: 0,
  });

  useEffect(() => {
    if (!el.current) return;
    const W = el.current.offsetWidth;
    const H = el.current.offsetHeight;
    let rowC = Math.floor(W / (ICON_SIZE + ICON_GAP));
    if (W - rowC * (ICON_SIZE + ICON_GAP) === ICON_SIZE) {
      rowC += 1;
    }
    const rowN = Math.ceil(icons.length / rowC);
    const totalHeight = (rowN - 1) * (ICON_SIZE + ICON_GAP) + ICON_SIZE;
    const scrollHeight = Math.max(0, totalHeight - H);
    setScroll({
      scrollHeight,
      scrollTop: 0,
      domHeight: H,
    });
  }, [icons]);

  const h = useCallback(
    (st: number, sh: number) => {
      if (!el.current) return;
      const W = el.current.offsetWidth;
      const H = el.current.offsetHeight;
      let rowC = Math.floor(W / (ICON_SIZE + ICON_GAP));
      if (W - rowC * (ICON_SIZE + ICON_GAP) === ICON_SIZE) {
        rowC += 1;
      }
      const rowN = Math.ceil(H / (ICON_SIZE + ICON_GAP));
      const h = Math.round(st * sh);
      const n = Math.floor(h / (ICON_SIZE + ICON_GAP));
      const si = rowC * n;
      // console.log(si, rowN, rowC);
      // console.log(icons.slice(si, si + rowN * rowC));
      setRenderIcons(icons.slice(si, si + rowN * rowC));
    },
    [icons],
  );

  useEffect(() => {
    h(scroll.scrollTop, scroll.scrollHeight);
  }, [scroll]);

  const renderTooltip = (icon: Icon) => (
    <div>
      <div>分类：{icon.name}</div>
      <div>名称：{icon.name}</div>
    </div>
  );
  return (
    <div
      className='flex w-full flex-1 h-0 overflow-y-hidden select-none'
      onWheel={(evt) => {
        setScroll((v) => {
          const d = evt.deltaY;
          if (d === 0) return v;
          // d = d > 0 ? Math.log2(d) : -Math.log2(-d);
          const k = d / v.scrollHeight;
          let t = v.scrollTop + k;
          if (t < 0) t = 0;
          else if (t > 1.0) t = 1.0;
          // console.log(evt.deltaY, t, k, d);
          // return v;
          return { ...v, scrollTop: t };
        });
      }}
    >
      <div
        ref={el}
        className='flex h-full flex-1 flex-wrap overflow-hidden border border-solid border-blue'
        style={{
          gap: `${ICON_GAP}px`,
        }}
      >
        {renderIcons.map((ic) => (
          <Tooltip key={ic.id} title={renderTooltip(ic)}>
            <div
              className='flex flex-col'
              style={{
                width: ICON_SIZE,
                height: ICON_SIZE,
              }}
            >
              <Ic className='block size-14 flex-shrink-0' icon={ic} />
              <div className='flex-1 flex items-center'>
                <span className='w-full truncate text-center'>{ic.name}</span>
              </div>
            </div>
          </Tooltip>
        ))}
      </div>
      <Scroll
        {...scroll}
        onScroll={(sTop) => {
          // console.log('on scroll:', sTop, scroll.scrollTop, scroll.scrollTop === sTop);
          setScroll((v) =>
            v.scrollTop === sTop
              ? v
              : {
                  ...v,
                  scrollTop: sTop,
                },
          );
        }}
      />

      {/* {icons.map((ic) => {
          return (
            <div key={ic.name} className='size-14'>
              <Ic icon={ic} />
            </div>
          );
        })} */}
    </div>
  );
};
