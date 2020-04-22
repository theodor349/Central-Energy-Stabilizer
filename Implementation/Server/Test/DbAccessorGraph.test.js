const assert = require('assert');
const da = require('./../DatabaseAccessorGraph.js');

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
    it('creates a graph correct id', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        let res = await da.createGraph(graph);
        assert(
            res.isNew !== undefined &&
            !res.isNew &&
            JSON.parse(res.values).length === 60);
    });

    it('creates a graph wrong id', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        graph.values = "PLZ return an error";
        let res = await da.createGraph(graph);
        assert(res === null);
    });
});

describe('Get database graph', () => {
    it('get a graph correct id', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        await da.createGraph(graph);
        let res = await da.getGraph(graph.graphId);
        assert(res.values.length === 60);
    });
    it('get a graph wrong id', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        await da.createGraph(graph);
        let res = await da.getGraph("PLZ return an error");
        assert(res === null);
    });
});

describe('Update database graph', () => {
    it('Update a graph correct id', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        await da.createGraph(graph);
        let res = await da.updateGraph(graph.graphId, 10, [1, 1, 1]);
        assert(res === true && res.values.length === 60);
    });
    it('Update a graph wrong id', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        await da.createGraph(graph);
        let res = await da.updateGraph("PLZ return an error", 10, [1, 1, 1]);
        assert(res !== undefined && res === false);
    });
    it('Update a graph wrong start index', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        await da.createGraph(graph);
        let res = await da.updateGraph(graph.graphId, 165, [1, 1, 1]);
        assert(res !== undefined && res === false);
    });
    it('Update a graph too many values', async () => {
        da.dropDatabase();
        let graph = createGraphPrototype();
        await da.createGraph(graph);
        let res = await da.updateGraph(graph.graphId, 0,
            [
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
                0, 1, 2, 3, 4, 5, 6, 7, 8, 9,
            ]);
        assert(res !== undefined && res === false);
    });

});