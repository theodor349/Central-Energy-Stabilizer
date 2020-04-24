const assert = require('assert');
const forecaster = require('./../ForecasterAPI.js');
const da = require('./../DatabaseAccessorGraph.js');

if (true) {
    describe('Forecaster API', () => {
        it('demand: update non existing date', async () => {
            da.dropDatabase();
            let date = new Date(2010, 1, 24, 15);

            let res = await forecaster.updateApiDemand(date);
            let graph = await da.getGraph("apiDemand-Y2010-M1-D24-H15");

            assert(res === true && graph.values !== undefined &&
                graph.values[0] === -0.06486414723678369 &&
                graph.values[10] === 0.4907779752739456 &&
                graph.values[25] === 2.819898153108528 &&
                graph.values[54] === -0.2722312990325585
            );
        });
        it('demand: update existing date', async () => {
            da.dropDatabase();
            let date = new Date(2010, 1, 24, 15);
            await forecaster.updateApiDemand(date);

            let res = await forecaster.updateApiDemand(date);
            let graph = await da.getGraph("apiDemand-Y2010-M1-D24-H15");

            assert(res === true && graph.values !== undefined &&
                graph.values[0] === -0.06486414723678369 &&
                graph.values[10] === 0.4907779752739456 &&
                graph.values[25] === 2.819898153108528 &&
                graph.values[54] === -0.2722312990325585
            );
        });

        it('production: update non existing date', async () => {
            da.dropDatabase();
            let date = new Date(2010, 1, 24, 15);

            let res = await forecaster.updateApiProduction(date);
            let graph = await da.getGraph("apiProduction-Y2010-M1-D24-H15");

            assert(res === true && graph.values !== undefined &&
                graph.values[0] === 2.432456679503506 &&
                graph.values[10] === -1.4706413605848179 &&
                graph.values[25] === -1.0143450461571553 &&
                graph.values[54] === 0.19041228550402078
            );
        });
        it('production: update existing date', async () => {
            da.dropDatabase();
            let date = new Date(2010, 1, 24, 15);
            await forecaster.updateApiProduction(date);

            let res = await forecaster.updateApiProduction(date);
            let graph = await da.getGraph("apiProduction-Y2010-M1-D24-H15");

            assert(res === true && graph.values !== undefined &&
                graph.values[0] === 2.432456679503506 &&
                graph.values[10] === -1.4706413605848179 &&
                graph.values[25] === -1.0143450461571553 &&
                graph.values[54] === 0.19041228550402078
            );
        });
        it('all: 25 hours', async () => {
            da.dropDatabase();
            let date = new Date(2010, 1, 24, 15);
            await forecaster.updateApiGraphs(date);

            let pgraph1 = await da.getGraph("apiProduction-Y2010-M1-D24-H15");
            let pgraph10 = await da.getGraph("apiProduction-Y2010-M1-D25-H1");
            let pgraph25 = await da.getGraph("apiProduction-Y2010-M1-D25-H15");
            let dgraph1 = await da.getGraph("apiDemand-Y2010-M1-D24-H15");
            let dgraph10 = await da.getGraph("apiDemand-Y2010-M1-D25-H1");
            let dgraph25 = await da.getGraph("apiDemand-Y2010-M1-D25-H15");

            assert(
                pgraph1.values[0] !== 0 &&
                pgraph10.values[0] !== 0 &&
                pgraph25.values[0] !== 0 &&

                dgraph1.values[0] !== 0 &&
                dgraph10.values[0] !== 0 &&
                dgraph25.values[0] !== 0
            );
        });
    });
}