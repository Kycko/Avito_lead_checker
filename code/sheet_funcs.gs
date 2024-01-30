// базовые функции
function SH_get_full_range(sheet) {
    return sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
}
function SH_get_active_range(cur_sheet=null) {
    if (cur_sheet === null) {cur_sheet = SpreadsheetApp.getActiveSheet()}
    return cur_sheet.getActiveRange();
}

// чтение таблиц
function SH_read_all_sheets_data(RV, type, range, toTD) {
    // функцию можно использовать в т. ч. чтобы прочитать только RV.cur
    // при range=null загружаем весь лист, иначе передаём объект range текущего листа
    if (!Object.keys(RV).includes('cur')) {SH_read_cur_sheet(RV, range, toTD)}

    let req_sheets = Greq_sheets(type);
    for (let item of req_sheets.sheets) {
        if (!Object.keys(RV).includes(item)) {SH_read_lib_sheet(RV, item)}
    }
    if (RV.NA_libs.length) {UI_no_sheets_msg(RV.NA_libs, req_sheets.error)}
}
function SH_read_cur_sheet(RV, range, toTD) {
    RV.cur = Ginit_RVcur();
    if (range === null) {
        RV.cur.sheet = SpreadsheetApp.getActiveSheet();
        range        = SH_get_full_range(RV.cur.sheet);
    }
    SH_read_init_tables(RV.cur.TBL, range);

    if (toTD) {SPEC_cur_toTD  (RV.cur)}
    else      {SPEC_range_toTD(RV)}
}
function SH_read_init_tables(TBL, range) {
    TBL.init.table     = SH_get_values(range);
    TBL.init.bg_colors = range.getBackgrounds();
    TBL.init.title     = TBL_search_title_row(TBL.init.table);
    for (let key of Object.keys(TBL.init)) {TBL.cur[key] = TBL.init[key]}   // deep copy без взаимосвязи

    // в cur размер не нужен, т. к. он может меняться
    TBL.init.size = {rows : TBL.init.table   .length,
                     cols : TBL.init.table[0].length}
}
function SH_get_values(range) {
    range.breakApart();
    range.setNumberFormat('@STRING@');
    let table = range.getValues();
    TBL_toStrings(table);
    return table;
}
