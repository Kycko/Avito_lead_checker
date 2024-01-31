// CO = cell object, COl = cell_object list[], COt = cell_object table[[]]

// создание объектов
function COinit() {return {value: '', bg_color: null, note: null, error: false}}
function COl_from_lists(lists_dict) {
    // lists_dict – словарь {value:[], bg_color:[], note:[]}; можно передавать без любых ключей
    let final = [];
    let  keys = Object.keys(lists_dict);
    for (let i=0; i < lists_dict[keys[0]].length; i++) {
        final.push(COinit());
        for (let key of keys) {final[i][key] = lists_dict[key][i]}
    }
    return final;
}
function COt_from_tables(tables) {
    // tables – словарь {value:[[]], bg_color:[[]], note:[[]]}; можно передавать без любых ключей
    let final = [];
    let  keys = Object.keys(tables);
    for (let r=0; r < tables[keys[0]].length; r++) {
        let row_dict = {};
        for (let key of keys) {row_dict[key] = tables[key][r]}
        final.push(COl_from_lists(row_dict));
    }
    return final;
}
