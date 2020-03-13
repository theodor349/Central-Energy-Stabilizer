const state = {
  OFF: 0,
  KEEP_TEMP: 1,
  ON: 2,
}
//let myWaterHeater0 = {
//  id: 0,
//  type: "WaterHeater",
//  currentTemp: 55, // Current temperature
//  lowerLimit: 55, // When under it should start
//  upperLimit: 85, // When abow it turns off
//  maxEffect: 1000, // Watts
//  state: state.ON, // 0 = off, 1 = KEEP_TEMP, 2 = full power
//}
//addWaterHeater(myWaterHeater0);
//
//let myWaterHeater1 = {
//  id: 1,
//  type: "WaterHeater",
//  currentTemp: 99, // Current temperature
//  lowerLimit: 40, // When under it should start
//  upperLimit: 60, // When abow it turns off
//  maxEffect: 1000, // Watts
//  state: state.KEEP_TEMP, // 0 = off, 1 = KEEP_TEMP, 2 = full power
//}
//addWaterHeater(myWaterHeater1);
//
//let myWaterHeater2 = {
//  id: 2,
//  type: "WaterHeater",
//  currentTemp: 76, // Current temperature
//  lowerLimit: 60, // When under it should start
//  upperLimit: 90, // When abow it turns off
//  maxEffect: 1000, // Watts
//  state: state.OFF, // 0 = off, 1 = KEEP_TEMP, 2 = full power
//}
//addWaterHeater(myWaterHeater2);
let waterHeaterAncher;
//updateWaterHeater(myWaterHeater2);

function updateWaterHeater(device) {
  waterHeaterAncher = document.getElementById(("device" + device.id)).children[0].children[2];
  setCurrTemp(device);
  setCurrPower(device);
  setCurrState(device);
}

function setCurrTemp(device) {
  getCurrTemp().innerHTML = device.currentTemp;
}

function getCurrTemp() {
  return waterHeaterAncher.children[0].children[1];
}

function setCurrPower(device) {
  let value = getCurrPower();
  if (device.state == state.ON) {
    value.innerHTML = "1000"
  } else if (device.state == state.KEEP_TEMP) {
    value.innerHTML = "10"
  } else {
    value.innerHTML = "0"
  }
}

function getCurrPower() {
  return waterHeaterAncher.children[1].children[1];
}

function setCurrState(device) {
  let value = getCurrState();
  let unit = getCurrStateUnit();
  if (device.state == state.ON) {
    value.innerHTML = "on"
    unit.innerHTML = " ↑";
  } else if (device.state == state.KEEP_TEMP) {
    value.innerHTML = "keep"
    unit.innerHTML = " →";
  } else {
    value.innerHTML = "off"
    unit.innerHTML = " ↓";
  }
}

function getCurrState() {
  return waterHeaterAncher.children[2].children[1];
}

function getCurrStateUnit() {
  return waterHeaterAncher.children[2].children[2];
}

function addWaterHeater(device) {
  let devicesNode = document.getElementById("serverDevices");
  let waterHeater = buildWaterHeaterHTML(device);
  devicesNode.appendChild(waterHeater);
}

function buildWaterHeaterHTML(device) {
  let waterHeaterNode = document.createElement("section");
  waterHeaterNode.id = "device" + device.id;
  waterHeaterNode.setAttribute("onClick", "displayDeviceSetting(" + "device" + device.id + ")");

  let header = buildWaterHeaterHeader(device);
  waterHeaterNode.appendChild(header);
  let settings = buildWaterHeaterSettings(device);
  waterHeaterNode.appendChild(settings);

  return waterHeaterNode;
}

function buildWaterHeaterHeader(device) {
  let header = document.createElement("header");

  let div = document.createElement("div");
  header.appendChild(div);
  let img = document.createElement("img");
  div.appendChild(img);
  img.setAttribute("src", "/images/waterheaterIcon.svg");
  img.setAttribute("alt", device.type);

  let name = document.createElement("h3");
  header.appendChild(name);
  name.innerHTML = device.type + " " + (device.id + 1);

  let description = buildWaterHeaterDescription(device);
  header.appendChild(description);

  return header;
}

function buildWaterHeaterDescription(device) {
  let ancher = document.createElement("ul");

  let list = document.createElement("li");
  let name = document.createElement("p");
  name.innerHTML = "Temp: ";
  let value = document.createElement("p");
  value.innerHTML = device.currentTemp;
  let unit = document.createElement("p");
  unit.innerHTML = "℃";
  list.appendChild(name);
  list.appendChild(value);
  list.appendChild(unit);
  ancher.appendChild(list);

  list = document.createElement("li");
  name = document.createElement("p");
  name.innerHTML = "Power: ";
  value = document.createElement("p");
  if (device.state == state.ON) {
    value.innerHTML = "1000"
  } else if (device.state == state.KEEP_TEMP) {
    value.innerHTML = "10"
  } else {
    value.innerHTML = "0"
  }
  unit = document.createElement("p");
  unit.innerHTML = " watt";
  list.appendChild(name);
  list.appendChild(value);
  list.appendChild(unit);
  ancher.appendChild(list);

  list = document.createElement("li");
  name = document.createElement("p");
  name.innerHTML = "Status: ";
  value = document.createElement("p");
  unit = document.createElement("p");
  if (device.state == state.ON) {
    value.innerHTML = "on"
    unit.innerHTML = " ↑";
  } else if (device.state == state.KEEP_TEMP) {
    value.innerHTML = "keep"
    unit.innerHTML = " →";
  } else {
    value.innerHTML = "off"
    unit.innerHTML = " ↓";
  }
  list.appendChild(name);
  list.appendChild(value);
  list.appendChild(unit);
  ancher.appendChild(list);

  return ancher;
}

function buildWaterHeaterSettings(device) {
  let section = document.createElement("section");
  let title = document.createElement("h3");
  section.appendChild(title);
  title.innerHTML = "Settings";
  let specs = document.createElement("section");
  section.appendChild(specs);
  title = document.createElement("h4");
  specs.appendChild(title);
  title.innerHTML = "spec:";

  let ancher = document.createElement("ul");
  specs.appendChild(ancher);

  let list = document.createElement("li");
  list.setAttribute("class", "minMaxTemp");
  let name = document.createElement("p");
  name.innerHTML = "Temp: ";
  let val1 = document.createElement("p");
  val1.innerHTML = device.lowerLimit;
  let val2 = document.createElement("p");
  val2.innerHTML = device.upperLimit;
  let unit = document.createElement("p");
  unit.innerHTML = "℃";
  list.appendChild(name);
  list.appendChild(val1);
  list.innerHTML += " - ";
  list.appendChild(val2);
  list.appendChild(unit);
  ancher.appendChild(list);

  list = document.createElement("li");
  list.setAttribute("class", "minMaxEffect");
  name = document.createElement("p");
  name.innerHTML = "Power: ";
  val1 = document.createElement("p");
  val1.innerHTML = 0;
  val2 = document.createElement("p");
  val2.innerHTML = device.maxEffect;
  unit = document.createElement("p");
  unit.innerHTML = "watt";
  list.appendChild(name);
  list.appendChild(val1);
  list.innerHTML += " - ";
  list.appendChild(val2);
  list.appendChild(unit);
  ancher.appendChild(list);

  return section;
}