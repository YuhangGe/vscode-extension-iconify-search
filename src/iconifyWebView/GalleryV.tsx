import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import { App, Tooltip } from 'antd';
import type { Icon } from '../common';
import { copyToClipboard } from './util';
import { Ic } from './Ic';

const ICON_SIZE = 56;
const ICON_GAP = 16;

const IcList: FC<{ translateY: number; renderIcons: Icon[] }> = ({ translateY, renderIcons }) => {
  const { message } = App.useApp();
  const [icons, setIcons] = useState<Icon[]>([]);
  const [ty, setTy] = useState(0);
  const x = useRef(0);
  useEffect(() => {
    window.clearTimeout(x.current);
    x.current = window.setTimeout(() => {
      setIcons([]);
      x.current = window.setTimeout(() => {
        setTy(translateY);
        setIcons(renderIcons);
      });
    });
  }, [renderIcons, translateY]);
  useEffect(() => {
    return () => window.clearTimeout(x.current);
  }, []);
  const renderTooltip = (icon: Icon) => (
    <div>
      <div>分类：{icon.name}</div>
      <div>名称：{icon.name}</div>
    </div>
  );
  return (
    <div
      className='relative w-full overflow-hidden flex flex-wrap will-change-transform'
      style={{
        gap: ICON_GAP,
        // height: innerVisualHeight,
        transform: `translateY(${ty}px)`,
      }}
    >
      {icons.map((ic) => (
        <Tooltip key={ic.id} title={renderTooltip(ic)}>
          <div
            className='flex flex-col hover:text-blue cursor-pointer'
            onClick={() => {
              void copyToClipboard(ic.body).then(() => {
                void message.success('Copied!');
              });
            }}
            style={{
              width: ICON_SIZE,
            }}
          >
            <Ic
              className='block flex-shrink-0 w-full [&>svg]:size-full'
              style={{ height: ICON_SIZE }}
              icon={ic}
            />
            <div className='flex-1 flex items-center h-4'>
              <span className='w-full truncate text-center'>{ic.name}</span>
            </div>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};
export const Gallery: FC<{ icons: Icon[] }> = ({ icons }) => {
  const el = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [translateY, setTranslateY] = useState(0);
  const [renderIcons, setRenderIcons] = useState<Icon[]>([]);

  // const x = useRef(0);
  const preIconStartIndex = useRef(-1);
  const calcRenderIcons = (allIcons: Icon[], force = false) => {
    if (!el.current) return;
    const W = (el.current.children[0] as HTMLDivElement).offsetWidth;
    // console.log(W, el.current.offsetWidth);
    const visualHeight = el.current.offsetHeight;
    let iconCountOfRow = Math.floor(W / (ICON_SIZE + ICON_GAP));
    if (W - iconCountOfRow * (ICON_SIZE + ICON_GAP) === ICON_SIZE) {
      iconCountOfRow += 1;
    }
    const startRow = Math.floor(el.current.scrollTop / (ICON_SIZE + ICON_GAP));
    const visualRowCount = Math.ceil(visualHeight / (ICON_SIZE + ICON_GAP));
    const iconStartIndex = iconCountOfRow * startRow;
    if (preIconStartIndex.current !== iconStartIndex || force) {
      preIconStartIndex.current = iconStartIndex;
      // console.log(iconStartIndex, visualRowCount, iconCountOfRow);
      // console.log(icons.slice(iconStartIndex, iconStartIndex + visualRowCount * iconCountOfRow));
      setTranslateY(startRow * (ICON_SIZE + ICON_GAP));
      setRenderIcons(
        allIcons.slice(iconStartIndex, iconStartIndex + visualRowCount * iconCountOfRow),
      );
    }
  };
  useEffect(() => {
    if (!el.current) return;
    const W = el.current.offsetWidth;
    let rowC = Math.floor(W / (ICON_SIZE + ICON_GAP));
    if (W - rowC * (ICON_SIZE + ICON_GAP) === ICON_SIZE) {
      rowC += 1;
    }
    const rowN = Math.ceil(icons.length / rowC);
    const totalHeight = (rowN - 1) * (ICON_SIZE + ICON_GAP) + ICON_SIZE;
    el.current.scrollTop = 0;
    setScrollHeight(totalHeight);
    // console.log('CCC', icons.length);
    calcRenderIcons(icons, true);
  }, [icons]);

  const handleScroll = () => {
    if (!el.current) return;
    calcRenderIcons(icons);
  };

  return (
    <div
      ref={el}
      className='w-full relative flex-1 h-0 overflow-y-scroll select-none'
      onScroll={() => {
        handleScroll();
      }}
    >
      <div className='w-full relative' style={{ height: scrollHeight }}>
        <IcList translateY={translateY} renderIcons={renderIcons} />
      </div>
    </div>
  );
};
