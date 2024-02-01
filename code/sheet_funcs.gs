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
    if (range === null) {range = SH_get_fullRange(RV.GTO.ss, RV.cur.sheet)}
    SH_read_initTables(RV.cur.TBL, range);

    if (toTD) {SPEC_cur_toTD(RV.cur)}
    else {
        let  init = RV.cur.TBL.init;
        RV.cur.CT = COt_fromTables({value: init.table, bgColor: init.bgColors});
    }
}
function SH_read_initTables(TBL, range) {
    TBL.init.table     = SH_getValues(range);
    TBL.init.bgColors = range.getBackgrounds();
    TBL.init.title     = TBL_search_title_row(TBL.init.table);
    TBL.init.size      = {rows : TBL.init.table   .length,
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
