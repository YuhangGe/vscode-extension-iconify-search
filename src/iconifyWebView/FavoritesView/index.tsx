import { useMemo, type FC } from 'react';
import { ICON_GAP, Ic } from '../Ic';
import type { Icon } from '../../common';
import { globalStore } from '../store';

export const FavoritesView: FC = () => {
  const [favorIcons] = globalStore.useStore('favorIcons');
  const [all] = globalStore.useStore('all');

  const icons = useMemo(() => {
    const ics: Set<Icon> = new Set();
    favorIcons.forEach((id) => {
      const [category, name] = id.split(':');
      if (!category || !name) return;
      const icon = all.get(category)?.icons.find((ic) => ic.name === name);
      if (icon) ics.add(icon);
    });
    return [...ics.values()];
  }, [favorIcons, all]);

  return (
    <div
      className='flex flex-wrap w-full mt-4'
      style={{
        gap: ICON_GAP,
      }}
    >
      {icons.map((ic) => (
        <Ic icon={ic} key={ic.id} />
      ))}
    </div>
  );
};
