// все функции, связанные с библиотеками (листами [script])

// общие
function LIB_filter_toRead(RVlibs, toRead) {
    let    final = [];
    let cur_libs = Object.keys(RVlibs);
    for (let lib of toRead) {
        if (!cur_libs.includes(lib) && !RVlibs.NSF.includes(lib)) {final.push(lib)}
    }
    return final;
}
function LIBready(RVlibs, reqs) {
    // возвращает true только если все библиотеки прочитаны и доступны
    let cur_libs = Object.keys(RVlibs);
    for (let lib of reqs) {
        if (!cur_libs.includes(lib)) {return false}
    }
    return true;
}

// создание
function LIBinit(RVlibs, table, type, pinned) {
    if      (type === 'columns')                  {RVlibs[type] = LIBinit_columns  (table, pinned)}
    else if (type === 'sources')                  {RVlibs[type] = LIBinit_list     (table, pinned)}
    else if (type === 'logCat')                   {RVlibs[type] = LIBinit_key_value(table, pinned)}
    else if (['autocorr', 'sugg'].includes(type)) {RVlibs[type] = LIBinit_AC_sugg  (table, pinned, type)}
    else if (['regions',  'cat'] .includes(type)) {
        RVlibs[type] = LIBinit_default(table, pinned);
        if (type === 'regions') {RVlibs.regList = RVlibs.regList.concat(LIST_rmDoubles(RVlibs[type].region))}
    }

}
function LIBinit_default(table, pinned) {
    table     = TBLrotate(table);
    let final = {};
    for (let row of table) {final[row[0]] = row.slice(pinned)}
    return final;
}
function LIBinit_key_value(table, pinned) {
    // для библиотек с двумя столбцами key и value
    let final = {};
    for (let row of table.slice(pinned)) {final[row[0]] = row[1]}
    return final;
}
function LIBinit_list   (table, pinned) {return TBLrotate(table.slice(pinned))[0]}
function LIBinit_AC_sugg(table, pinned, type) {
    let  keysObj = Gkeys_AC_sugg();
    let strTypes = Object.keys(keysObj);
    let   NAkeys = [];
    let    final = {};

    for (let row of table.slice(pinned)) {
        if (strTypes.includes(row[0])) {
            let libKey = keysObj[row[0]];
            row[1]     = row[1].toLowerCase();
            if (!Object.keys(final).includes(libKey)) {final[libKey] = {}}

            if (type === 'autocorr') {final[libKey][row[1]] = row[2]}
            else {
                if (Object.keys(final[libKey]).includes(row[1])) {final[libKey][row[1]].push(row[2])}
                else                                             {final[libKey][row[1]] =   [row[2]]}
            }
        }
        else if (!NAkeys.includes(row[0])) {NAkeys.push(row[0])}
    }

    if (NAkeys.length) {LOG('AC_sugg_noKey', {keys: NAkeys, sheet: Gsheets()[type]})}
    return final;
}
function LIBinit_columns(table, pinned) {
    let final = {};
    let props = table[0].slice(1);      // props = properties
    for (let row of table.slice(pinned)) {
        final[row[0]] = {}
        for (let i=0; i < props.length; i++) {
            let value = row[i+1];
            if     (['mandatory', 'textWrapping'].includes(props[i])) {value = value === 'да'}
            else if (['maxWidth', 'highlightRed'].includes(props[i])) {
                if (value === 'нет') {value = null}
                else                 {value = Number(value)}
            }
            final[row[0]][props[i]] = value;
        }

    }
    return final;
}

// исправление ошибок
function LIB_getAutocorr(AClib, type, value) {
    let lowValue = value.toLowerCase();
    if (LIST_inclStr(Object.keys(AClib[type]), lowValue, true, false)) {
        return {fixed: true, value: AClib[type][lowValue]}
    }
    else {return {fixed: false, value: value}}
}
