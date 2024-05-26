import { useMemo, useState, type CSSProperties, type FC, type ReactNode } from 'react';
import { App, Button, Popover } from 'antd';
import type { Icon } from '../common';
import { copyToClipboard } from './util';
import { globalStore, updateFavorIcon } from './store';
import { vscode } from './vscode';

const IcTooltipTitle: FC<{ icon: Icon }> = ({ icon }) => {
  const [favorIcons] = globalStore.useStore('favorIcons');
  const isFavor = useMemo(() => {
    // console.log('calc is favor');
    return favorIcons.indexOf(icon.id) >= 0;
  }, [favorIcons]);

  return (
    <div className='flex items-center gap-4'>
      <span>{icon.name}</span>
      <Button
        size='small'
        type='text'
        className='text-orange hover:text-orange flex items-center justify-center'
        onClick={() => {
          updateFavorIcon(!isFavor ? 'add' : 'rm', icon);
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
const IcTooltipContent: FC<{ icon: Icon }> = ({ icon }) => {
  const [all] = globalStore.useStore('all');

  return (
    <div>
      <div className='text-sm opacity-70'>
        前缀：
        <span
          className='hover:underline cursor-pointer'
          onClick={() => {
            globalStore.set('topTab', 'all');
            globalStore.set('groupTab', icon.category);
          }}
        >
          {icon.category}
        </span>
      </div>
      <div className='text-sm opacity-70'>
        分类：
        <span
          className='hover:underline cursor-pointer'
          onClick={() => {
            globalStore.set('topTab', 'all');
            globalStore.set('groupTab', icon.category);
          }}
        >
          {all.get(icon.category)?.name}
        </span>
      </div>
    </div>
  );
};
export const IcTooltip: FC<{
  open: boolean;
  onOpenChange: (open: boolean) => void;
  icon: Icon;
  children: ReactNode;
}> = ({ open, icon, children, onOpenChange }) => {
  return (
    <Popover
      open={open}
      onOpenChange={onOpenChange}
      mouseEnterDelay={0.4}
      destroyTooltipOnHide
      title={<IcTooltipTitle icon={icon} />}
      content={<IcTooltipContent icon={icon} />}
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

function getIconCode(icon: Icon) {
  return `<span className="icon-[${icon.category}--${icon.name}]"></span>`;
}
export const Ic: FC<{ icon: Icon }> = ({ icon }) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  return (
    <IcTooltip icon={icon} open={open} onOpenChange={(v) => setOpen(v)}>
      <div
        className='flex flex-col hover:text-blue cursor-pointer'
        onClick={() => {
          setOpen(false);
          void copyToClipboard(getIconCode(icon)).then(() => {
            void message.success('Copied!');
          });
        }}
        onDoubleClick={() => {
          vscode.postMessage({ type: 'insert', code: getIconCode(icon) });
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
