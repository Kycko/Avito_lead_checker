// основные
function MM_launch_all(R=Ginit_R()) {MM_sub_main('launch_all', null, R)}

// служебные функции
function MM_sub_main(type, range=null, R=Ginit_R(), toTD=true, only_blank=false) {
    // toTD – преобразовать прочитанное в table-dict
    if (range) {range = SH_get_active_range()}          // запоминаем range, если передан range=true
    R = SH_get_all_sheets_data(R, type, range, toTD);   // читаем все данные

    // запускаем основной алгоритм
    if (checker === 'launch_all') {checker = 'empty_req'}   // только для launch_all
    if (LIB_ready(R.NA_libs, checker)) {
        if      (type === 'launch_all')         {R         = SPEC_launch_all    (R)}
        else if (type === 'check_column_names') {R         = SPEC_check_titles  (R)}
        else if (type === 'rm_empty_RC')        {R.unknown = TD_rm_empty_RC     (R.unknown)}
        else                                    {R.table   = SPEC_check_UD_range(R.table, type, R).table}

        // записываем итог
        MM_set_values(R, range);
    }
}
