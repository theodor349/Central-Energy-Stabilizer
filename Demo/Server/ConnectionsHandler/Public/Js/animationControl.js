console.log(windmillList=document.querySelectorAll("section.windmill"))
for (let i = 0; i < windmillList.length; i++) {
    windmillList[i].children[1].style.animationDuration = "1ms";
}
