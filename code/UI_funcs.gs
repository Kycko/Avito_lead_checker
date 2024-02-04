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
        else {LOG('onOpen_noKey', key)}
    }
}

// общие (msg = {title:, text:})
function UI_showMsg(ui, msg, type=null) {
    // type может быть null (только кнопка OK), 'question' (YES_NO) и 'input' (с полем ввода)
    if (type === 'input') {
        let resp = ui.prompt(msg.title, msg.text, ui.ButtonSet.OK_CANCEL);
        return {
            OKclicked : resp.getSelectedButton() === ui.Button.OK,
            input     : resp.getResponseText()
        }
    }
    else {
        if      (type === null)       {var buttons = ui.ButtonSet.OK}
        else if (type === 'question') {var buttons = ui.ButtonSet.YES_NO}
        return ui.alert(msg.title, msg.text, buttons) === ui.Button.YES;
    }
}
function UI_msg_fromSL  (ui,    SLkey, type=null) {return UI_showMsg(ui, SL_UImessages(SLkey), type)}
function UI_showToast   (GTOss, msg,   time=6)    {GTOss.toast (msg.text, msg.title,    time)}
function UI_toast_fromSL(GTOss, SLkey, time=6)    {UI_showToast(GTOss, SLtoasts(SLkey), time)}

// узконаправленные
function UI_noSheets_msg(GTOui, NAsheets, errorTitle) {
    let SLobj = SL_UImessages('noSheets_msg').msg;
    if  (NAsheets.length === 1) {var text  = SLobj.oneSheet}
    else                        {var text  = SLobj.manySheets}
    for (let sheet of NAsheets) {    text += '\n• ' + sheet}

    UI_showMsg(GTOui, {title: errorTitle, text: text});
}
