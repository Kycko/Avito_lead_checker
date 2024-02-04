// основные
function MM_launchAll(RV=Ginit_RV()) {MMsub_main('launchAll', null, RV)}

// служебные функции
function MMsub_main(type, range=null, RV=Ginit_RV(), toTD=true, onlyBlank=false) {
    // toTD – преобразовать прочитанное в table-dict
    if (range) {range = SH_get_activeRange()}   // запоминаем range, если передан range=true
    if (SH_readAll(RV, type, range, toTD)) {
        // записываем итог
        SH_writeCur(RV, range, toTD);
        if (RV.cur.vertChanged) {UI_toast_fromSL(RV.GTO.ss, 'vertChanged', 12)}
    }

/* 
    // запускаем основной алгоритм
    if (checker === 'launchAll') {checker = 'empty_req'}   // только для launchAll
    if (LIB_ready(RV.NA_libs, checker)) {
        if      (type === 'launchAll')         {RV         = SPEC_launchAll    (RV)}
        else if (type === 'check_column_names') {RV         = SPEC_check_titles  (RV)}
        else if (type === 'rm_empty_RC')        {RV.unknown = TD_rm_empty_RC     (RV.unknown)}
        else                                    {RV.table   = SPEC_check_UD_range(RV.table, type, RV).table}
    }
    */
}
