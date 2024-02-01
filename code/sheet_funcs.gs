// базовые функции
function SH_get_full_range(sheet) {
    return sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
}
function SH_get_active_range(ss, cur_sheet=null) {
    if (cur_sheet === null) {cur_sheet = ss.getActiveSheet()}
    return cur_sheet.getActiveRange();
}

// чтение таблиц
function SH_readAll(RV, type, range, toTD) {
    // функцию можно использовать в т. ч. чтобы прочитать только RV.cur
    // при range=null загружаем весь лист, иначе передаём объект range текущего листа

    // библиотеки
    let toRead = LIB_filter_toRead(RV.libs, Gtypes(type).read_sheets);
    for (let lib of toRead) {
        SH_readLib(RV, lib);
    }




    let req_sheets = Greq_sheets(type);
    for (let item of req_sheets.sheets) {
        if (!Object.keys(RV).includes(item)) {SH_read_lib_sheet(RV, item)}
    }
    if (RV.NA_libs.length) {UI_no_sheets_msg(RV.NA_libs, req_sheets.error)}

    // активный лист
    if (!Object.keys(RV).includes('cur')) {SH_readCur(RV, range, toTD)}
}
function SH_readLib(RV, type) {
    let sheet = RV.GTO.ss.getSheetByName(Gsheets(type));
    if (sheet === null) {RV.libs.NSF.push(type)}
    else {
        let     table = SH_getValues(SH_get_full_range(sheet));
        RV.libs[type] = LIBinit(table, type, sheet.getFrozenRows());
        if (type === 'regions') {RV.region_list = RV.region_list.concat(LIST_rm_doubles(RV[type].region))}
    }
}
function SH_readCur(RV, range, toTD) {
    RV.cur = Ginit_RVcur(RV.GTO.ss);
    if (range === null) {range = SH_get_full_range(RV.GTO.ss, RV.cur.sheet)}
    SH_read_init_tables(RV.cur.TBL, range);

    if (toTD) {SPEC_cur_toTD(RV.cur)}
    else {
        let  init = RV.cur.TBL.init;
        RV.cur.CT = COt_from_tables({value: init.table, bg_color: init.bg_colors});
    }
}
function SH_read_init_tables(TBL, range) {
    TBL.init.table     = SH_getValues(range);
    TBL.init.bg_colors = range.getBackgrounds();
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
