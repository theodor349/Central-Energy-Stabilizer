'use strict';

const state = {
    OFF: 0,
    ON: 1,
}


/*
    SECTION: testing functions
*/

let testDevice = {
    Id: "323123",
}

addDevice(testDevice);

/*
    SECTION: adding, deleting and updating entire devices
*/

function removeDevice(serverDevice) {
    let deviceElem = document.getElementById(("device" + device.Id));
    deviceElem.parentNode.removeChild(deviceElem);
}

function addDevice(serverDevice) {
    let devicesContainer = document.getElementById("serverDevices");
    let device = buildDeviceInHTML(serverDevice);
    devicesContainer.appendChild(device);
}

function updateDevice(serverDevice) {
    getDeviceAncher(device);

    // should be dymanic
    setCurrTemp(device);
    setCurrPower(device);
    setCurrState(device);
}

/*
    SECTION: get functions
*/

function getDevicePropertyContainer(device) {
    return document.getElementById(("device" + device.Id)).children[0].children[2];
}

function getCurrState(device) {
    let devicePropertyContainer = getDevicePropertyContainer(device);
    return devicePropertyContainer.children[2].children[1];
}

function getCurrPower(device) {
    let devicePropertyContainer = getDevicePropertyContainer(device);
    return devicePropertyContainer.children[1].children[1];
}

function getCurrStateUnit(device) {
    let devicePropertyContainer = getDevicePropertyContainer(device);
    return devicePropertyContainer.children[2].children[2];
}

function getCurrTemp(device) {
    let devicePropertyContainer = getDevicePropertyContainer(device);
    return devicePropertyContainer.children[0].children[1];
}

/*
    SECTION: set functions
*/

function setCurrTemp(device) {
    getCurrTemp().innerHTML = device.currentTemp;
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

function setCurrState(device) {
    let value = getCurrState();
    let unit = getCurrStateUnit();
    if (device.state == state.ON) {
        value.innerHTML = "on"
        unit.innerHTML = " ↑";
    } else {
        value.innerHTML = "off"
        unit.innerHTML = " ↓";
    }
}

/*
    SECTION: html generating functions
*/


function buildDeviceInHTML(device) {
    let deviceContainer = document.createElement("section");
    deviceContainer.id = "device" + device.Id;
    deviceContainer.setAttribute("onClick", "displayDeviceSetting(" + "device" + device.Id + ")");

    let header = buildDeviceHeader(device);
    deviceContainer.appendChild(header);
    let settings = buildDeviceSettings(device);
    deviceContainer.appendChild(settings);

    return deviceContainer;
}

function buildDeviceHeader(device) {
    let header = document.createElement("header");

    let div = document.createElement("div");
    header.appendChild(div);

    let img = document.createElement("img");
    div.appendChild(img);

    // should be dymanic
    img.setAttribute("src", "./Images/waterheaterIcon.svg");
    img.setAttribute("alt", device.type);

    let name = document.createElement("h3");
    name.innerHTML = device.type + " " + (device.Id + 1);
    header.appendChild(name);

    let description = buildDeviceDescription(device);
    header.appendChild(description);

    return header;
}

function buildDeviceDescription(device) {
    let list = document.createElement("ul");
    let listItem = document.createElement("li");
    let name = document.createElement("p");
    name.innerHTML = "Temp: ";

    let value = document.createElement("p");
    value.innerHTML = device.currentTemp;

    let unit = document.createElement("p");
    unit.innerHTML = "℃";

    listItem.appendChild(name);
    listItem.appendChild(value);
    listItem.appendChild(unit);
    list.appendChild(listItem);

    listItem = document.createElement("li");
    name = document.createElement("p");
    name.innerHTML = "Power: ";
    value = document.createElement("p");
    value.innerHTML = device.currentPower;
    unit = document.createElement("p");
    unit.innerHTML = " watt";

    listItem.appendChild(name);
    listItem.appendChild(value);
    listItem.appendChild(unit);
    list.appendChild(listItem);

    list = document.createElement("li");
    name = document.createElement("p");
    name.innerHTML = "Status: ";
    value = document.createElement("p");
    unit = document.createElement("p");
    if (device.state == state.ON) {
        value.innerHTML = "on";
        unit.innerHTML = " ↑";
    } else {
        value.innerHTML = "off";
        unit.innerHTML = " ↓";
    }

    listItem.appendChild(name);
    listItem.appendChild(value);
    listItem.appendChild(unit);
    list.appendChild(listItem);

    return list;
}

function buildDeviceSettings(device) {
    let section = document.createElement("section");
    let title = document.createElement("h3");
    section.appendChild(title);
    title.innerHTML = "Settings";
    let specs = document.createElement("section");
    section.appendChild(specs);
    title = document.createElement("h4");
    specs.appendChild(title);
    title.innerHTML = "spec:";

    let list = document.createElement("ul");
    specs.appendChild(list);

    // should be dynamic
    let listItem = document.createElement("li");
    listItem.setAttribute("class", "minMaxTemp");
    let name = document.createElement("p");
    name.innerHTML = "Temp: ";
    let val1 = document.createElement("p");
    val1.innerHTML = device.lowerLimit;
    let val2 = document.createElement("p");
    val2.innerHTML = device.upperLimit;
    let unit = document.createElement("p");
    unit.innerHTML = "℃";

    listItem.appendChild(name);
    listItem.appendChild(val1);

    listItem.innerHTML += " - ";

    listItem.appendChild(val2);
    listItem.appendChild(unit);
    list.appendChild(listItem);

    listItem = document.createElement("li");
    listItem.setAttribute("class", "minMaxEffect");
    name = document.createElement("p");
    name.innerHTML = "Power: ";
    val1 = document.createElement("p");
    val1.innerHTML = 0;
    val2 = document.createElement("p");
    val2.innerHTML = device.maxEffect;
    unit = document.createElement("p");
    unit.innerHTML = "watt";

    listItem.appendChild(name);
    listItem.appendChild(val1);

    listItem.innerHTML += " - ";

    listItem.appendChild(val2);
    listItem.appendChild(unit);
    list.appendChild(listItem);

    return section;
}