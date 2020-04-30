function displayDeviceSetting(id) {

    deviceContainer = document.getElementById(id);
    deviceSettings = deviceContainer.children[1];


    if (deviceSettings.style.transform == "scaleY(1)") {
        deviceSettings.style.transform = "scaleY(0)";
        deviceSettings.style.height = "0";
        deviceSettings.style.padding = "0";
    } else {
        deviceSettings.style.transform = "scaleY(1)";
        deviceSettings.style.height = "auto";
        deviceSettings.style.padding = "10px";
        setTimeout(function() {
            setCorrectHeightValue();
        }, 40);
    }
}

function setCorrectHeightValue() {
    let newHeight = deviceSettings.clientHeight;
    deviceSettings.style.height = newHeight + "px";
}