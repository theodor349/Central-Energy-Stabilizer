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
if (false) {
    describe('DatabaseAccessor Graph', () => {
        /*
            Create
        */
        it('create: graph with correct id and values', async () => {
            da.dropDatabase();
            let graph = createGraphPrototype();
            let res = await da.createGraph(graph);
            assert(
                res.isNew !== undefined &&
                !res.isNew &&
                JSON.parse(res.values).length === 60);
        });
        it('create: graph with wrong values', async () => {
            da.dropDatabase();
            let graph = createGraphPrototype();
            graph.values = "PLZ return an error";
            let res = await da.createGraph(graph);
            assert(res === null);
        });

        /*
            Get
        */
        it('get: graph with correct id', async () => {
            da.dropDatabase();
            let graph = createGraphPrototype();
            await da.createGraph(graph);
            let res = await da.getGraph(graph.graphId);
            assert(res.values.length === 60);
        });
        it('get: graph with wrong id', async () => {
            da.dropDatabase();
            let graph = createGraphPrototype();
            await da.createGraph(graph);
            let res = await da.getGraph("PLZ return an error");
            assert(res === null);
        });

        /*
            Update
        */
        it('update: add to graph with valid values', async () => {
            da.dropDatabase();
            let graph = createGraphPrototype();
            await da.createGraph(graph);

            let res = await da.updateGraph(graph.graphId,
                [
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    1, 1, 1, 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 1,
                ], true);
            let resG = await da.getGraph(graph.graphId);

            assert(res === true &&
                resG.values.length === 60 &&
                resG.values[10] === 11 &&
                resG.values[11] === 12 &&
                resG.values[12] === 13 &&
                resG.values[59] === 60
            );
        });
        it('update: graph with correct id and values', async () => {
            da.dropDatabase();
            let graph = createGraphPrototype();
            await da.createGraph(graph);

            let res = await da.updateGraph(graph.graphId,
                [
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    1, 1, 1, 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 1,
                ], false);
            let resG = await da.getGraph(graph.graphId);

            assert(res === true &&
                resG.values.length === 60 &&
                resG.values[10] === 1 &&
                resG.values[11] === 1 &&
                resG.values[12] === 1 &&
                resG.values[59] === 1
            );
        });
        it('update: graph with wrong id and correct values', async () => {
            da.dropDatabase();
            let graph = createGraphPrototype();
            await da.createGraph(graph);
            let res = await da.updateGraph("PLZ return an error",
                [
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    1, 1, 1, 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 1,
                ], false);
            assert(res !== undefined && res === false);
        });
        it('update: graph with too few values', async () => {
            da.dropDatabase();
            let graph = createGraphPrototype();
            await da.createGraph(graph);
            let res = await da.updateGraph(graph.graphId,
                [
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    1, 1, 1, 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                    'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n', 'n',
                ], false);
            assert(res !== undefined && res === false);
        });
        it('update: graph with too many values', async () => {
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
}