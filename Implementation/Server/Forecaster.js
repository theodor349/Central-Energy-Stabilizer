/*
    Graphs it works with
        deviceDemand
        surplus
*/

const functions = {
    updateSurplus: () => updateSurplus,
    addDemand: (startTime, graph) => addDemand(startTime, graph),
    removeDemand: (startTime, graph) => removeDemand(startTime, graph),
}
module.exports = functions;