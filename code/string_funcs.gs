// поиск
function STR_find_subList(string, list, type='index', fullText=false, lower=true) {
    // ищет в строке каждый элемент списка; type может быть 'index', 'bool' и 'item'
    // индекс – это позиция найденного в string
    // 'item' вернёт найденный элемент списка list
    for (let item of list) {
        const result = STR_findSub(string, item, 'index', fullText, lower);
        if (result >= 0) {
            if (type === 'item') {return item}
            else                 {return getIB(type, result)}
        }
    }

    if (type === 'item') {return null}
    else                 {return getIB(type, -1)}
}
function STR_findSub(string, sub, type='index', fullText=false, lower=true) {
    // если fullText=true, проверяется равенство строк (но после .trim() + можно задать lower=true)
    // если lower=true, все строки будут сравниваться через .toLowerCase()
    string = string.trim();
    sub    = sub   .trim();
    if (fullText && string.length !== sub.length) {return getIB(type, -1)}
    if (lower) {
        string = string.toLowerCase();
        sub    = sub   .toLowerCase();
    }
    return getIB(type, string.indexOf(sub));
}

// общие
function STR_replaceIndex(string, index, newSymbol) {
    if (index > string.length-1) {return string}
    else {
        let newStr = string.substring(0, index);
        newStr    += newSymbol;
        newStr    += string.substring(index+1);
        return newStr;
    }
}
function STR_get_lastSymbol(string) {return string[string.length-1]}
function STR_fixHyphens(string) {return string.replaceAll('—', '-').replaceAll('–', '-')}
function STR_joinSpaces(string) {
    while (string.includes('  ')) {string = string.replace('  ', ' ')};
    return string;
}
function STRlat_toCyr(string) {
    const trList = Glat_toCyr();    // trList = translation list
    for (let list of trList) {string = string.replaceAll(list[0], list[1])}
    return string;
}

// исправление региона/города
function STR_autocorrCity(RVlibs, city) {
    city = STR_joinSpaces                   (city);
    city = STR_fixOblast                    (city);
    city = STR_rmOblast     (RVlibs.regList, city);
    city = STR_trimCity                     (city);
    city = STRlat_toCyr                     (city);
    city = STR_fix_cityHyphens              (city);
    city = STR_try_cityHyphens_and_e(RVlibs, city);
    return city;
}
function STR_fixOblast(string) {
    let  list = string.split(' ');
    let index = LIST_indxAny_from_strList(list, SL_oblShorts());
    if (index >= 0) {list[index] = 'область'}
    return list.join(' ');
}
function STR_rmOblast(regionList, city) {
    let initCity = city;

    let result = STR_find_subList(city, regionList, 'item');
    if (result !== null && result.length !== city.length) {
        let rmSymbols = [' ', ',', '(', ')'];
        city = city.replace(result, '');
        while (rmSymbols.includes(city[0])) {
            city = city.substring(1);
            if (!city.length) {return initCity}
        }
        while (rmSymbols.includes(STR_get_lastSymbol(city))) {
            city = city.substring(0, city.length-1);
            if (!city.length) {return initCity}
        }
        return city;
    }
    else {return initCity}
}
function STR_trimCity(city) {
    const  spaced = G_trimCity('spaced');
    const noSpace = G_trimCity('noSpace');

    // сначала те, что с пробелом
    let  list = city.split   (' ');
    let    LI = LIST_lastIndx(list);
    let first = list[0] .replaceAll('(', '').replaceAll(')', '');
    let  last = list[LI].replaceAll('(', '').replaceAll(')', '');
    if      (LIST_inclStr(spaced, first)) {return list.splice(1)    .join(' ')}
    else if (LIST_inclStr(spaced, last )) {return list.splice(0, LI).join(' ')}

    // потом те, что могут быть в начале строки без пробела, но в скобках
    for (let item of spaced) {
        let sub = '(' + item + ')';
        if (STR_findSub(city, sub) === 0) {return city.substring(sub.length)}
    }

    // потом те, что могут быть в начале строки без пробела и без скобок
    for (let item of noSpace) {
        // отрезаем по длине найденного + надо сразу выйти из цикла
        if (STR_findSub(city, item) === 0) {return city.substring(item.length)}
    }

    return city;
}
function STR_fix_cityHyphens(city) {
    let list = STR_fixHyphens(city).split('-');
    for (let i=0; i < list.length; i++) {list[i] = list[i].trim()}
    return list.join('-');
}
function STR_try_cityHyphens_and_e(RVlibs, city) {
    // пробует заменять 'е'<->'ё' (в обе стороны) и все пробелы на дефисы (напр., для 'Ростов на Дону')
    // возвращает новый вариант, если получится правильный город либо подходящий под автозамену
    let hyphened = city.replaceAll(' ', '-');
    if (LIB_tryCity(RVlibs, hyphened)) {return hyphened}

    let  RPL = {'е': 'ё', 'ё': 'е'}; // RPL = replacement
    let dict = {
        orig     : {init: city,     indexes: {'е': [], 'ё': []}},
        hyphened : {init: hyphened, indexes: {'е': [], 'ё': []}}
    }

    // собираем индексы букв 'е' и 'ё'
    for (let val of Object.values(dict)) {
        let curCity = val.init;
        for (let i=0; i < curCity.length; i++) {
            if (LIST_inclStr(['е', 'ё'], curCity[i])) {val.indexes[curCity[i].toLowerCase()].push(i)}
        }
    }

    // пробуем заменять
    for (let val of Object.values(dict)) {
        for (let symb of Object.keys(val.indexes)) {
            for (let ind of val.indexes[symb]) {
                let newCity = STR_replaceIndex(val.init, ind, RPL[symb]);
                if (LIB_tryCity(RVlibs, newCity)) {return newCity}
            }
        }
    }

    return city;
}
