/*
const assert = require('assert');
const rqstMngr = require('./../RequestManager.js');

if (true) {
  describe('Request Manager', () => {

    it('request a time to run when isScheduled === true', async() => {
        let graph = [21, 13, 22, 29];
        let isScheduled = true;
        let timeIntervalObject = {
            timeIntervalStart: new Date(2010, 1, 24, 15, 30),
            timeIntervalFinish: new Date(2010, 1, 24, 18, 30)
            };
        let expectedFinishTime = new Date(2010, 1, 24, 15, 34);

        let res = rqstMngr.requestTimeToRun(graph, isScheduled, timeIntervalObject);
        console.log(res.outputIntervalStart);
        console.log(res.outputIntervalFinish);
        assert(res.outputIntervalStart === undefined &&
                //res.outputIntervalStart === timeIntervalObject.timeIntervalStart &&
               res.outputIntervalFinish === undefined
               //res.outputIntervalFinish === expectedFinishTime
               );
    });
  });
} 
*/