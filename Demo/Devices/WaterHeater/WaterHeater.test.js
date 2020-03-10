const waterHeater = require('./WaterHeater.js');

test("Test: example test", () => {
  let heater = {
    currentTemp: 55, // Current temperature
    lowerLimit: 55,  // When under it should start
    upperLimit: 85,  // When abow it turns off
    effect: 1000,    // Watts
    state: 1,        // 0 = off, 1 = standby, 2 = full power
  }
  waterHeater.update(heater);
  expect(heater.effect).not.toEqual(2);
});

//Test for update function
test("Testing the update function (effect 1000) (success)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.update(heater);
	expect(heater.effect).toBe(1000);
});

test("Testing the update function (effect 1000) (failure)", () => {
  let heater = {
    currentTemp: 55, // Current temperature
    lowerLimit: 55,  // When under it should start
    upperLimit: 85,  // When abow it turns off
    effect: 1000,    // Watts
    state: 1,        // 0 = off, 1 = standby, 2 = full power
  }
  waterHeater.update(heater);
  expect(heater.effect).not.toEqual(2);
});

//Test for the updateTemp function state temp change
test("Testing the updateTemp function with state: standby (success)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateTemp(heater);
	expect(heater.currentTemp).toBe(55);
});

test("Testing the updateTemp function with state: standby (failure)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateTemp(heater);
	expect(heater.currentTemp).not.toBe(50);
});

test("Testing the updateTemp function with state: full power (success)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 2,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateTemp(heater);
	expect(heater.currentTemp).toBe(56);
});

test("Testing the updateTemp function with state: full power (failure)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 2,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateTemp(heater);
	expect(heater.currentTemp).not.toBe(55);
});

test("Testing the updateTemp function with state: off (success)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 0,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateTemp(heater);
	expect(heater.currentTemp).toBe(54);
});
test("Testing the updateTemp function with state: off (failure)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 0,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateTemp(heater);
	expect(heater.currentTemp).not.toBe(55);
});

//Test for state in temperature outside of limits
test("Testing the checkTemp function with currentTemp: 55 (success)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).toBe(1);
});

test("Testing the checkTemp function with currentTemp: 55 (failure)", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).not.toBe(0);
});

test("Testing the checkTemp function with currentTemp: 54 (success)", () => {
	let heater = {
		currentTemp: 54, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).toBe(2);
});

test("Testing the checkTemp function with currentTemp: 54 (failure)", () => {
	let heater = {
		currentTemp: 54, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).not.toBe(1);
});

test("Testing the checkTemp function with currentTemp: 20 (success)", () => {
	let heater = {
		currentTemp: 20, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).toBe(2);
});

test("Testing the checkTemp function with currentTemp: 20 (failure)", () => {
	let heater = {
		currentTemp: 20, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).not.toBe(1);
});

test("Testing the checkTemp function with currentTemp: 86 (success)", () => {
	let heater = {
		currentTemp: 86, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).toBe(0);
});

test("Testing the checkTemp function with state: 86 (failure)", () => {
	let heater = {
		currentTemp: 86, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).not.toBe(2);
});

test("Testing the checkTemp function with currentTemp: 100 (success)", () => {
	let heater = {
		currentTemp: 100, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).toBe(0);
});

test("Testing the checkTemp function with state: 100 (failure)", () => {
	let heater = {
		currentTemp: 100, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.checkTemp(heater);
	expect(heater.state).not.toBe(2);
});

//Test for the updateState function for changing state
test("Testing the updateState function", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateState(heater, 2);
	expect(heater.state).toBe(2);
});

test("Testing the updateState function", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateState(heater, 2);
	expect(heater.state).not.toBe(1);
});

test("Testing the updateState function", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateState(heater, 0);
	expect(heater.state).toBe(0);
});

test("Testing the updateState function", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateState(heater, 2);
	expect(heater.state).not.toBe(1);
});

test("Testing the updateState function", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateState(heater, 1);
	expect(heater.state).toBe(1);
});

test("Testing the updateState function", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.updateState(heater, 1);
	expect(heater.state).not.toBe(2);
});

//Test for the notifyServer function
test("Testing the notifyServer function", () => {
	let heater = {
		currentTemp: 55, // Current temperature
		lowerLimit: 55,  // When under it should start
		upperLimit: 85,  // When above it turns off
		effect: 1000,    // Watts
		state: 1,        // 0 = off, 1 = standby, 2 = full power
	}
	waterHeater.notifyServer(heater);
	expect().toBe();
});
	
