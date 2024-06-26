import { useMemo, useState, type CSSProperties, type FC, type ReactNode } from 'react';
import { App, Button, Popover } from 'antd';
import type { Icon } from '../common';
import { copyToClipboard } from './util';
import { globalStore, updateFavorIcon } from './store';
import { getIconCode } from './code';
import { vscode } from './vscode';
import { t } from './locale';

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
        className='flex items-center justify-center text-orange hover:text-orange'
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
        {t('Prefix:')}
        <span
          className='cursor-pointer hover:underline'
          onClick={() => {
            globalStore.set('topTab', 'all');
            globalStore.set('groupTab', icon.category);
          }}
        >
          {icon.category}
        </span>
      </div>
      <div className='text-sm opacity-70'>
        {t('Category:')}
        <span
          className='cursor-pointer hover:underline'
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

export const ICON_SIZE = 64;
export const ICON_GAP = 16;

export const Ic: FC<{ icon: Icon }> = ({ icon }) => {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  return (
    <IcTooltip icon={icon} open={open} onOpenChange={(v) => setOpen(v)}>
      <div
        className='relative flex cursor-pointer flex-col [&>.ctrl]:hidden [&>.ctrl]:hover:block'
        onClick={() => {
          setOpen(false);
          void copyToClipboard(getIconCode(icon, globalStore.get('codeType'))).then(() => {
            void message.success(t('Copied!'));
          });
        }}
        // onDoubleClick={() => {
        //
        // }}
        style={{
          width: ICON_SIZE,
        }}
      >
        <IcImg
          className='block w-full shrink-0 [&>svg]:size-full'
          style={{ height: ICON_SIZE }}
          icon={icon}
        />
        <div className='flex h-4 flex-1 items-center'>
          <span className='w-full truncate text-center'>{icon.name}</span>
        </div>
        <div className='ctrl absolute left-1/2 top-[calc((100%-16px)/2)] -translate-x-1/2 -translate-y-1/2'>
          <Button.Group>
            <Button
              size='small'
              type='primary'
              icon={<span className='icon-[ant-design--copy-outlined]'></span>}
            />
            <Button
              size='small'
              type='primary'
              onClick={(evt) => {
                evt.stopPropagation();
                evt.preventDefault();
                vscode.postMessage({
                  type: 'insert',
                  code: getIconCode(icon, globalStore.get('codeType')),
                });
              }}
              icon={<span className='icon-[material-symbols--code]'></span>}
            />
          </Button.Group>
        </div>
      </div>
    </IcTooltip>
  );
};
