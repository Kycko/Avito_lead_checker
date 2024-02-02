// TC = table column – столбец таблицы TD (table-dict)
// структура описана в TCinit(); ячейки списка cells имеют те же свойства, что и title

// создание объектов
function TCinit() {
    return {
        title   : COinit(),                     // заголовок – объект cell_object
        checker : {unique: null, errors: null}, // шапка для подсчёта ошибок и уникальных
        cells   : [],                           // список cell_object'ов
        initPos : null                          // изначальная позиция в прочитанной таблице
    }
}
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

// преобразование в столбцы для записи на лист
function TC_toList(TC, types) {
    let final = {};
    for (let type of types) {
        final[type] = [TC.title[type]];
        for (let cell of TC.cells) {{final[type].push(cell[type])}}
    }
    return final;
}
