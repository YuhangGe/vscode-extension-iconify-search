import type { CSSProperties, FC } from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { App, Tooltip } from 'antd';
import type { Icon } from '../common';
import { copyToClipboard } from './util';

const ICON_SIZE = 56;
const ICON_GAP = 16;

const Ic: FC<{ icon: Icon; className?: string; style?: CSSProperties }> = ({
  style,
  icon,
  className,
}) => {
  const uri = useMemo(() => {
    return `data:image/svg+xml,${encodeURIComponent(icon.body)}`;
  }, [icon.body]);
  return <img className={className} style={style} src={uri} />;
};

export const Gallery: FC<{ icons: Icon[] }> = ({ icons }) => {
  const el = useRef<HTMLDivElement>(null);
  const [scrollHeight, setScrollHeight] = useState(0);
  const [scrollTop, setScrollTop] = useState(0);
  const [innerVisualHeight, setInnerVisualHeight] = useState(0);
  useEffect(() => {
    if (!el.current) return;
    const visualN = Math.ceil(el.current.offsetHeight / (ICON_SIZE + ICON_GAP));
    setInnerVisualHeight((visualN - 1) * (ICON_SIZE + ICON_GAP) + ICON_SIZE);
  }, []);

  const [renderIcons, setRenderIcons] = useState<Icon[]>([]);
  const { message } = App.useApp();

  const x = useRef(0);
  const preIconStartIndex = useRef(-1);
  const calcRenderIcons = () => {
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
    if (preIconStartIndex.current !== iconStartIndex) {
      // if (preIconStartIndex.current >= 0) {
      //   setRenderIcons([]);
      //   return;
      // }
      preIconStartIndex.current = iconStartIndex;
      console.log(iconStartIndex, visualRowCount, iconCountOfRow);
      // console.log(icons.slice(iconStartIndex, iconStartIndex + visualRowCount * iconCountOfRow));

      window.clearTimeout(x.current);
      x.current = window.setTimeout(() => {
        el.current && (el.current.children[0].children[0].style.display = 'none');

        setRenderIcons(
          icons.slice(iconStartIndex, iconStartIndex + visualRowCount * iconCountOfRow),
        );
      }, 100);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      el.current && (el.current.children[0].children[0].style.display = 'flex');
      el.current.children[0].children[0].style.transform = `translateY(${el.current?.scrollTop})px`;
    }, 300);
  }, [renderIcons]);

  useEffect(() => {
    if (!el.current) return;
    const W = el.current.offsetWidth;
    let rowC = Math.floor(W / (ICON_SIZE + ICON_GAP));
    if (W - rowC * (ICON_SIZE + ICON_GAP) === ICON_SIZE) {
      rowC += 1;
    }
    const rowN = Math.ceil(icons.length / rowC);
    const totalHeight = (rowN - 1) * (ICON_SIZE + ICON_GAP) + ICON_SIZE;
    console.log('SET SCROLLTOP 0');
    el.current.scrollTop = 0;
    setScrollHeight(totalHeight);
    calcRenderIcons();
  }, [icons]);

  const handleScroll = () => {
    if (!el.current) return;
    calcRenderIcons();
  };

  const renderTooltip = (icon: Icon) => (
    <div>
      <div>分类：{icon.name}</div>
      <div>名称：{icon.name}</div>
    </div>
  );
  return (
    <div
      ref={el}
      className='w-full relative flex-1 h-0 overflow-y-scroll select-none'
      onScroll={() => {
        handleScroll();
      }}
    >
      <div className='w-full relative' style={{ height: scrollHeight }}>
        <div
          className='absolute left-0 top-0 w-full overflow-hidden flex flex-wrap'
          style={{
            gap: ICON_GAP,
            height: innerVisualHeight,
          }}
        >
          {renderIcons.map((ic) => (
            <Tooltip key={ic.id} title={renderTooltip(ic)}>
              <div
                className='flex flex-col hover:text-hover cursor-pointer'
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
                  className='block flex-shrink-0 w-full'
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
      </div>
    </div>
  );
};
