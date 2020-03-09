const waterHeater = require('./WaterHeater.js');

test("Test", () => {
  let heater = {
    currentTemp: 55, // Current temperature
    lowerLimit: 55, // When under it should start
    upperLimit: 85, // When abow it turns off
    effect: 1000, // Watts
    state: 1, // 0 = off, 1 = standby, 2 = full power
  }
  waterHeater.update(heater);
  expect(heater.effect).toEqual(2);
});