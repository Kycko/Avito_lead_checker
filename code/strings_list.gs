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
        onOpen_no_key        : 'Ключ "$$1" отсутствует в списке пунктов главного меню SL_main_menu().',
        TC_init_diff_len     : 'В функцию TC_init_from_lists() переданы списки lists_dict разной длины.'
    }
    return dict[type];
}
