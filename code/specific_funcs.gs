// функции SPEC предназначены для очень узкоспециализированных задач, В ОСНОВНОМ ДЛЯ ОБРАБОТКИ RV.CUR

// обработка столбцов
function SPEC_accept_loaded_titles(RVcurTD) {
    for (let col of RVcurTD.unk) {
        col.title.value
    }
}

// преобразование данных из Google-таблиц
function SPEC_cur_toTD(RVcur) {
    let      Tobj = RVcur.TBL.cur;  // Tobj = table object
    Tobj.table    = TBLrotate(Tobj.table   .slice(Tobj.title));
    Tobj.bgColors = TBLrotate(Tobj.bgColors.slice(Tobj.title));
    for (let r=0; r < Tobj.table.length; r++) {
        RVcur.TD.unk[r] = TCinit_fromLists({value: Tobj.table[r], bgColor: Tobj.bgColors[r]});
        RVcur.TD.unk[r].initPos = r;
    }
}
function SPEC_copy_TBL_init_toCur(TBL) {
    // восстанавливает RV.cur.TBL.cur из RV.cur.TBL.init
    // deep copy без взаимосвязи; size не нужен, т. к. TBL.cur можно изменять
    for (let key of Object.keys(TBL.init)) {
        if (key !== 'size') {TBL.cur[key] = TBL.init[key]}
    }
}

// объединение TD.main и TD.unk + преобразование TD в таблицы для записи на лист
function SPEC_get_mergedTables(RV, types=['value', 'bgColor', 'note']) {
    let order = Object.keys(RV.cur.TD.main);
    if (order.length) {order = SPEC_columnsOrder(RV.libs.columns, order)}
    let final = {};
    for (let type of types) {final[type] = []}

    // обработка TD.main и TD.unk
    for (let key of order)         {SPECadd_TClists(RV.cur.TD.main[key], final, types)}
    for (let col of RV.cur.TD.unk) {SPECadd_TClists(col,                 final, types)}

    for (let type of types) {final[type] = TBLrotate(final[type])}
    return final;
}
function SPEC_columnsOrder(libColumns, mainKeys) {
    let final = [];
    for (let key of Object.keys(libColumns)) {
        if (mainKeys.includes(key)) {final.push(key)}
    }
    return final;
}
function SPECadd_TClists(TC, addTo, types) {
    let columns = TC_toList(TC, types);
    for (let type of types) {addTo[type].push(columns[type])}
}
