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
        AC_sugg_noKey  : 'Ключ "$$1" добавлен на лист "$$2", но отсутствует в Gkeys_AC_sugg().',
        TCinit_diffLen : 'В функцию TCinit_fromLists() переданы списки lists_dict разной длины.'
    }
    return dict[type];
}
function SL_UImessages(type) {
    const dict = {
        noSheets_msg: {
             oneSheet  : 'Отсутствует лист:',
            manySheets : 'Отсутствуют листы:'
        }
    }
    return dict[type];
}
