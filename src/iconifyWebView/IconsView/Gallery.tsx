import type { FC } from 'react';
import { useEffect, useRef, useState } from 'react';
import type { Icon } from '../../common';
import { ICON_GAP, ICON_SIZE, Ic } from '../Ic';

const IcList: FC<{ translateY: number; renderIcons: Icon[] }> = ({ translateY, renderIcons }) => {
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

  return (
    <div
      className='relative flex w-full flex-wrap overflow-hidden will-change-transform'
      style={{
        gap: ICON_GAP,
        // height: innerVisualHeight,
        transform: `translateY(${ty}px)`,
      }}
    >
      {icons.map((ic) => (
        <Ic icon={ic} key={ic.id} />
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
    let iconCountOfRow = Math.floor(W / (ICON_SIZE + ICON_GAP));
    if (W - iconCountOfRow * (ICON_SIZE + ICON_GAP) >= ICON_SIZE) {
      iconCountOfRow += 1;
    }
    const startRow = Math.floor(el.current.scrollTop / (ICON_SIZE + ICON_GAP));

    const visualHeight = el.current.offsetHeight;
    const visualRowCount = Math.ceil(visualHeight / (ICON_SIZE + ICON_GAP));
    const iconStartIndex = iconCountOfRow * startRow;
    // console.log(
    //   iconCountOfRow,
    //   startRow,
    //   visualRowCount,
    //   iconStartIndex,
    //   visualRowCount * iconCountOfRow,
    // );
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
    const W = (el.current.children[0] as HTMLDivElement).offsetWidth;
    // console.log(W, el.current.offsetWidth);
    let iconCountOfRow = Math.floor(W / (ICON_SIZE + ICON_GAP));
    if (W - iconCountOfRow * (ICON_SIZE + ICON_GAP) >= ICON_SIZE) {
      iconCountOfRow += 1;
    }
    const totalRows = Math.ceil(icons.length / iconCountOfRow);
    const totalHeight = (totalRows + 2) * (ICON_SIZE + ICON_GAP);
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
      className='relative h-0 w-full flex-1 select-none overflow-y-scroll'
      onScroll={() => {
        handleScroll();
      }}
    >
      <div className='relative w-full' style={{ height: scrollHeight }}>
        <IcList translateY={translateY} renderIcons={renderIcons} />
      </div>
    </div>
  );
};
