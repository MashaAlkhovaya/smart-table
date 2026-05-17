import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    
    elements[elementName].innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Все';
    elements[elementName].appendChild(defaultOption);
    
    // Добавляем опции из индексов
    elements[elementName].append(
      ...Object.values(indexes[elementName]).map(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        return option;
      })
    );
  });

  return (data, state, action) => {
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === 'clear') {
      const fieldName = action.dataset.field;
      if (fieldName) {
        const parent = action.parentElement;
        const input = parent?.querySelector('input, select');
        if (input) {
          input.value = '';
        }
        
        state[fieldName] = '';
      }
    }
    const filterState = { ...state };
    
    
    // Обработка totalFrom и totalTo как диапазона
    if (filterState.totalFrom || filterState.totalTo) {
      const from = filterState.totalFrom ? parseFloat(filterState.totalFrom) : -Infinity;
      const to = filterState.totalTo ? parseFloat(filterState.totalTo) : Infinity;
      filterState.total = [from, to];
      delete filterState.totalFrom;
      delete filterState.totalTo;
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    return data.filter(row => compare(row, filterState));
  };
}