import type { CSSProperties, FC } from 'react';
import type { Icon } from '../common';

export const Ic: FC<{ icon: Icon; className?: string; style?: CSSProperties }> = ({
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
