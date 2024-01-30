// служебная функция, которая возвращает либо сам index, либо true/false в зависимости от значения index
function get_IB(type, index) {
    // IB = index/boolean
    if (type === 'index') {return index}
    else                  {return index >= 0}
}
function LOG(type, extra=null) {
    // в extra можно передать любые необходимые доп. данные
    let msg = SL_logger(type);
    if (extra !== null) {msg = msg.replace('$$1', extra)}
    Logger.log(msg);
}
