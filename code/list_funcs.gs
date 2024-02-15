/* 
при fullText=true и lower=false можно использовать .includes() или .indexOf() вместо этих функций
если fullText=false, возвращают ячейку, в которой только часть текста = txt
если lower=true, все строки будут сравниваться через .toLowerCase()

function LIST_check_all_values_equal_non_str(list, value) {
    // если ВСЕ значения списка = value, возвращает true, а иначе возвращает false
    for (let item of list) {
        if (item !== value) {return false}
    }
    return true;
}
 */

// поиск
function LIST_indxAny_from_strList(rootList, searchList, fullText=true, lower=true) {
    // если в первом списке есть хотя бы один элемент второго списка, вернёт index из первого списка
    for (let i=0; i < rootList.length; i++) {
        if (LIST_inclStr(searchList, rootList[i], fullText, lower)) {return i}
    }
    return -1;
}
function LIST_inclStr(list, txt, fullText=true, lower=true) {
    for (let item of list) {
        if (STR_findSub(item, txt, 'bool', fullText, lower)) {return true}
    }
    return false;
}

// проверки
function LIST_check_lengthEqual(list_ofLists) {
    let firstLen = list_ofLists[0].length;
    for (let i=1; i < list_ofLists.length; i++) {
        if (list_ofLists[i].length !== firstLen) {return false}
    }
    return true;
}

// получение свойств
function LIST_lastIndx(list) {
    if (list.length) {return list.length-1}
    else             {return null}  // это пока не использовал, можно заменить на возврат 0 и т. п.
}

// изменение
function LIST_rmDoubles(oldList) {
    let newList = [];
    for (let item of oldList) {
        if (!newList.includes(item)) {newList.push(item)}
    }
    return newList;
}
