const forecaster = require('./../ForecasterAPI.js');
const da = require('./../DatabaseAccessorGraph.js');

if (true) {
    describe('Forecaster API', () => {
        it('update non existing date', async () => {
            da.dropDatabase();
            console.log(new Date());
            let res = await forecaster.updateApiDemand();
        });
    });
}