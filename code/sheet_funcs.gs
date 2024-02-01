// базовые функции
function SH_get_full_range(sheet) {
    return sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
}
function SH_get_active_range(ss, cur_sheet=null) {
    if (cur_sheet === null) {cur_sheet = ss.getActiveSheet()}
    return cur_sheet.getActiveRange();
}

// чтение таблиц
function SH_read_all(RV, type, range, toTD) {
    // функцию можно использовать в т. ч. чтобы прочитать только RV.cur
    // при range=null загружаем весь лист, иначе передаём объект range текущего листа
    if (!Object.keys(RV).includes('cur')) {SH_read_cur(RV, range, toTD)}

    let req_sheets = Greq_sheets(type);
    for (let item of req_sheets.sheets) {
        if (!Object.keys(RV).includes(item)) {SH_read_lib_sheet(RV, item)}
    }
    if (RV.NA_libs.length) {UI_no_sheets_msg(RV.NA_libs, req_sheets.error)}
}
function SH_read_cur(RV, range, toTD) {
    RV.cur = Ginit_RVcur();
    if (range === null) {
        RV.cur.sheet = SpreadsheetApp.getActiveSheet();
        range        = SH_get_full_range(RV.cur.sheet);
    }
    SH_read_init_tables(RV.cur.TBL, range);

    if (toTD) {SPEC_cur_toTD(RV.cur)}
    else {
        let  init = RV.cur.TBL.init;
        RV.cur.CT = COt_from_tables({value: init.table, bg_color: init.bg_colors});
    }
}
function SH_read_init_tables(TBL, range) {
    TBL.init.table     = SH_get_values(range);
    TBL.init.bg_colors = range.getBackgrounds();
    TBL.init.title     = TBL_search_title_row(TBL.init.table);
    TBL.init.size      = {rows : TBL.init.table   .length,
                          cols : TBL.init.table[0].length}

    SPEC_copy_TBL_init_to_cur(TBL);
}
function SH_get_values(range) {
    range.breakApart();
    range.setNumberFormat('@STRING@');
    let table = range.getValues();
    TBL_toStrings(table);
    return table;
}
