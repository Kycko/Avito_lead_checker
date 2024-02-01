// CO = cell object, COl = cell_object list[], COt = cell_object table[[]]

// создание объектов
function COinit() {return {value: '', bgColor: null, note: null, error: false}}
function COl_fromLists(lists_dict) {
    // lists_dict – словарь {value:[], bgColor:[], note:[]}; можно передавать без любых ключей
    let final = [];
    let  keys = Object.keys(lists_dict);
    for (let i=0; i < lists_dict[keys[0]].length; i++) {
        final.push(COinit());
        for (let key of keys) {final[i][key] = lists_dict[key][i]}
    }
    return final;
}
function COt_fromTables(tables) {
    // tables – словарь {value:[[]], bgColor:[[]], note:[[]]}; можно передавать без любых ключей
    let final = [];
    let  keys = Object.keys(tables);
    for (let r=0; r < tables[keys[0]].length; r++) {
        let row_dict = {};
        for (let key of keys) {row_dict[key] = tables[key][r]}
        final.push(COl_fromLists(row_dict));
    }
    return final;
}
