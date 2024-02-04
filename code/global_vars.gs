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
        sheet       : ss.getActiveSheet(),  // рабочий лист
        vertChanged : false,    // для показа уведомлений об изменении вертикали
        TD: {                   // все объекты table-dict (таблицы-словари)
            main    : {},       //   распознанные столбцы в виде table_column
            unk     : []        // нераспознанные столбцы в виде table_column
        },
        TBL: {                  // считанные с листа таблицы
            init    : {},       // {size:{rows:, cols:}, title:num, table:TBL, bgColors:TBL}
            cur     : {}        //                      {title:num, table:TBL, bgColors:TBL}
        },
        CT          : []        // cell table [[{value:, bgColor:, note:, error:}, ...], ...]
    }
}

// основные типы и листы
function Gtypes(type) {
    // библиотека columns НУЖНА ВСЕГДА, когда преобразуем SPEC_cur_toTD()
    let NAtitles = SL_UImessages('noSheets_msg').titles;
    let dict = {
        launchAll: {
            readSheets     : ['columns', 'regions', 'cat', 'sources', 'autocorr', 'sugg'],
            noSheets_title : NAtitles.multi
        }
    }
    return dict[type];
}
function Gsheets(type) {
    let dict = {
        columns  : '[script] столбцы{}',
        regions  : '[script] регионы и города{[],[],[]}',
        cat      : '[script] категории{[],[]}',
        logCat   : '[script] logical category{}',
        sources  : '[script] источники[]',
        sugg     : '[script] предложения исправлений{{x:[]}}',  // sugg = suggestions
        autocorr : '[script] автоисправления{{x:y}}'
    }
    return dict[type];
}

// вспомогательные словари
function Gkeys_AC_sugg() {
    return  {
        'название столбца'                      : 'col_title',
        'регион и город'                        : 'region',
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
