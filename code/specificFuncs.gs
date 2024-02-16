// функции SPEC предназначены для очень узкоспециализированных задач, В ОСНОВНОМ ДЛЯ ОБРАБОТКИ RV.CUR

// общие
function SPEC_check_UDrange(objTable, type, RV, justVerify=false) {
    // objTable = таблица[[{value:x, bgColor:y, note:z, error:false},...],...]
    let errors = {};    // внутри ключи initValue:{fixed:t/f, newVal:null, pos:[{r:row, c:col},...]}

    // autocorr и запись всех ошибок
    for (let r=0; r < objTable.length; r++) {
        for (let c=0; c < objTable[0].length; c++) {
            let    cell = objTable[r][c];
            let tempVal = cell.value;
            if (!justVerify) {tempVal = SPECautocorr(RV.libs, type, tempVal)}

            let Vobj = SPECvalidate_andCapitalize(RV.libs, type, tempVal, justVerify);
            if (Vobj.valid) {
                cell.value   = Vobj.value;
                cell.bgColor = Gcolors().hl_lightGreen;
            }
            else {
                if (Object.keys(errors).includes(cell.value)) {errors[cell.value].pos.push({r:r, c:c})}
                else                                          {errors[cell.value] = GinitError(r, c)}
            }
        }
    }

    // предложение исправить вручную и запись исправлений
    if (RV.SD !== false) {SPEC_askSD_andSugg(RV, errors, type)}
    SPEC_finalize_errors(objTable,  errors);
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
function SPECautocorr(RVlibs, type, from) {
    if (type === 'region') {
        // сперва в autocorr без изменений, и, если не будет найдено, ещё раз после изменений
        let ACobj = LIB_getAutocorr(RVlibs.autocorr, type, from);
        if (ACobj.fixed) {return ACobj.value}
        else             {from = STR_autocorrCity(RVlibs, from)}
    }
    return LIB_getAutocorr(RVlibs.autocorr, type, from).value;
}
function SPECvalidate_andCapitalize(RVlibs, type, value, justVerify=false, extra=null) {
    // в extra можно передать любые необходимые доп. данные
    let valObj = G_valTypes(type);
    if (valObj.readLib) {extra = LIB_get_validationList(RVlibs, type)}
    let final = {valid: null, value: value};

    if (valObj.checkList) {
        if (justVerify) {final.valid = LIST_inclStr(extra, value, true, false)}
        else {
            let found = LIST_searchItems(extra, value);
            final.valid = Boolean(found.length);
            if (final.valid) {final.value = found[0]}
        }
    }
    else {null} // пока не используется, потом дописать

    return final;
}
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
