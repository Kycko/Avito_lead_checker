// базовые функции
function SH_get_fullRange(sheet) {
    return sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
}
function SH_get_activeRange(ss, cur_sheet=null) {
    if (cur_sheet === null) {cur_sheet = ss.getActiveSheet()}
    return cur_sheet.getActiveRange();
}

// чтение таблиц
function SH_readAll(RV, type, range, toTD) {
    // функцию можно использовать в т. ч. чтобы прочитать только RV.cur
    // при range=null загружаем весь лист, иначе передаём объект range текущего листа

    // библиотеки
    let NAsheets = [];
    let  typeObj = Gtypes(type);
    let   toRead = LIB_filter_toRead(RV.libs, typeObj.readSheets);
    for (let lib of toRead) {
        SH_readLib(RV, lib);
        if (RV.libs.NSF.includes(lib)) {NAsheets.push(Gsheets(lib))}
    }
    if (NAsheets.length) {UI_noSheets_msg(RV.GTO.ui, NAsheets, typeObj.noSheets_title)}

    // активный лист
    if (!Object.keys(RV).includes('cur')) {SH_readCur(RV, range, toTD)}
}
function SH_readLib(RV, type) {
    let sheet = RV.GTO.ss.getSheetByName(Gsheets(type));
    if (sheet === null) {RV.libs.NSF.push(type)}
    else {
        let table = SH_getValues(SH_get_fullRange(sheet));
        LIBinit(RV.libs, table, type, sheet.getFrozenRows());
    }
}
function SH_readCur(RV, range, toTD) {
    RV.cur = Ginit_RVcur(RV.GTO.ss);
    if (range === null) {range = SH_get_fullRange(RV.cur.sheet)}
    SH_read_initTables(RV.cur.TBL, range);

    if (toTD) {SPEC_cur_toTD(RV.cur)}
    else {
        let  init = RV.cur.TBL.init;
        RV.cur.CT = COt_fromTables({value: init.table, bgColor: init.bgColors});
    }
}
function SH_read_initTables(TBL, range) {
    TBL.init.table    = SH_getValues(range);
    TBL.init.bgColors = range.getBackgrounds();
    TBL.init.title    = TBL_search_title_row(TBL.init.table);
    TBL.init.size     = {rows : TBL.init.table   .length,
                         cols : TBL.init.table[0].length}

    SPEC_copy_TBL_init_toCur(TBL);
}
function SH_getValues(range) {
    range.breakApart();
    range.setNumberFormat('@STRING@');
    let table = range.getValues();
    TBL_toStrings(table);
    return table;
}

// запись в таблицы
function SH_writeCur(RV, range=null, fromTD, types=['value', 'bgColor', 'note']) {
    if (fromTD) {var tables = SPEC_get_mergedTables(RV, types)}
    else        {var tables = COt_toTables  (RV.cur.CT, types)}
    if (range === null) {
        let any_table = Object.values(tables)[0];
        let      size = {rows : any_table   .length,
                         cols : any_table[0].length}
        SH_fitSize(RV, size);
        range = RV.cur.sheet.getRange(1, 1, size.rows, size.cols);
    }

    for (let type of types) {
        if      (type === 'value')   {SH_set_rangeValues(tables[type], range)}
        else if (type === 'bgColor') {SH_hlCells        (tables[type], range)}
        else if (type === 'note')    {SH_setNotes       (tables[type], range)}
    }
}
function SH_set_rangeValues(table, range) {range.setValues(table)}

// форматирование (стиль) таблиц
function SH_fitSize(RV, newSize) {
    let initial = RV.cur.TBL.init.size;

    // rows
    let diff = newSize.rows - initial.rows;
    if      (diff > 0) {RV.cur.sheet.insertRowsAfter(initial.rows,    diff)}
    else if (diff < 0) {RV.cur.sheet.deleteRows     (newSize.rows+1, -diff)}

    // columns
    diff = newSize.cols - initial.cols;
    if      (diff > 0) {RV.cur.sheet.insertColumnsAfter(initial.cols,    diff)}
    else if (diff < 0) {RV.cur.sheet.deleteColumns     (newSize.cols+1, -diff)}
}
function SH_hlCells (colorTable, range) {range.setBackgrounds(colorTable)}
function SH_setNotes(notesTable, range) {range.setNotes      (notesTable)}
