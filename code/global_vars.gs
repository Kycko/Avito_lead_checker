// инициализация RV (root vars) = {cur: {}, libs: {}, SD: null/true/false}
function Ginit_RV() {
    return {
        GTO  : {                            // Google tables objects
            ss: SpreadsheetApp.getActive(), // ss = SpreadSheet
            ui: SpreadsheetApp.getUi()
        },
        SD   : null,                        // SD = show dialogues
        libs : {                            // библиотеки
            NSF     : [],                   // no sheet found: список отсутствующих листов
            regList : ['Россия']}           // список регионов, будет считан из lib.regions
    }
}
function Ginit_RVcur(ss) {
    // этот словарь будет записан в RV.cur (текущие данные, которые мы будем изменять)
    return {
        sheet        : ss.getActiveSheet(), // рабочий лист
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

// основные типы и листы
function Gtypes(type) {
    // columns НУЖЕН ВСЕГДА, когда преобразуем SPEC_cur_toTD()
    let dict = {
        launch_all: {
            read_sheets : ['columns', 'regions', 'cat', 'sources', 'autocorr', 'sugg']
        }
    }
    return dict[type];
}
function Gsheets(type) {
    let dict = {
        columns  : '[script] столбцы{}',
        regions  : '[script] регионы и города{[],[],[]}',
        cat      : '[script] категории{[],[]}',
        log_cat  : '[script] logical category{}',
        sources  : '[script] источники[]',
        sugg     : '[script] предложения исправлений{{x:[]}}',  // sugg = suggestions
        autocorr : '[script] автоисправления{{x:y}}'
    }
    return dict[type];
}

// вспомогательные словари
function Gkeys_autocorr_and_sugg() {
    return  {
        'название столбца'                      : 'col_title',
        'регион/город'                          : 'region',
        'категория'                             : 'cat',
        'вертикаль'                             : 'vert',
        'источник'                              : 'source',
        'название компании'                     : 'company',
        'фамилия'                               : 'p_family',
        'имя'                                   : 'p_name',
        'отчество'                              : 'p_otch',
        'должность'                             : 'job_title',
        'телефон'                               : 'phone',
        'e-mail'                                : 'mail',
        'сайт'                                  : 'website',
        'статус'                                : 'lead_status',
        'ответственный'                         : 'lead_owner',
        'доступен для всех'                     : 'lead_available',
        'статус посещения мероприятия клиентом' : 'event_visit_status'
    }
}
