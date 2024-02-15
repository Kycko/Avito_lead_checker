// основные
function MM_launchAll(RV=Ginit_RV()) {MMsub_main('launchAll', null, RV)}

// служебные функции
function MMsub_main(type, range=null, RV=Ginit_RV(), toTD=true, onlyBlank=false) {
    // toTD – преобразовать прочитанное в table-dict
    if (range) {range = SH_get_activeRange()}   // запоминаем range, если передан range=true
    if (SH_readAll(RV, type, range, toTD)) {
        // запускаем основной алгоритм
        // if (type === 'launchAll') {RV = SPEC_launchAll(RV)}

        // записываем итог
        SH_writeCur(RV, range, toTD);
        if (RV.cur.vertChanged) {UI_toast_fromSL(RV.GTO.ss, 'vertChanged', 12)}
    }
}
