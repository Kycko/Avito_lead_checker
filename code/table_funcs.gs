// получение свойств
function TBL_get_full_range(table) {
    return {
        r: 0, c: 0,
        h: table.length, w: table[0].length
    }
}
function TBL_search_title_row(table) {
    for (let r=0; r < table.length; r++) {
        if (STR_find_sub_list(table[r][0], ['Уникальных: ', 'Ошибок: ']) !== 0) {return r}
    }
    return 0;
}

// преобразование всей таблицы
function TBLrotate(old) {
    let rotated = [];
    for (let cell of old[0]) {rotated.push([])}
    for (let r=0; r < old.length; r++) {
        for (let c=0; c < old[r].length; c++) {
            rotated[c].push(old[r][c]);
        }
    }
    return rotated;
}
function TBL_toStrings(table, range=null) {
    // переводит все ячейки в .toString(), делает .trim() и удаляет плохие символы (напр., мягкие пробелы)
    // при range=null обрабатывает всю таблицу, иначе надо передать словарь {r, c, h, w}
    if (range === null) {range = TBL_get_full_range(table)}
    for (let r=range.r; r < range.r+range.h; r++) {
        for (let c=range.c; c < range.c+range.w; c++) {
            table[r][c] = table[r][c].toString().trim().replaceAll('​', '');
        }
    }
}
