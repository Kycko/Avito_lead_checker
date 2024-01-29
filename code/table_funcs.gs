// получение свойств
function TBL_get_full_range(table) {
    return {
        r: 0, c: 0,
        h: table.length, w: table[0].length
    }
}

// преобразование всей таблицы
function TBL_toStrings(table, range=null) {
    // переводит все ячейки в .toString(), делает .trim() и удаляет плохие символы (напр., мягкие пробелы)
    // при range=null обрабатывает всю таблицу, иначе надо передать словарь {r, c, h, w}
    if (range === null) {range = TBL_get_full_range(table)}
    for (let r=range.r; r < range.r+range.h; r++) {
        for (let c=range.c; c < range.c+range.w; c++) {
            table[r][c] = table[r][c].toString().trim().replaceAll('​', '');
        }
    }
    return table;
}
