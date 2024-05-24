import { useEffect, useMemo, useRef, useState, type FC } from 'react';
import { App, Tooltip } from 'antd';
import VirtualList from 'rc-virtual-list';
import type { Icon } from '../common';
import { copyToClipboard } from './util';

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
  const [renderList, setRenderList] = useState<
    {
      id: string;
      icons: Icon[];
    }[]
  >([]);
  const [totalHeight, setTotalHeight] = useState(0);
  // const renderList = useMemo(() => {

  // }, [icons]);
  // const [scroll, setScroll] = useState({
  //   scrollHeight: 0,
  //   scrollTop: 0,
  //   domHeight: 0,
  // });
  // const [renderIcons, setRenderIcons] = useState<Icon[]>([]);
  const { message } = App.useApp();

  useEffect(() => {
    if (!el.current) return;
    const W = el.current.offsetWidth;
    // const H = el.current.offsetHeight;
    let rowC = Math.floor(W / (ICON_SIZE + ICON_GAP));
    if (W - rowC * (ICON_SIZE + ICON_GAP) === ICON_SIZE) {
      rowC += 1;
    }
    const rowN = Math.ceil(icons.length / rowC);
    const totalHeight = (rowN - 1) * (ICON_SIZE + ICON_GAP) + ICON_SIZE;
    const list = [];
    for (let i = 0; i < rowN; i++) {
      const si = i * rowC;
      const ics = icons.slice(si, si + rowC);
      list.push({
        id: ics.map((ic) => ic.id).join('--'),
        icons: ics,
      });
    }
    setRenderList(list);
    setTotalHeight(totalHeight);
    // const scrollHeight = Math.max(0, totalHeight - H);
    // setScroll({
    //   scrollHeight,
    //   scrollTop: 0,
    //   domHeight: H,
    // });
  }, [icons]);

  // const h = useCallback(
  //   (st: number, sh: number) => {
  //     if (!el.current) return;
  //     const W = el.current.offsetWidth;
  //     const H = el.current.offsetHeight;
  //     let rowC = Math.floor(W / (ICON_SIZE + ICON_GAP));
  //     if (W - rowC * (ICON_SIZE + ICON_GAP) === ICON_SIZE) {
  //       rowC += 1;
  //     }
  //     const rowN = Math.ceil(H / (ICON_SIZE + ICON_GAP));
  //     const h = Math.round(st * sh);
  //     const n = Math.floor(h / (ICON_SIZE + ICON_GAP));
  //     const si = rowC * n;
  //     console.log(si, rowN, rowC);
  //     console.log(icons.slice(si, si + rowN * rowC));
  //     setRenderIcons(icons.slice(si, si + rowN * rowC));
  //   },
  //   [icons],
  // );

  // useEffect(() => {
  //   h(scroll.scrollTop, scroll.scrollHeight);
  // }, [scroll]);

  const renderTooltip = (icon: Icon) => (
    <div>
      <div>分类：{icon.name}</div>
      <div>名称：{icon.name}</div>
    </div>
  );
  return (
    <div ref={el} className='flex w-full flex-1 h-0 overflow-y-hidden select-none'>
      {totalHeight > 0 && renderList.length > 0 ? (
        <VirtualList
          className='w-full h-full'
          data={renderList}
          height={totalHeight}
          itemHeight={ICON_SIZE + ICON_GAP}
          itemKey='id'
        >
          {(item) => (
            <div className='flex' style={{ gap: `${ICON_GAP}px`, paddingBottom: ICON_GAP }}>
              {item.icons.map((ic) => (
                <Tooltip key={ic.id} title={renderTooltip(ic)}>
                  <div
                    className='flex flex-col cursor-pointer hover:text-hover'
                    onClick={() => {
                      void copyToClipboard(ic.body).then(() => {
                        void message.success('Copied!');
                      });
                    }}
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
          )}
        </VirtualList>
      ) : null}
    </div>
  );
};
