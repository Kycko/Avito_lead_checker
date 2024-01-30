// функции SPEC предназначены для очень узкоспециализированных задач, В ОСНОВНОМ ДЛЯ ОБРАБОТКИ DATA.CUR

// преобразование таблиц в словари
function SPEC_cur_toTD(Rcur) {
    let table_obj = Rcur.TBL.cur;
    table_obj.table     = TBL_rotate(table_obj.table    .slice(table_obj.title));
    table_obj.bg_colors = TBL_rotate(table_obj.bg_colors.slice(table_obj.title));
    for (let r=0; r < table_obj.table.length; r++) {
        Rcur.TD.unk[r] = TC_init_from_lists(Rcur.table[r], Rcur.bg_colors[r]);
        Rcur.TD.unk[r].init_pos = r;
    }
}
