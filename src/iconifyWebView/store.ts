// import flexsearch from 'flexsearch';
import Minisearch from 'minisearch';
import type { Icon, IconCategory } from '../common';

export const IconStore: {
  favors: string[];
  all: IconCategory[];
  allFlat: Icon[];
} = {
  favors: [],
  all: [],
  allFlat: [],
};

// const searchIndex = new flexsearch.Index({
//   tokenize: 'forward',
// });
export const searchEngine = new Minisearch({
  fields: ['name'],
  tokenize: (string) => string.split(/[-_]/),
  searchOptions: {
    tokenize: (text) => text.split(/\s+/),
    // boost: { }
  },
});
// export function addSearch(index: number, iconName: string) {
//   searchIndex.add(index, iconName.toLowerCase().replace(/[-_]/g, ' '));
// }
// export function search(keyword: string) {
//   return searchIndex.search(keyword, 100000);
// }

// export function searchIcons(text: string) {
//   const tokens = [...(new Set(text.split(' ').filter((v) => !!v)).values()];
//   const regexps = tokens.map(tk => {
//     return new RegExp('\\b' + tk + '\\b');
//   })
//   const result: number[] = [];
//   IconStore.allFlat.forEach((ic, index) => {
//     let weight = 0;
//     tokens.forEach((tk, i) => {
//       const reg = regexps[i];
//       if (reg.test(ic.name)) {

//       }
//     });
//   });
// }
