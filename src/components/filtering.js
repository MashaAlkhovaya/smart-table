import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const comparison = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes).forEach((elementName) => {
    elements[elementName].innerHTML = "";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Все";
    elements[elementName].appendChild(defaultOption);

    elements[elementName].append(
      ...Object.values(indexes[elementName]).map((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        return option;
      }),
    );
  });

  return (data, state, action) => {
    // Создаем копию state, чтобы не мутировать исходный
    let currentState = { ...state };

    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const fieldName = action.dataset.field;
      if (fieldName) {
        // Очищаем значение в DOM элементе
        if (elements[fieldName]) {
          elements[fieldName].value = "";
        }
        // Очищаем значение в state
        currentState[fieldName] = "";
      }
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    let filteredData = [...data];

    // Фильтрация по дате (поиск подстроки)
    if (currentState.date && currentState.date !== "") {
      const dateFilter = currentState.date.toLowerCase();
      filteredData = filteredData.filter(
        (item) => item.date && item.date.toLowerCase().includes(dateFilter),
      );
    }

    // Фильтрация по покупателю (customer) - поиск подстроки
    if (currentState.customer && currentState.customer !== "") {
      const customerFilter = currentState.customer.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.customer && item.customer.toLowerCase().includes(customerFilter),
      );
    }

    // Фильтрация по продавцу (seller) - точное совпадение
    if (currentState.seller && currentState.seller !== "") {
      filteredData = filteredData.filter(
        (item) => item.seller === currentState.seller,
      );
    }

    // Фильтрация по диапазону суммы: totalFrom
    if (currentState.totalFrom && currentState.totalFrom !== "") {
      const minTotal = parseFloat(currentState.totalFrom);
      if (!isNaN(minTotal)) {
        filteredData = filteredData.filter((item) => item.total >= minTotal);
      }
    }

    // Фильтрация по диапазону суммы: totalTo
    if (currentState.totalTo && currentState.totalTo !== "") {
      const maxTotal = parseFloat(currentState.totalTo);
      if (!isNaN(maxTotal)) {
        filteredData = filteredData.filter((item) => item.total <= maxTotal);
      }
    }

    // Фильтрация по searchBySeller
    if (currentState.searchBySeller && currentState.searchBySeller !== "") {
      filteredData = filteredData.filter(
        (item) => item.seller === currentState.searchBySeller,
      );
    }

    return filteredData;
  };
}
