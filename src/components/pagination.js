import { getPages } from "../lib/utils.js";

export const initPagination = (
  { pages, fromRow, toRow, totalRows },
  createPage,
) => {
  // @todo: #2.3 — подготовить шаблон кнопки для страницы и очистить контейнер
  const pageTemplate = pages.firstElementChild.cloneNode(true);
  pages.innerHTML = "";

  return (data, state, action) => {
    // @todo: #2.1 — посчитать количество страниц, объявить переменные и константы
    const rowsPerPage = state.rowsPerPage || 10;
    const pageCount = Math.ceil(data.length / rowsPerPage) || 1;
    let page = state.page || 1;

    // Корректируем текущую страницу, если она больше общего количества страниц
    if (page > pageCount) {
      page = pageCount;
    }
    if (page < 1) {
      page = 1;
    }

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
    const endRow = Math.min(page * rowsPerPage, data.length);

    fromRow.textContent = startRow;
    toRow.textContent = endRow;
    totalRows.textContent = data.length;

    // @todo: #2.2 — посчитать сколько строк нужно пропустить и получить срез данных
    const skip = (page - 1) * rowsPerPage;

    // Защита от выхода за границы
    if (skip >= data.length) {
      return [];
    }

    return data.slice(skip, skip + rowsPerPage);
  };
};
