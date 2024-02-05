// функции SPEC предназначены для очень узкоспециализированных задач, В ОСНОВНОМ ДЛЯ ОБРАБОТКИ RV.CUR

// общие
function SPEC_check_UDrange(objTable, type, RV, justVerify=false) {
    // objTable = таблица[[{value:x, bgColor:y, note:z},...],...]
    // errors   = список[{value:x, r:row, c:col, fixed:true/false}]
    let errors = [];

    // autocorr и запись всех ошибок
    for (let r=0; r < objTable.length; r++) {
        for (let c=0; c < objTable[0].length; c++) {
            let tempValue = objTable[r][c].value;

            if (!justVerify) {tempValue = SPECautocorr(RV, type, tempValue)}

            if (SPEC_validate_UD(RV, type, tempValue)) {
                objTable[r][c].value    = tempValue;
                objTable[r][c].bg_color = Gcolors().hl_light_green;
                errors[r].push(null);
            }
            else {errors[r].push({value: objTable[r][c].value, fixed: false})}
        }
    }

    // предложение исправить вручную и запись исправлений
    errors    = SPEC_ask_SD_and_sugg(RV, errors, type);
    objTable = SPEC_finalize_errors(objTable,  errors);

    return {SD: RV.SD, table: objTable};
}

// обработка столбцов
function SPEC_unk_toCur_onRead(RV) {
    let Tobjects = [];  // title objects
    for (let TC of RV.cur.TD.unk) {Tobjects.push(TC.title)}

    let result = SPEC_check_UDrange([Tobjects], 'colTitle', RV, true);
    RV.SD    = result.SD;
    for (let i=0; i < keys.length; i++) {
        RV.unknown[keys[i]].title = result.table[0][i];
        if (result.table[0][i].bg_color === Gcolors().hl_light_green) {RV = SPEC_accept_valid_column(RV, keys[i])}
    }
}

// работа с ошибками
function SPECautocorr(RV, type, from) {
    if (type === 'region') {
        // сперва в autocorr без изменений, и, если не будет найдено, ещё раз после изменений
        let ACobj = LIB_getAutocorr(RV.autocorr, type, from);
        if (ACobj.fixed) {return ACobj.value}
        else             {from = STR_autocorr_city(RV, from)}
    }
    return LIB_getAutocorr(RV.autocorr, type, from).value;
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
    for (let key of order)         {SPEC_add_TClists(RV.cur.TD.main[key], final, types)}
    for (let col of RV.cur.TD.unk) {SPEC_add_TClists(col,                 final, types)}

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
function SPEC_add_TClists(TC, addTo, types) {
    let columns = TC_toList(TC, types);
    for (let type of types) {addTo[type].push(columns[type])}
}
