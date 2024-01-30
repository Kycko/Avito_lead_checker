// основные
function MM_launch_all(RV=Ginit_RV()) {MM_sub_main('launch_all', null, RV)}

// служебные функции
function MM_sub_main(type, range=null, RV=Ginit_RV(), toTD=true, only_blank=false) {
    // toTD – преобразовать прочитанное в table-dict
    if (range) {range = SH_get_active_range()}  // запоминаем range, если передан range=true
    SH_read_all(RV, type, range, toTD);         // читаем все данные

    // запускаем основной алгоритм
    if (checker === 'launch_all') {checker = 'empty_req'}   // только для launch_all
    if (LIB_ready(RV.NA_libs, checker)) {
        if      (type === 'launch_all')         {RV         = SPEC_launch_all    (RV)}
        else if (type === 'check_column_names') {RV         = SPEC_check_titles  (RV)}
        else if (type === 'rm_empty_RC')        {RV.unknown = TD_rm_empty_RC     (RV.unknown)}
        else                                    {RV.table   = SPEC_check_UD_range(RV.table, type, RV).table}

        // записываем итог
        MM_set_values(RV, range);
    }
}
