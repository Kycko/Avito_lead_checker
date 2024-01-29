function SL_main_menu() {
    return {
        main: {
            title: 'Проверка лидов перед загрузкой',
            items: [
                ['🚀 Запустить все проверки',                                            'MM_launch_all'],
            ]
        }
    }
}

function SL_logger(type) {
    const dict = {
        onOpen_no_key        : 'Ключ "%s" отсутствует в списке пунктов главного меню SL_main_menu().',
    }
    return dict[type];
}
