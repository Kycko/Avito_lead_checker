// поиск
function STR_find_subList(string, list, type='index', fullText=false, lower=true) {
    // ищет в строке каждый элемент списка; type может быть 'index', 'bool' и 'item'
    // индекс – это позиция найденного в string
    // 'item' вернёт найденный элемент списка list
    for (let item of list) {
        const result = STR_findSub(string, item, 'index', fullText, lower);
        if (result >= 0) {
            if (type === 'item') {return item}
            else                 {return get_IB(type, result)}
        }
    }

    if (type === 'item') {return null}
    else                 {return get_IB(type, -1)}
}
function STR_findSub(string, sub, type='index', fullText=false, lower=true) {
    // если fullText=true, проверяется равенство строк (но после .trim() + можно задать lower=true)
    // если lower=true, все строки будут сравниваться через .toLowerCase()
    string = string.trim();
    sub    = sub   .trim();
    if (fullText && string.length !== sub.length) {return get_IB(type, -1)}
    if (lower) {
        string = string.toLowerCase();
        sub    = sub   .toLowerCase();
    }
    return get_IB(type, string.indexOf(sub));
}
