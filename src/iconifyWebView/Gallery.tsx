import { useMemo, type FC } from 'react';
import type { Icon } from '../common';

const Ic: FC<{ icon: Icon }> = ({ icon }) => {
  const uri = useMemo(() => {
    const body = icon.body.replace('currentColor', 'red');
    return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg'>${body}</svg>`)}`;
  }, [icon.name]);
  return <img className='block size-full object-contain' src={uri} />;
};
export const Gallery: FC<{ icons: Icon[] }> = ({ icons }) => {
  return (
    <div className='flex flex-1 flex-wrap justify-between gap-4 overflow-y-auto border border-blue p-4'>
      {icons.map((ic) => {
        return (
          <div key={ic.name} className='size-14'>
            <Ic icon={ic} />
          </div>
        );
      })}
    </div>
  );
};
