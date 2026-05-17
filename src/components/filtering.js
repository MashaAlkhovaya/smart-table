import { createComparison, defaultRules } from "../lib/compare.js";

// @todo: #4.3 — настроить компаратор
const comparison = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    Object.keys(indexes).forEach((elementName) => {
        elements[elementName].innerHTML = '';
        
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Все';
        elements[elementName].appendChild(defaultOption);
        
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
            if (fieldName && elements[fieldName]) {
                elements[fieldName].value = '';
                if (state) state[fieldName] = '';
            }
        }

        // @todo: #4.5 — отфильтровать данные используя компаратор
        let filteredData = [...data];
        
        // Фильтрация по дате (поиск подстроки)
        if (state.date && state.date !== '') {
            const dateFilter = state.date.toLowerCase();
            filteredData = filteredData.filter(item => 
                item.date && item.date.toLowerCase().includes(dateFilter)
            );
        }
        
        // Фильтрация по покупателю (customer) - поиск подстроки
        if (state.customer && state.customer !== '') {
            const customerFilter = state.customer.toLowerCase();
            filteredData = filteredData.filter(item => 
                item.customer && item.customer.toLowerCase().includes(customerFilter)
            );
        }
        
        // Фильтрация по продавцу (seller) - точное совпадение (из выпадающего списка)
        if (state.seller && state.seller !== '') {
            filteredData = filteredData.filter(item => 
                item.seller === state.seller
            );
        }
        
        // Фильтрация по диапазону суммы: totalFrom
        if (state.totalFrom && state.totalFrom !== '') {
            const minTotal = parseFloat(state.totalFrom);
            if (!isNaN(minTotal)) {
                filteredData = filteredData.filter(item => 
                    item.total >= minTotal
                );
            }
        }
        
        // Фильтрация по диапазону суммы: totalTo
        if (state.totalTo && state.totalTo !== '') {
            const maxTotal = parseFloat(state.totalTo);
            if (!isNaN(maxTotal)) {
                filteredData = filteredData.filter(item => 
                    item.total <= maxTotal
                );
            }
        }
        
        // Фильтрация по searchBySeller (если есть такой элемент)
        if (state.searchBySeller && state.searchBySeller !== '') {
            filteredData = filteredData.filter(item => 
                item.seller === state.searchBySeller
            );
        }
        
        return filteredData;
    };
}
