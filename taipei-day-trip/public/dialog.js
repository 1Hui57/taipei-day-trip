let signinBtn = document.getElementById("signinBtn");
signinBtn.addEventListener('click',function(){
    let dialogSection = document.getElementById("dialog-section");
    dialogSection.classList.remove("display-none");
})

let dialogCloseBtn =document.getElementById("dialog-close-btn");

dialogCloseBtn.addEventListener('click',function(){
    console.log("成功點");
    let dialogSection = document.getElementById("dialog-section");
    dialogSection.classList.add("display-none");
})

