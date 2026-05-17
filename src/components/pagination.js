import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.innerHTML = ''; // Очищаем контейнер полностью

  return (data, state, action) => {
    // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
    const rowsPerPage = state.rowsPerPage;
    const pageCount = Math.ceil(data.length / rowsPerPage);
    let page = state.page;

    // @todo: #2.6 — обработать действия
    if (action) {
      switch (action.name) {
        case "prev":
          page = Math.max(1, page - 1);  
          break;
        case "next":
          page = Math.min(pageCount, page + 1); 
          break;
        case "first":
          page = 1;
          break;
        case "last":
          page = pageCount;
          break;
      }
    }

    // @todo: #2.4 — получить список видимых страниц и вывести их
    const visiblePages = getPages(page, pageCount, 5);
    pages.replaceChildren(
      ...visiblePages.map((pageNumber) => {
        const el = pageTemplate.cloneNode(true);
        return createPage(el, pageNumber, pageNumber === page);
      }),
    );

    // @todo: #2.5 — обновить статус пагинации
    const startRow = data.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
    fromRow.textContent = startRow;
    toRow.textContent = Math.min(page * rowsPerPage, data.length);
    totalRows.textContent = data.length;

    // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
    const skip = (page - 1) * rowsPerPage;
    
    // Защита от некорректных значений
    if (skip >= data.length) {
      return [];
    }
    
    return data.slice(skip, skip + rowsPerPage);
  };
};