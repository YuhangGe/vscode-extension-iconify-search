/** this file is deprecated */
import type { MouseEvent as ReactMouseEvent, FC } from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

export const Scroll: FC<{
  scrollHeight: number;
  scrollTop: number;
  domHeight: number;
  onScroll: (v: number) => void;
}> = ({ scrollHeight, domHeight, scrollTop, onScroll }) => {
  const [barHeight, setBarHeight] = useState(domHeight);
  const [barTrans, setBarTrans] = useState(0);
  useEffect(() => {
    setBarHeight(Math.max(80, domHeight - scrollHeight));
  }, [scrollHeight]);

  useEffect(() => {
    // console.log(scrollTop, domHeight - barHeight);
    setBarTrans(Math.round(scrollTop * (domHeight - barHeight)));
  }, [scrollTop, domHeight, barHeight]);

  const p = useRef({
    maxTrans: 0,
    offset: 0,
    down: 0,
  });

  const onMove = useCallback((evt: MouseEvent) => {
    const dy = evt.pageY - p.current.down;
    // console.log('move', p.current.offset + dy);
    const st = p.current.offset + dy;
    const v = st < 0 ? 0 : st >= p.current.maxTrans ? 1.0 : st / p.current.maxTrans;
    onScroll(v);
  }, []);
  const onUp = useCallback(() => {
    document.documentElement.removeEventListener('mousemove', onMove, { capture: true });
    document.documentElement.removeEventListener('mouseup', onUp, { capture: true });
  }, []);
  const onDown = (evt: ReactMouseEvent) => {
    p.current.down = evt.pageY;
    p.current.offset = barTrans;
    p.current.maxTrans = domHeight - barHeight;
    document.documentElement.addEventListener('mousemove', onMove, { capture: true });
    document.documentElement.addEventListener('mouseup', onUp, { capture: true });
  };

  return (
    <div className='h-full w-4 overflow-hidden border-l border-solid border-border'>
      <div
        onMouseDownCapture={onDown}
        className='w-full cursor-pointer bg-black opacity-20 dark:bg-white'
        style={{ height: barHeight, transform: `translateY(${barTrans}px)` }}
      ></div>
    </div>
  );
};
