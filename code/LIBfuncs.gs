// все функции, связанные с библиотеками (листами [script])

// общие
function LIB_filter_toRead(RVlibs, toRead) {
    let   final = [];
    let curLibs = Object.keys(RVlibs);
    for (let lib of toRead) {
        if (!curLibs.includes(lib) && !RVlibs.NSF.includes(lib)) {final.push(lib)}
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
function LIBvlookup_multi(lib, request, searchCol, resultCol, fullText=true, lower=true, rmDoubles=true) {
    // request может быть одной строкой либо списком
    let final = [];
    if (typeof request === 'string') {request = [request]}

    for (let item of request) {
        let indexes = LIST_searchItems(lib[searchCol], item, 'index', fullText, lower);
        for (let i of indexes) {
            if (!rmDoubles || !LIST_inclStr(final, lib[resultCol][i], fullText, lower)) {
                final.push(lib[resultCol][i]);
            }
        }
    }
    return final;
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

    if (NAkeys.length) {LOG('ACsugg_noKey', {keys: NAkeys, sheet: Gsheets()[type]})}
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
function LIB_get_validationList(RVlibs, type) {
    if      (type === 'colTitle') {return RVlibs.columns.colTitle}
    else if (type === 'region')   {return RVlibs.regions.city}
    else if (type === 'cat')      {return RVlibs.cat    .cat}
    else if (type === 'source')   {return RVlibs.sources}
}
function LIB_getSugg(RVlibs, type, value) {
    let final = [];
    for (let libKey of ['sugg', 'autocorr']) {
        for (let from of Object.keys(RVlibs[libKey][type])) {
            if (STR_findSub(value, from, 'bool')) {final = final.concat(RVlibs[libKey][type][from])}
        }
    }
    return LIST_rmDoubles(final);
}
function LIB_tryCity(RVlibs, city) {
    let  ACcities = Object.keys (RVlibs.autocorr.region);   // имеющиеся варианты автозамены
    let    check1 = LIST_inclStr(RVlibs.regions.city, city);
    let    check2 = LIST_inclStr(ACcities, city.toLowerCase(), true, false);
    return check1 || check2;
}
