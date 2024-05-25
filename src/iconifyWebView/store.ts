import type { Icon, IconCategory } from '../common';
import { sortedInsert } from './util';

export const IconStore: {
  all: Map<string, IconCategory>;
  allFlat: Icon[];
} = {
  all: new Map(),
  allFlat: [],
};

export function simpleSearchIcons(text: string, category?: string) {
  const tokens = [...new Set(text.split(' ').filter((v) => !!v)).values()];
  const regexps = tokens.map((tk) => {
    return new RegExp('\\b' + tk + '\\b');
  });

  const result: { weight: number; index: number }[] = [];
  const allIcons = category ? IconStore.all.get(category)?.icons ?? [] : IconStore.allFlat;
  allIcons.forEach((ic, index) => {
    let weight = 0;
    tokens.forEach((tk, i) => {
      const reg = regexps[i];
      if (reg.test(ic.name)) {
        weight += 10;
      } else if (ic.name.includes(tk)) {
        weight += 1;
      }
    });
    if (weight > 0) {
      sortedInsert(result, { weight, index: index });
    }
  });

  return result.map((r) => allIcons[r.index]);
}
