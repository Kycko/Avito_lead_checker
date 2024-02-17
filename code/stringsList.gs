function SL_main_menu() {
    return {
        main: {
            title: 'Проверка лидов перед загрузкой',
            items: [
                ['🚀 Запустить все проверки',                                            'MM_launchAll'],
            ]
        }
    }
}

function SLlogger(type) {
    const dict = {
        onOpen_noKey   : 'Ключ "$$1" отсутствует в списке пунктов главного меню SL_main_menu().',
        TCinit_diffLen : 'В функцию TCinit_fromLists() переданы списки lists_dict разной длины.',

        ACsugg_noKey   : 'Ключ "$$1" добавлен на лист "$$2", но отсутствует в Gkeys_AC_sugg().',
        ACsugg_noKeys  : 'Ключи "$$1" добавлены на лист "$$2", но отсутствуют в Gkeys_AC_sugg().'
    }
    return dict[type];
}
function SL_UImessages(type) {
    const dict = {
        MM_showDialogues: {
            title : 'Предлагать сразу исправлять ошибки?',
            text  : 'Если нет, диалоговые окна не будут появляться, а все ошибки будут подсвечены красным.'
        },
        noSheets_msg: {
            noReqs_title   : 'Невозможно выполнить',
            NAsheets_titles: {
                multi      : 'Невозможно выполнить некоторые проверки'
            },
            msg: {
                 oneSheet  : 'Отсутствует лист:',
                manySheets : 'Отсутствуют листы:'
            }
        },
        sugg_invalidUD: {
            title  : {male    : 'Неправильный',
                      female  : 'Неправильная',
                      neutral : 'Неправильное'},
            txt    : {main         : 'Введите правильный вариант$$1 или нажмите "Отмена", чтобы исправить его потом.\n\n$$2:\n• $$3\n\n',
                      acceptBlank  : ', оставьте поле пустым для удаления',
                      catVert      : 'Указанная категория',
                      anotherTypes : 'Текущее значение'},
            offers : 'Возможные варианты:\n'
        }
    }
    return dict[type];
}
function SLtoasts(type) {
    const dict = {
        vertChanged: {
            title  : 'Вертикаль изменена!',
            text   : 'Все автоматически изменённые ячейки будут подсвечены жёлтым цветом.'
        }
    }
    return dict[type];
}

// узконаправленные
function SL_oblShorts() {return ['обл.', 'обл', 'обл.)', 'обл)']}
