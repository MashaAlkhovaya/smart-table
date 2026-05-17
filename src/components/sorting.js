import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
  const columnStates = columns.map(() => null);
  
  // Функция преобразования для sortCollection
  const getSortOrder = (value) => {
    if (value === 'up') return 'asc';
    if (value === 'down') return 'desc';
    return null;
  };
  
  return (data, state, action) => {
    let field = null;
    let order = null;

    if (action && action.name === "sort") {
      const columnIndex = columns.findIndex((col) => col === action);
      if (columnIndex !== -1) {
        const currentState = columnStates[columnIndex] || "none";
        const nextState = sortMap[currentState] || "none";
        columnStates[columnIndex] = nextState;
        
        action.dataset.value = sortMap[action.dataset.value];
        field = action.dataset.field;
        order = getSortOrder(action.dataset.value);
      }

      columns.forEach((column) => {
        if (column.dataset.field !== action.dataset.field) {
          column.dataset.value = "none";
          const idx = columns.findIndex((col) => col === column);
          if (idx !== -1) columnStates[idx] = null;
        }
      });
    } else {
      columns.forEach((column) => {
        if (column.dataset.value !== "none") {
          field = column.dataset.field;
          order = getSortOrder(column.dataset.value);
        }
      });
    }

    return sortCollection(data, field, order);
  };
}