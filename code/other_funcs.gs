// служебная функция, которая возвращает либо сам index, либо true/false в зависимости от значения index
function getIB(type, index) {
    // IB = index/boolean
    if (type === 'index') {return index}
    else                  {return index >= 0}
}
function LOG(type, extra=null) {
    // в extra можно передать любые необходимые доп. данные
    if (type === 'AC_sugg_noKey' && extra.keys.length > 1) {type += 's'}
    let msg = SLlogger(type);

    if (type.includes('AC_sugg_noKey')) {
        msg = msg.replace('$$1', extra.keys).replace('$$2', extra.sheet);
    }
    else if (extra !== null) {msg = msg.replace('$$1', extra)}

    Logger.log(msg);
}
