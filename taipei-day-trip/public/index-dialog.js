let signinBtn = document.getElementById("signinBtn");
signinBtn.addEventListener('click',function(){
    let dialogSectionSignin = document.getElementById("dialog-section--signin");
    dialogSectionSignin.classList.remove("display-none");
})

let dialogCloseBtnSignIn =document.getElementById("dialog-close-btn-signin");
dialogCloseBtnSignIn.addEventListener('click',function(){
    let dialogSectionSignin = document.getElementById("dialog-section--signin");
    dialogSectionSignin.classList.add("display-none");
})

let dialogCloseBtnSignUp =document.getElementById("dialog-close-btn-signup");
dialogCloseBtnSignUp.addEventListener('click',function(){
    let dialogSectionSignup = document.getElementById("dialog-section--signup");
    dialogSectionSignup.classList.add("display-none");
})

let signInSectionSignUpBtn = document.getElementById("signInSection-signUpBtn");
signInSectionSignUpBtn.addEventListener('click', function(){
    let dialogSectionSignin = document.getElementById("dialog-section--signin");
    dialogSectionSignin.classList.add("display-none");
    let dialogSectionSignup = document.getElementById("dialog-section--signup");
    dialogSectionSignup.classList.remove("display-none");
})

let signUpSectionSignUpBtn = document.getElementById("signUpSection-signInBtn");
signUpSectionSignUpBtn.addEventListener('click', function(){
    let dialogSectionSignup = document.getElementById("dialog-section--signup");
    dialogSectionSignup.classList.add("display-none");
    let dialogSectionSignin = document.getElementById("dialog-section--signin");
    dialogSectionSignin.classList.remove("display-none");
})



