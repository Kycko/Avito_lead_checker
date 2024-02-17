// инициализация всякого, в т. ч. RV (root vars) = {cur: {}, libs: {}, SD: null/true/false}
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
function GinitError(r, c) {return {fixed: false, newVal: null, pos: [{r:r, c:c}]}}

// основные типы и листы
function G_launchTypes(type) {
    // библиотека columns НУЖНА ВСЕГДА, когда преобразуем SPEC_cur_toTD()
    // (для распознавания столбцов ещё на этапе чтения данных)
    let NAtitles = SL_UImessages('noSheets_msg').NAsheets_titles;

    let dict = {
        launchAll: {
            noSheets_title : NAtitles.multi,
            readSheets     : ['columns', 'regions', 'cat', 'sources', 'autocorr', 'sugg'],
            launchReqs     : ['columns']    // что обязательно нужно для запуска алгоритма
        }
    }
    return dict[type];
}
function G_UDtypes(type) { // user data types
    // ПОТОМ СВЕРИТЬ, ЗДЕСЬ ДОЛЖНЫ БЫТЬ ВСЕ ТИПЫ ИЗ Gkeys_AC_sugg()
    let dict = {
        colTitle: {
            readLib   : true,   // список подходящих вариантов будет прочитан из библиотеки
            checkList : true,   // валидация путём проверки, есть ли value в списке допустимых (extra)
            suggMsg   : {acceptBlank: false, gend: 'neutral'}   // для диалога UI_sugg_invalidUD()
        },
        region: {
            readLib   : true,
            checkList : true,
            suggMsg   : {acceptBlank: false, gend: 'male'}
        },
        cat: {
            readLib   : true,
            checkList : true,
            suggMsg   : {acceptBlank: false, gend: 'female'}
        },
        vert: {
            readLib   : false,
            checkList : true,
            suggMsg   : {acceptBlank: false, gend: 'female'}
        },
        source: {
            readLib   : true,
            checkList : true,
            suggMsg   : {acceptBlank: false, gend: 'male'}
        }
    }
    return dict[type];
}
function Gsheets() {
    return {
        columns  : '[script] столбцы{}',
        regions  : '[script] регионы и города{[],[],[]}',
        cat      : '[script] категории{[],[]}',
        logCat   : '[script] logical category{}',
        sources  : '[script] источники[]',
        sugg     : '[script] предложения исправлений{{x:[]}}',  // sugg = suggestions
        autocorr : '[script] автоисправления{{x:y}}'
    }
}
function Gcolors() {
    return {
        hl_lightGreen  : '#e4ffed', // hl = highlight
        hlGreen        : '#93dfaf', // hl = highlight
        hl_lightOrange : '#fce5cd', // hl = highlight
        hlRed          : '#ea9999', // hl = highlight
        hlYellow       : '#ffe599', // hl = highlight
        black          : '#000000', // i.e. default font color
        brdGrey        : '#cccccc', // brd = cell borders
    }
}

// вспомогательные словари
function Gkeys_AC_sugg() {
    return  {
        'название столбца'                      : 'colTitle',
        'регион и город'                        : 'region',
        'категория'                             : 'cat',
        'вертикаль'                             : 'vert',
        'источник'                              : 'source',
        'название компании'                     : 'company',
        'фамилия'                               : 'pFamily',
        'имя'                                   : 'pName',
        'отчество'                              : 'pOtch',
        'должность'                             : 'jobTitle',
        'телефон'                               : 'phone',
        'e-mail'                                : 'mail',
        'сайт'                                  : 'website',
        'статус'                                : 'leadStatus',
        'ответственный'                         : 'leadOwner',
        'доступен для всех'                     : 'leadAvail',
        'статус посещения мероприятия клиентом' : 'event_visitStatus'
    }
}
function G_trimCity(type) {
    let noSpace = ['г.', 'д.', 'с.', 'х.', 'рп.', 'дп.', 'ст.', 'пос.', 'пгт.', 'городской пос.'];
    let  spaced = ['г',  'д',  'с',  'х',  'рп',  'дп',  'ст', 'посёлок', 'поселок', 'пос', 'пгт', 'городской пос', 'город', 'станица', 'ст-ца', 'хутор', 'село', 'деревня'];

    let dict = {
        noSpace : noSpace,  // это то, что может быть в начале строки и без пробела (напр., 'г.Москва')
        spaced  : noSpace.concat(spaced)
    }
    return dict[type];
}
function Glat_toCyr() {
    // особая кавычка почему-то не работает с двойными кавычками
    return [
        ['Ch',  'Ч' ], ['ch',  'ч' ],
        ["Kh'", 'Хь'], ["kh'", 'хь'],
        ['Kh’', 'Хь'], ['kh’', 'хь'],
        ['Kh',  'Х' ], ['kh',  'х' ],
        ['Sh',  'Ш' ], ['sh',  'ш' ],
        ['Ts',  'Ц' ], ['ts',  'ц' ],
        ['Ay',  'Ай'], ['ay',  'ай'],
        ['Ey',  'Ей'], ['ey',  'ей'],
        ['Iy',  'Ий'], ['iy',  'ий'],
        ['Yy',  'Ый'], ['yy',  'ый'],
        ['Ya',  'Я' ], ['ya',  'я' ],
        ['Ye',  'Е' ], ['ye',  'е' ],
        ['Yo',  'Е' ], ['yo',  'е' ],
        ['Yu',  'Ю' ], ['yu',  'ю' ],
        ['Zh',  'Ж' ], ['zh',  'ж' ],
        ["L'",  'Ль'], ["l'",  'ль'],
        ['L’',  'Ль'], ['l’',  'ль'],
        ["N'",  'Нь'], ["n'",  'нь'],
        ['N’',  'Нь'], ['n’',  'нь'],
        ["T'",  'Ть'], ["t'",  'ть'],
        ['T’',  'Ть'], ['t’',  'ть'],
        ['A',   'А' ], ['a',   'а' ],
        ['B',   'Б' ], ['b',   'б' ],
        ['D',   'Д' ], ['d',   'д' ],
        ['E',   'Е' ], ['e',   'е' ],
        ['F',   'Ф' ], ['f',   'ф' ],
        ['G',   'Г' ], ['g',   'г' ],
        ['H',   'Х' ], ['h',   'х' ],
        ['I',   'И' ], ['i',   'и' ],
        ['K',   'К' ], ['k',   'к' ],
        ['L',   'Л' ], ['l',   'л' ],
        ['M',   'М' ], ['m',   'м' ],
        ['N',   'Н' ], ['n',   'н' ],
        ['O',   'О' ], ['o',   'о' ],
        ['P',   'П' ], ['p',   'п' ],
        ['R',   'Р' ], ['r',   'р' ],
        ['S',   'С' ], ['s',   'с' ],
        ['T',   'Т' ], ['t',   'т' ],
        ['U',   'У' ], ['u',   'у' ],
        ['V',   'В' ], ['v',   'в' ],
        ['W',   'В' ], ['w',   'в' ],
        ['Y',   'Ы' ], ['y',   'ы' ],
        ['Z',   'З' ], ['z',   'з' ]
    ]
}
