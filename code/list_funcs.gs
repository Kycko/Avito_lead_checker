/* 
при full_text=true и lower=false можно использовать .includes() или .indexOf() вместо этих функций
если full_text=false, возвращают ячейку, в которой только часть текста = txt
если lower=true, все строки будут сравниваться через .toLowerCase()

function LIST_check_all_values_equal_non_str(list, value) {
    // если ВСЕ значения списка = value, возвращает true, а иначе возвращает false
    for (let item of list) {
        if (item !== value) {return false}
    }
    return true;
}
 */

// проверки
function LIST_check_length_equal(list_of_lists) {
    let first_len = list_of_lists[0].length;
    for (let i=1; i < list_of_lists.length; i++) {
        if (list_of_lists[i].length !== first_len) {return false}
    }
    return true;
}
