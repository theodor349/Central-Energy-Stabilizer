const functions = {
    dateToId: (prefix, date) => dateToId(prefix, date),
}
module.exports = functions;

function dateToId(prefix, date) {
    return prefix +
        "-Y" + date.getFullYear() +
        "-M" + date.getMonth() +
        "-D" + date.getDate() +
        "-H" + date.getHours();
}