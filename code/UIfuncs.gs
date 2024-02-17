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
function UI_noSheets_msg(RV, noSheets_title, reqLIB_ready) {
    let sheetNames = Gsheets();
    let      SLobj = SL_UImessages('noSheets_msg');
    let   finalMsg = {};

    if (reqLIB_ready) {finalMsg.title =     noSheets_title}
    else              {finalMsg.title = SLobj.noReqs_title}

    if  (RV.libs.NSF.length === 1) {finalMsg.text  = SLobj.msg.oneSheet}
    else                           {finalMsg.text  = SLobj.msg.manySheets}
    for (let sheet of RV.libs.NSF) {finalMsg.text += '\n• ' + sheetNames[sheet]}

    UI_showMsg(RV.GTO.ui, finalMsg);
}
function UI_ask_showDialogues(RV) {RV.SD = UI_msg_fromSL(RV.GTO.ui, 'MM_showDialogues', 'question')}
function UI_sugg_invalidUD(ui, type, initVal, suggList, counter) {
    const strings = SL_UImessages('sugg_invalidUD');
    const    Tobj = G_UDtypes    (type);    // type object
    let  finalMsg = {};

    // title
    let title = DICT_get_key_by_string_value(Gautocorr_and_sugg_keys(), type);
    finalMsg['title']  = strings.title[Tobj.suggMsg.gend] + ' ' + title;
    finalMsg['title'] += ' (' + counter.cur + ' из ' + counter.total + ')';

    // msg
    let RPL = {'3': initVal};   // RPL = replace
    if (Tobj.suggMsg.acceptBlank) {RPL['1'] = strings.txt.acceptBlank}
    else                          {RPL['1'] = ''}
    if (type === 'vert')          {RPL['2'] = strings.txt.catVert}
    else                          {RPL['2'] = strings.txt.anotherTypes}
    finalMsg['text'] = strings.txt.main;
    for (let num of Object.keys(RPL)) {finalMsg.text = finalMsg.text.replace('$$'+num, RPL[num])}

    if (suggList.length) {
        finalMsg.text += strings.offers;
        for (let sugg of suggList) {finalMsg.text += '• ' + sugg + '\n'}
        finalMsg.text += '\n';
    }

    return UI_showMsg(ui, finalMsg, 'input');
}
