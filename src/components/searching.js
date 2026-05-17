import { rules, createComparison } from "../lib/compare.js";

export function initSearching(searchField) {
  // @todo: #5.1 — настроить компаратор
  const comparison = createComparison({
    ['skipEmptyTargetValues']: rules.searchMultipleFields(searchField, ['date', 'customer', 'seller'], false)
  });

//   const searchRule = rules.searchMultipleFields(
//     searchField,
//     ['date', 'customer', 'seller'],
//     false
//   );

  return (data, state, action) => {
    // @todo: #5.2 — применить компаратор
    const searchValue = state[searchField];
    
    if (!searchValue || searchValue.trim() === '') {
      return data;
    }
    
    return data.filter(item => searchRule(item, searchValue));
  };
}