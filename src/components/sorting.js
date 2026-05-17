import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  const columnStates = columns.map(() => null);
  
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
        
        // Обновите переменные
        action.dataset.value = sortMap[action.dataset.value];
        field = action.dataset.field;
        order = action.dataset.value;
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
          order = column.dataset.value;
        }
      });
    }

    return sortCollection(data, field, order);
  };
}