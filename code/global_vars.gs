// инициализация R (root) = {cur: {}, libs: {}, SD: null/true/false}
function Ginit_R() {
    return {
        SD   : null,                        // SD = show dialogues
        libs : {region_list : ['Россия']}   // библиотеки+список регионов, будет считан из lib.regions
    }
}
function Ginit_Rcur() {
    // этот словарь будет записан в R.cur
    return {
        sheet         : null,                       // рабочий лист
        main          : {},                         //   распознанные столбцы в виде table-dict
        unk           : {},                         // нераспознанные столбцы в виде table-dict
        errors        : {},                         // шапка для подсчёта ошибок и уникальных
        vert_changed  : false,                      // для показа уведомлений об изменении вертикали
        init: {
            size      : {rows: null, cols: null},   // считанный размер
            title     : 0,                          // номер строки заголовков в data.table
            table     : null,                       // считанная таблица       (в виде таблицы)
            bg_colors : null                        // считанные фоновые цвета (в виде таблицы)
        }
    }
}

// основные типы
function Gtypes() {
    let dict = {
        launch_all: {
            read_sheets : ['columns', 'regions', 'cat', 'sources', 'autocorr', 'sugg']
        }
    }
}
