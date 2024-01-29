// базовые функции
function SH_get_full_range(sheet) {
    return sheet.getRange(1, 1, sheet.getMaxRows(), sheet.getMaxColumns());
}
function SH_get_active_range(cur_sheet=null) {
    if (cur_sheet === null) {cur_sheet = SpreadsheetApp.getActiveSheet()}
    return cur_sheet.getActiveRange();
}

// чтение таблиц
function SH_get_all_sheets_data(R, type, range, toTD) {
    // функцию можно использовать в т. ч. чтобы прочитать только R.cur
    // при range=null загружаем весь лист, иначе передаём объект range текущего листа
    if (!Object.keys(R).includes('cur')) {R = SH_get_cur_sheet_data(R, range, toTD)}

    let req_sheets = Greq_sheets(type);
    for (let item of req_sheets.sheets) {
        if (!Object.keys(R).includes(item)) {R = SH_get_lib_sheet_data(R, item)}
    }
    if (R.NA_libs.length) {UI_no_sheets_msg(R.NA_libs, req_sheets.error)}

    return R;
}
function SH_get_cur_sheet_data(R, range, toTD) {
    R.cur = Ginit_Rcur();
    if (range === null) {
        R.cur.sheet = SpreadsheetApp.getActiveSheet();
        range       = SH_get_full_range (R.cur.sheet);
    }

    R.cur.init.table     = SH_get_values(range);
    R.cur.init.bg_colors = range.getBackgrounds();
    R.cur.init.title     = TBL_search_title_row(R.table);
    R.cur.init.size      = {rows    : R.table   .length,
                            columns : R.table[0].length}

    if (toTD) {R.unknown = SPEC_transform_cur_sheet_data(R)}
    else           {R.table   = SPEC_transform_range_data    (R)}

    return R;
}
function SH_get_values(range) {
    range.breakApart();
    range.setNumberFormat('@STRING@');
    return TBL_toStrings(range.getValues());
}
