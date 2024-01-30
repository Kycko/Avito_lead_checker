// поиск
function STR_find_sub_list(string, list, type='index', full_text=false, lower=true) {
    // ищет в строке каждый элемент списка; type может быть 'index', 'bool' и 'item'
    // индекс – это позиция найденного в string
    // 'item' вернёт найденный элемент списка list
    for (let item of list) {
        const result = STR_find_sub(string, item, 'index', full_text, lower);
        if (result >= 0) {
            if (type === 'item') {return item}
            else                 {return get_IB(type, result)}
        }
    }

    if (type === 'item') {return null}
    else                 {return get_IB(type, -1)}
}
function STR_find_sub(string, sub, type='index', full_text=false, lower=true) {
    // если full_text=true, проверяется равенство строк (но после .trim() + можно задать lower=true)
    // если lower=true, все строки будут сравниваться через .toLowerCase()
    string = string.trim();
    sub    = sub   .trim();
    if (full_text && string.length !== sub.length) {return get_IB(type, -1)}
    if (lower) {
        string = string.toLowerCase();
        sub    = sub   .toLowerCase();
    }
    return get_IB(type, string.indexOf(sub));
}
