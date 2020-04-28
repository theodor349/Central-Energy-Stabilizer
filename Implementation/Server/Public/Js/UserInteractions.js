




function displayDeviceSetting(id){
    deviceSettings = id.children[1];

    if(deviceSettings.style.transform == "scaleY(1)"){
        deviceSettings.style.transform = "scaleY(0)";
        deviceSettings.style.height = 0;
    }

    else{
        deviceSettings.style.transform = "scaleY(1)";
        deviceSettings.style.height = "100px";
    }

}
