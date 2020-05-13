'use strict';

/*
    SECTION: device type definitions
*/

let waterHeater = {
    imageSrc: "./Images/waterheaterIcon.svg",
    headerProperties: ["currentTemp", "currentPower", "currentStatus"],
    settingsProperties: ["tempInterval", "maxPower", "deviceId"]
};

/*
    SECTION: device property definitions
*/

function getPropertyInformation(device, propertyItem) {
    let property = {};

    switch (propertyItem) {
        case "currentTemp":
            property.name = "Temp";
            if (device.uniqueProperties.currentTemp !== undefined) {
                property.value = device.uniqueProperties.currentTemp.toFixed(2);
            }
            property.value2 = null;
            property.unit = "℃";
            break;

        case "currentPower":
            property.name = "Power";
            if (device.currentPower !== undefined) {
                property.value = device.currentPower.toFixed(0);
            }
            property.value2 = null;
            property.unit = "Watt";
            break;

        case "currentStatus":
            property.name = "Status";
            property.value = device.currentState;
            property.value2 = null;
            if (device.currentState === "on") {
                property.unit = "↑";
            } else {
                property.unit = "↓";
            }
            break;

        case "tempInterval":
            property.name = "Temp";
            property.value = device.uniqueProperties.minTemp;
            property.value2 = device.uniqueProperties.maxTemp;
            property.unit = "℃";
            break;

        case "maxPower":
            property.name = "Max Power";
            if (device.maxPower !== undefined) {
                property.value = device.maxPower.toFixed(0);
            }
            property.value2 = null;
            property.unit = "Watt";
            break;

        case "deviceId":
            property.name = "Device ID";
            property.value = device.deviceId;
            property.value2 = null;
            property.unit = "";
            break;

        default:
            console.warn("Warning: build for property " + propertyItem + " Not defined");
            break;
    }

    if (property.name === undefined || property.value === undefined ||
        property.value2 === undefined || property.unit === undefined) {
        console.warn("Warning: build for property " + propertyItem + " missing definition");
    }

    return property;
}

/*
--------------------------------------------------------------------------------
END OF DEFINITIONS
________________________________________________________________________________
*/

/*
    SECTION: adding, deleting and updating devices
*/

function removeDevice(serverDevice) {
    let deviceElem = document.getElementById((device.deviceId));
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
            console.warn("Warning: Can't find header properties for " + serverDevice.deviceType);
            break;
    }
}

/*
    SECTION: get html element functions
*/

function getDevicePropertyContainer(device) {
    return document.getElementById((device.deviceId)).children[0].children[2];
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

    // update values according to amount of values presented
    if (property.value2 !== null) {
        propertyContainer.children[2].innerHTML = " – " + property.value2;
        propertyContainer.children[3].innerHTML = " " + property.unit;
    } else {
        propertyContainer.children[2].innerHTML = " " + property.unit;
    }

}


/*
    SECTION: html generating functions
*/


function buildDeviceInHTML(device) {
    let deviceContainer = document.createElement("section");
    deviceContainer.id = device.deviceId;
    deviceContainer.setAttribute("onClick", "displayDeviceSetting('" + device.deviceId + "')");

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
    name.innerHTML = device.name;
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
                buildProperty(propertyItem, device, list);
            });
            break;

        default:
            console.warn("Warning: Can't find header properties for " + device.deviceType);
            break;
    }

    return list;
}

function buildDeviceSettings(device) {
    let settingssection = document.createElement("section");
    let title = document.createElement("h3");
    title.innerHTML = "Settings";

    settingssection.appendChild(title);

    let specs = document.createElement("section");
    title = document.createElement("h4");
    title.innerHTML = "spec:";

    settingssection.appendChild(specs);
    specs.appendChild(title);

    let list = buildSettingsProperties(device);
    specs.appendChild(list);

    return settingssection;
}

function buildSettingsProperties(device) {
    let list = document.createElement("ul");

    switch (device.deviceType) {
        case "Water Heater":
            waterHeater.settingsProperties.forEach((propertyItem) => {
                buildProperty(propertyItem, device, list);
            });
            break;

        default:
            console.warn("Warning: Can't find settings properties for " + device.deviceType);
            break;
    }

    return list;
}

function buildProperty(propertyItem, device, list) {
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

    if (property.value2 !== null) {
        let valueContainer2 = document.createElement("p");
        valueContainer2.innerHTML = " – " + property.value2;
        listItem.appendChild(valueContainer2);
    }

    listItem.appendChild(unitContainer);
    list.appendChild(listItem);
}