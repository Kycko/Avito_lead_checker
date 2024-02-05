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

        AC_sugg_noKey  : 'Ключ "$$1" добавлен на лист "$$2", но отсутствует в Gkeys_AC_sugg().',
        AC_sugg_noKeys : 'Ключи "$$1" добавлены на лист "$$2", но отсутствуют в Gkeys_AC_sugg().'
    }
    return dict[type];
}
function SL_UImessages(type) {
    const dict = {
        noSheets_msg: {
            noReqs_title   : 'Невозможно выполнить',
            NAsheets_titles: {
                multi      : 'Невозможно выполнить некоторые проверки'
            },
            msg: {
                 oneSheet  : 'Отсутствует лист:',
                manySheets : 'Отсутствуют листы:'
            }
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
