const functions = {
    dateToId: (prefix, date) => dateToId(prefix, date),
    updateValues: (values, others, shouldSum) => updateValues(values, others, shouldSum),
}
module.exports = functions;

function dateToId(prefix, date) {
    return prefix +
        "-Y" + date.getFullYear() +
        "-M" + date.getMonth() +
        "-D" + date.getDate() +
        "-H" + date.getHours();
}

function updateValues(values,others, shouldSum) {
    if (shouldSum) {
        for (let i = 0; i < others.length; i++) {
            if (others[i] === 'n') {
                continue;
            }
            values[i] += others[i];
        }
    } else {
        for (let i = 0; i < others.length; i++) {
            if (others[i] === 'n') {
                continue;
            }
            values[i] = others[i];
        }
    }
    return values;
}
