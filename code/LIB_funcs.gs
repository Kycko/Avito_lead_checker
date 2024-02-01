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
function LIBinit(table, type, pinned) {
    if (type === 'columns') {return LIBinit_columns(table, pinned)}
}
function LIBinit_columns(table, pinned) {
    let final = {};
    let props = table[0].slice(1);      // props = properties
    table     = table   .slice(pinned);
    for (let row of table) {
        final[row[0]] = {}
        for (let i=0; i < props.length; i++) {
            let value = row[i+1];
            if      (['mandatory', 'text_wrapping'].includes(props[i])) {value = value === 'да'}
            else if (['max_width', 'highlight_red'].includes(props[i])) {
                if (value === 'нет') {value = null}
                else                 {value = Number(value)}
            }
            final[row[0]][props[i]] = value;
        }

    }
    return final;
}
