// TC = table column – столбец таблицы TD (table-dict)
// структура описана в TCinit(); ячейки списка cells имеют те же свойства, что и title

// создание объектов
function TCinit() {return {title: COinit(), cells: [], initPos: null}}
function TCinit_fromLists(lists_dict) {
    // lists_dict – словарь {value:[], bgColor:[], note:[]}; можно передавать без любых ключей
    let final = TCinit();
    for (let key of Object.keys(lists_dict)) {
        final.title[key] = lists_dict[key].shift(); // .shift() удаляет первый элемент и возвращает его
    }
    if (!LIST_check_length_equal(Object.values(lists_dict))) {LOG('TCinit_diffLen')}

    final.cells = COl_fromLists(lists_dict);
    return final;
}
