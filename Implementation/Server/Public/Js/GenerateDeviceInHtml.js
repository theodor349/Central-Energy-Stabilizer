'use strict';

/*
    SECTION: device type definitions
*/

let waterHeater = {
    imageSrc: "./Images/waterheaterIcon.svg",
    headerProperties: ["currentTemp", "currentPower", "currentStatus"]
};

/*
    SECTION: testing functions
*/

let testDevice = {
    Id: "2222",
    isAutomatic: true,
    deviceType: "Water Heater",
    state: "on",
    uniqueProperties: {
        minTemp: 55,
        maxTemp: 90,
        currentPower: 1299,
        currentTemp: 66
    }
}

let testDeviceUpdate = {
    Id: "2222",
    isAutomatic: true,
    deviceType: "Water Heater",
    state: "off",
    uniqueProperties: {
        minTemp: 55,
        maxTemp: 90,
        currentPower: 0,
        currentTemp: 90
    }
}

addDevice(testDevice);
updateDevice(testDeviceUpdate);

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
    switch (serverDevice.deviceType) {
        case "Water Heater":
            waterHeater.headerProperties.forEach((propertyItem, propertyIdex) => {
                updateHeaderProperty(propertyItem, propertyIdex, serverDevice);
            });
            break;

        default:
            console.warn("Warning: Can't find header properties for " + device.deviceType);
            break;
    }
}

/*
    SECTION: get html element functions
*/

function getDevicePropertyContainer(device) {
    return document.getElementById(("device" + device.Id)).children[0].children[2];
}

/*
    SECTION: update html element functions
*/

function updateHeaderProperty(propertyItem, propertyIndex, device) {
    let devicePropertyContainer = getDevicePropertyContainer(device);
    let propertyContainer = devicePropertyContainer.children[propertyIndex];

    let property = getPropertyInformation(device, propertyItem);

    propertyContainer.children[0].innerHTML = property.name + ": ";
    propertyContainer.children[1].innerHTML = property.value;
    propertyContainer.children[2].innerHTML = " " + property.unit;
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

    let img = setDeviceImage(device);
    div.appendChild(img);

    let name = document.createElement("h3");
    name.innerHTML = device.deviceType;
    header.appendChild(name);

    let description = buildHeaderProperties(device);
    header.appendChild(description);

    return header;
}

function setDeviceImage(device) {
    let img = document.createElement("img");

    switch (device.deviceType) {
        case "Water Heater":
            img.setAttribute("src", waterHeater.imageSrc);
            break;

        default:
            console.warn("Warning: can't find the image for " + device.deviceType);
    }
    img.setAttribute("alt", device.deviceType);
    return img;
}

function buildHeaderProperties(device) {
    let list = document.createElement("ul");

    switch (device.deviceType) {
        case "Water Heater":
            waterHeater.headerProperties.forEach((propertyItem) => {
                buildHeaderProperty(propertyItem, device, list);
            });
            break;

        default:
            console.warn("Warning: Can't find header properties for " + device.deviceType);
            break;
    }

    return list;
}

function buildHeaderProperty(propertyItem, device, list) {
    let listItem = document.createElement("li");
    let nameContainer = document.createElement("p");
    let valueContainer = document.createElement("p");
    let unitContainer = document.createElement("p");

    let property = getPropertyInformation(device, propertyItem);

    nameContainer.innerHTML = property.name + ": ";
    valueContainer.innerHTML = property.value;
    unitContainer.innerHTML = " " + property.unit;

    listItem.appendChild(nameContainer);
    listItem.appendChild(valueContainer);
    listItem.appendChild(unitContainer);
    list.appendChild(listItem);
}


function getPropertyInformation(device, propertyItem) {
    let property = {};

    switch (propertyItem) {
        case "currentTemp":
            property.name = "Temp";
            property.value = device.uniqueProperties.currentTemp;
            property.unit = "℃";
            break;

        case "currentPower":
            property.name = "Power";
            property.value = device.uniqueProperties.currentPower;
            property.unit = "Watt";
            break;

        case "currentStatus":
            property.name = "Status";
            property.value = device.state;

            if (device.state === "on") {
                property.unit = "↑";
            } else {
                property.unit = "↓";
            }
            break;

        default:
            console.warn("Warning: build for header property " + propertyItem + " Not defined");
            break;
    }
    return property;
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