/*
    Graphs it works with
        apiDemand
        apiProduction
*/

const functions = {
    // For deployment
    updateApiGraphs: (date) => updateApiGraphs(date),
    updateApiDemand: (date) => updateApiDemand(date),
    updateApiProduction: (date) => updateApiProduction(date),
    // For testing
    getSurplusAt: (x) => getSurplusAt(x),
    getDemandAt: (x) => getDemandAt(x),
    getProdutionAt: (x) => getProdutionAt(x),
}
module.exports = functions;

async function updateApiGraphs(date) {

}

async function updateApiDemand(date) {

}

async function updateApiProduction(date) {

}

function getSurplusAt(x) {
    return getProdutionAt(x) - getDemandAt(x);
}

function getDemandAt(x) {
    return Math.sin(0.9 * x - 5) * 2.2 + Math.sin(1.4 * x - 0.2) * 1.3 + Math.sin(2.1 * x - 2) * 2.8;
}

function getProdutionAt(x) {
    return Math.sin(2.7 * x + 3.3) * 0.8 + Math.sin((-0.5) * x + 1) * 2.7 + Math.sin(Math.sin(2.1 * x - 2) * 2.8);
}