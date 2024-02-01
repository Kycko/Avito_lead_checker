// функции SPEC предназначены для очень узкоспециализированных задач, В ОСНОВНОМ ДЛЯ ОБРАБОТКИ RV.CUR

// обработка столбцов
function SPEC_accept_loaded_titles(RVcurTD) {
    for (let key of Object.keys(RVcurTD.unk)) {
        RVcurTD.unk[key].title.value
    }
}

// преобразование данных из Google-таблиц
function SPEC_cur_toTD(RVcur) {
    let Tobj = RVcur.TBL.cur;    // Tobj = table object
    Tobj.table     = TBL_rotate(Tobj.table    .slice(Tobj.title));
    Tobj.bg_colors = TBL_rotate(Tobj.bg_colors.slice(Tobj.title));
    for (let r=0; r < Tobj.table.length; r++) {
        RVcur.TD.unk[r] = TC_init_from_lists({value: Tobj.table[r], bg_color: Tobj.bg_colors[r]});
        RVcur.TD.unk[r].init_pos = r;
    }
}
function SPEC_copy_TBL_init_toCur(TBL) {
    // восстанавливает RV.cur.TBL.cur из RV.cur.TBL.init
    // deep copy без взаимосвязи; size не нужен, т. к. TBL.cur можно изменять
    for (let key of Object.keys(TBL.init)) {
        if (key !== 'size') {TBL.cur[key] = TBL.init[key]}
    }
}
