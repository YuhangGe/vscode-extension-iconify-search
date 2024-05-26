import { useState, type CSSProperties, type FC, type ReactNode } from 'react';
import { App, Button, Popover } from 'antd';
import type { Icon } from '../common';
import { IconStore } from './store';
import { copyToClipboard } from './util';

const IcTooltipTitle: FC<{ icon: Icon }> = ({ icon }) => {
  const [isFavor, setIsFavor] = useState(() => {
    // console.log('calc is favor');
    return IconStore.favorites.indexOf(icon) >= 0;
  });

  return (
    <div className='flex items-center gap-4'>
      <span>{icon.name}</span>
      <Button
        size='small'
        type='text'
        className='text-orange hover:text-orange flex items-center justify-center'
        onClick={() => {
          if (isFavor) {
            const idx = IconStore.favorites.indexOf(icon);
            idx >= 0 && IconStore.favorites.splice(idx, 1);
            setIsFavor(false);
          } else {
            IconStore.favorites.push(icon);
            setIsFavor(true);
          }
        }}
      >
        {isFavor ? (
          <span className='icon-[ant-design--star-filled]'></span>
        ) : (
          <span className='icon-[ant-design--star-outlined]'></span>
        )}
      </Button>
    </div>
  );
};
export const IcTooltip: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: Icon;
  children?: ReactNode;
}> = ({ open, icon, children, onOpenChange }) => {
  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      mouseEnterDelay={0.4}
      destroyTooltipOnHide
      title={<IcTooltipTitle icon={icon} />}
      content={
        <div>
          <div className='text-sm opacity-70'>前缀：{icon.category}</div>
          <div className='text-sm opacity-70'>分类：{IconStore.all.get(icon.category)?.name}</div>
        </div>
      }
    >
      {children}
    </Popover>
  );
};
export const IcImg: FC<{ icon: Icon; className?: string; style?: CSSProperties }> = ({
  style,
  icon,
  className,
}) => {
  // const uri = useMemo(() => {
  //   const clr = color || (isDark ? '#fff' : '#555');
  //   const body = icon.body.replace(/currentColor/gi, clr);
  //   return `data:image/svg+xml,${encodeURIComponent(body)}`;
  // }, [icon.body, color, isDark]);
  // return <img className={className} style={style} src={uri} />;
  return (
    <span
      className={className}
      style={style}
      dangerouslySetInnerHTML={{ __html: icon.body }}
    ></span>
  );
};

export const ICON_SIZE = 56;
export const ICON_GAP = 16;

export const Ic: FC<{ icon: Icon }> = ({ icon }) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  return (
    <IcTooltip icon={icon} open={open} onOpenChange={(v) => setOpen(v)}>
      <div
        className='flex flex-col hover:text-blue cursor-pointer'
        onClick={() => {
          void copyToClipboard(
            `<span className="icon-[${icon.category}--${icon.name}]"></span>`,
          ).then(() => {
            void message.success('Copied!');
          });
          setOpen(false);
        }}
        style={{
          width: ICON_SIZE,
        }}
      >
        <IcImg
          className='block flex-shrink-0 w-full [&>svg]:size-full'
          style={{ height: ICON_SIZE }}
          icon={icon}
        />
        <div className='flex-1 flex items-center h-4'>
          <span className='w-full truncate text-center'>{icon.name}</span>
        </div>
      </div>
    </IcTooltip>
  );
};
