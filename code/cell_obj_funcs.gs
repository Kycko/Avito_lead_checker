// CO = cell object {value:val, bg_color:color, note:note}, они складываются в списки[] и таблицы [[]]

// создание объектов
function CO_init_from_lists(lists_dict) {
    // lists_dict – словарь {value:[], bg_color:[], note:[]}; можно передавать без любых ключей
    let final = [];
    let  keys = Object.keys(lists_dict);
    for (let i=0; i < lists_dict[keys[0]].length; i++) {
        final.push({value: '', bg_color: null, note: null});
        for (let key of keys) {final[i][key] = lists_dict[key][i]}
    }
    return final;
}
