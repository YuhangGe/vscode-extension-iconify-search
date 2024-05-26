import type { Icon, ViewBox } from '../../common';

export function parseJsonBuffer(buffer: ArrayBuffer) {
  const cnt = new TextDecoder().decode(buffer);
  const data = JSON.parse(cnt) as {
    prefix: string;
    info: { name: string } & ViewBox;
    icons: Record<string, Icon & ViewBox>;
  } & ViewBox;
  const left = data.left ?? data.info.left ?? 0;
  const top = data.top ?? data.info.top ?? 0;
  const width = data.width ?? data.info.width ?? 16;
  const height = data.height ?? data.info.height ?? 16;
  const category = data.prefix;
  const icons = Object.entries(data.icons).map(([name, icon]) => {
    icon.name = name;
    icon.id = category + ':' + name;
    const l = icon.left ?? left;
    const t = icon.top ?? top;
    const w = icon.width ?? width;
    const h = icon.height ?? height;
    const viewPort = `${l} ${t} ${w} ${h}`;
    const xml = `<svg xmlns='http://www.w3.org/2000/svg' viewBox='${viewPort}'>${icon.body}</svg>`;
    icon.body = xml;
    icon.category = category;
    return icon;
  });
  return {
    category,
    name: data.info.name,
    icons,
  };
}
