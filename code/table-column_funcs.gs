// TC = table column – столбец таблицы TD (table-dict)
// структура описана в TC_init(); ячейки списка cells имеют те же свойства, что и title

// создание объектов
function TC_init() {return {title: COinit(), cells: [], init_pos: null}}
function TC_init_from_lists(lists_dict) {
    // lists_dict – словарь {value:[], bg_color:[], note:[]}; можно передавать без любых ключей
    let final = TC_init();
    for (let key of Object.keys(lists_dict)) {
        final.title[key] = lists_dict[key].shift(); // .shift() удаляет первый элемент и возвращает его
    }
    if (!LIST_check_length_equal(Object.values(lists_dict))) {LOG('TC_init_diff_len')}

    final.cells = COl_from_lists(lists_dict);
    return final;
}
