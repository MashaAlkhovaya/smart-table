import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
  // @todo: #4.1 — заполнить выпадающие списки опциями
  Object.keys(indexes) // Получаем ключи из объекта
    .forEach((elementName) => {
      // Перебираем по именам
      elements[elementName].innerHTML = "";

      const defaultOption = document.createElement("option");
      defaultOption.value = "";
      defaultOption.textContent = "Все";
      elements[elementName].appendChild(defaultOption);

      // Добавляем опции из индексов
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
    // @todo: #4.2 — обработать очистку поля
    if (action && action.name === "clear") {
      const fieldName = action.dataset.field;

      if (fieldName && elements[fieldName]) {
        elements[fieldName].value = "";
        if (state) state[fieldName] = "";
      }
    }

    // @todo: #4.5 — отфильтровать данные используя компаратор
    let filteredData = [...data];

    // Фильтрация по select полям
    Object.keys(elements).forEach((elementName) => {
      const filterValue = state[elementName];
      if (filterValue && filterValue !== "") {
        filteredData = filteredData.filter(
          (item) => item[elementName] === filterValue,
        );
      }
    });

    // Фильтрация по диапазону суммы (totalFrom, totalTo)
    if (state.totalFrom && state.totalFrom !== "") {
      const minTotal = parseFloat(state.totalFrom);
      filteredData = filteredData.filter((item) => item.total >= minTotal);
    }

    if (state.totalTo && state.totalTo !== "") {
      const maxTotal = parseFloat(state.totalTo);
      filteredData = filteredData.filter((item) => item.total <= maxTotal);
    }

    return filteredData;
  };
}
