// инициализация RV (root vars) = {cur: {}, libs: {}, SD: null/true/false}
function Ginit_RV() {
    return {
        SD   : null,                        // SD = show dialogues
        libs : {region_list: ['Россия']}    // библиотеки+список регионов, будет считан из lib.regions
    }
}
function Ginit_RVcur() {
    // этот словарь будет записан в RV.cur (текущие данные, которые мы будем изменять)
    return {
        sheet        : null,    // рабочий лист
        vert_changed : false,   // для показа уведомлений об изменении вертикали
        TD: {                   // все объекты table-dict (таблицы-словари)
            main     : {},      //   распознанные столбцы{title:{}, cells:[], init_pos:x} в виде table-dict
            unk      : {},      // нераспознанные столбцы{title:{}, cells:[], init_pos:x} в виде table-dict
            errors   : {},      // шапка для подсчёта ошибок и уникальных
        },
        TBL: {                  // считанные с листа таблицы
            init     : {},      // {size:{rows:, cols:}, title:num, table:TBL, bg_colors:TBL}
            cur      : {}       //                      {title:num, table:TBL, bg_colors:TBL}
        },
        CT           : []       // cell table [[{value:, bg_color:, note:, error:}, ...], ...]
    }
}

// основные типы
function Gtypes() {
    // columns НУЖЕН ВСЕГДА, когда преобразуем SPEC_cur_toTD()
    let dict = {
        launch_all: {
            read_sheets : ['columns', 'regions', 'cat', 'sources', 'autocorr', 'sugg']
        }
    }
}
