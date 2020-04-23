/*
    Graphs it works with
        deviceDemand
        surplus
*/

const functions = {
    updateSurplus: () => updateSurplus,
    addDemand: (graph) => addDemand(graph),
    removeDemand: (graph) => removeDemand(graph),
}
module.exports = functions;