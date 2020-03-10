const waterHeater = require('./WaterHeater.js');

test("Test", () => {
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
test("Testing the update function", () => {
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

test("Testing the update function", () => {
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

//Test for the updateTemp function
test("Testing the updateTemp function", () => {
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

test("Testing the updateTemp function", () => {
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

test("Testing the updateTemp function", () => {
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

test("Testing the updateTemp function", () => {
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

test("Testing the updateTemp function", () => {
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
test("Testing the updateTemp function", () => {
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

//Test for the updateState function
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
	
