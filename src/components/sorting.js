import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  const columnStates = columns.map(() => null);
  
  // Функция преобразования 'up'/'down' в 'asc'/'desc'
  const convertOrder = (value) => {
    if (value === 'up') return 'asc';
    if (value === 'down') return 'desc';
    return null;
  };
  
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      // @todo: #3.1 — запомнить выбранный режим сортировки
      const columnIndex = columns.findIndex((col) => col === action);
      if (columnIndex !== -1) {
        const currentState = columnStates[columnIndex] || "none";
        const nextState = sortMap[currentState] || "none";
        columnStates[columnIndex] = nextState;
        
        // Обновите переменные (согласно заданию)
        action.dataset.value = sortMap[action.dataset.value];    // Сохраним и применим как текущее следующее состояние из карты
        field = action.dataset.field;                            // Информация о сортируемом поле есть также в кнопке
        
        // Для sortCollection нужно преобразовать 'up'/'down' в 'asc'/'desc'
        order = convertOrder(action.dataset.value);
      }

      // @todo: #3.2 — сбросить сортировки остальных колонок
      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
          const idx = columns.findIndex((col) => col === column);
          if (idx !== -1) columnStates[idx] = null;
        }
      });
    } else {
      // @todo: #3.3 — получить выбранный режим сортировки
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = convertOrder(column.dataset.value);
        }
      });
    }

    return sortCollection(data, field, order);
  };
}