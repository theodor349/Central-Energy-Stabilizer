const functions = {
    dateToId: (prefix, date) => dateToId(prefix, date),
    updateValues: (values, others, shouldSum) => updateValues(values, others, shouldSum),
    getRelativeDate: (mins, operator) => getRelativeDate(mins, operator),
}
module.exports = functions;

function dateToId(prefix, date) {
    return prefix +
        "-Y" + date.getFullYear() +
        "-M" + date.getMonth() +
        "-D" + date.getDate() +
        "-H" + date.getHours();
}

function updateValues(values, others, shouldSum) {
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

function getRelativeDate(mins, operator) {
    let date = new Date();
    if (operator === '+') {
        date.setHours(date.getHours() + mins / 60);
        date.setMinutes(date.getMinutes() + mins % 60);
    } else {
        date.setHours(date.getHours() - mins / 60);
        date.setMinutes(date.getMinutes() - mins % 60);
    }
    return date;
}
