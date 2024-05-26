import type { FC } from 'react';
import { IconStore } from '../store';
import { ICON_GAP, Ic } from '../Ic';

export const FavoritesView: FC = () => {
  return (
    <div
      className='flex flex-wrap w-full mt-4'
      style={{
        gap: ICON_GAP,
      }}
    >
      {IconStore.favorites.map((ic) => (
        <Ic icon={ic} key={ic.id} />
      ))}
    </div>
  );
};
