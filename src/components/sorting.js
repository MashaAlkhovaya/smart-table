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
        action.dataset.value = sortMap[action.dataset.value];
        field = action.dataset.field;
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

    // Если сортировка не активна, возвращаем исходные данные
    if (!field || !order) {
      return data;
    }

    // Для корректной сортировки дат и чисел создаем копию данных
    const sortedData = [...data];
    
    // Своя сортировка, если sortCollection работает некорректно
    sortedData.sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];
      
      // Специальная обработка для дат
      if (field === 'date') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      // Для чисел
      else if (field === 'total') {
        aVal = parseFloat(aVal) || 0;
        bVal = parseFloat(bVal) || 0;
      }
      // Для строк
      else if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }
      
      if (order === 'asc') {
        return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
      } else {
        return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
      }
    });
    
    return sortedData;
    
    // Или используйте sortCollection, если он работает:
    // return sortCollection(data, field, order);
  };
}