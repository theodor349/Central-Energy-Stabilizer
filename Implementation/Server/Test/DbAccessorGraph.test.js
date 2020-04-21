const assert = require('assert');
const da = require('./../DatabaseAccessor.js');

function createGraphPrototype() {
    let values = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
        10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
        20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
        40, 41, 42, 43, 44, 45, 46, 47, 48, 49,
        50, 51, 52, 53, 54, 55, 56, 57, 58, 59,
    ];

    let graph = {
        graphId: "testId",
        values: values
    };
    return graph;
}

describe('Creating database graph', () => {
    it('creates a graph correct', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        let res = await da.createGraph(graph);
        assert(
            res.isNew !== undefined &&
            !res.isNew &&
            JSON.parse(res.values).length === 60);
    });

    it('creates a graph wrong input', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        graph.values = "PLZ return an error";
        let res = await da.createGraph(graph);
        assert(res === null);
    });
});