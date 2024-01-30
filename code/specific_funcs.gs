// функции SPEC предназначены для очень узкоспециализированных задач, В ОСНОВНОМ ДЛЯ ОБРАБОТКИ RV.CUR

// преобразование таблиц в словари
function SPEC_cur_toTD(RVcur) {
    let Tobj = RVcur.TBL.cur;    // Tobj = table object
    Tobj.table     = TBL_rotate(Tobj.table    .slice(Tobj.title));
    Tobj.bg_colors = TBL_rotate(Tobj.bg_colors.slice(Tobj.title));
    for (let r=0; r < Tobj.table.length; r++) {
        RVcur.TD.unk[r] = TC_init_from_lists({value: Tobj.table[r], bg_color: Tobj.bg_colors[r]});
        RVcur.TD.unk[r].init_pos = r;
    }
}
