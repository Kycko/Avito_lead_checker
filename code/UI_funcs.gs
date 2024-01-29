/** @OnlyCurrentDoc */
function onOpen() {
    const UI = SpreadsheetApp.getUi();
    const MM = SL_main_menu();  // MM = main menu
    for (let key of ['main', 'scripts']) {
        if (Object.keys(MM).includes(key)) {
            let menu = UI.createMenu(MM[key].title);
            for (let item of MM[key].items) {
                if (item[0] === 'separator') {menu.addSeparator()}
                else                         {menu.addItem     (item[0], item[1])}
            }
            menu.addToUi();
        }
        else {Logger.log(SL_logger('onOpen_no_key'), key)}
    }
}
