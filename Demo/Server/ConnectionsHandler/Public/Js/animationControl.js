function updateWindmillSpeed(meterPerSecond) {
windmillList = document.querySelectorAll("section.windmill")
for (let i = 0; i < windmillList.length; i++) {
    windmillList[i].children[1].style.animationDuration = (31 - meterPerSecond) / 10 + "s";
    }
}
