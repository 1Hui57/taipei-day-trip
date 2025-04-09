let signinBtn = document.getElementById("signinBtn");
signinBtn.addEventListener('click',function(){
    let dialogSectionSignin = document.getElementById("dialog-section--signin");
    dialogSectionSignin.classList.remove("display-none");
    removeAlert();
})

let dialogCloseBtnSignIn =document.getElementById("dialog-close-btn-signin");
dialogCloseBtnSignIn.addEventListener('click',function(){
    let dialogSectionSignin = document.getElementById("dialog-section--signin");
    dialogSectionSignin.classList.add("display-none");
    removeAlert();
})

let dialogCloseBtnSignUp =document.getElementById("dialog-close-btn-signup");
dialogCloseBtnSignUp.addEventListener('click',function(){
    let dialogSectionSignup = document.getElementById("dialog-section--signup");
    dialogSectionSignup.classList.add("display-none");
    removeAlert();
})

let signInSectionSignUpBtn = document.getElementById("signInSection-signUpBtn");
signInSectionSignUpBtn.addEventListener('click', function(){
    let dialogSectionSignin = document.getElementById("dialog-section--signin");
    dialogSectionSignin.classList.add("display-none");
    let dialogSectionSignup = document.getElementById("dialog-section--signup");
    dialogSectionSignup.classList.remove("display-none");
    removeAlert();
})

let signUpSectionSignUpBtn = document.getElementById("signUpSection-signInBtn");
signUpSectionSignUpBtn.addEventListener('click', function(){
    let dialogSectionSignup = document.getElementById("dialog-section--signup");
    dialogSectionSignup.classList.add("display-none");
    let dialogSectionSignin = document.getElementById("dialog-section--signin");
    dialogSectionSignin.classList.remove("display-none");
    removeAlert();
})

// 使用者註冊
let UserSignUpButton = document.getElementById("dialogSignUpBtn");
let dialog_sign__main__container_signup = document.querySelector(".dialog-sign__main__container--signup");
// 設定 email 格式
const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
// 監聽註冊按鈕
UserSignUpButton.addEventListener("click", async function(){
    let signUpUserName = document.getElementById("signUpName").value;
    let signUpUserEmail = document.getElementById("signUpEmail").value;
    let signUpUserPassword = document.getElementById("signUpPassword").value;
    removeAlert();
    // 如任何欄位空白，出現警告
    if (!signUpUserName|| !signUpUserEmail || !signUpUserPassword){
        showAlert("請輸入姓名、信箱及密碼以註冊帳號。",dialog_sign__main__container_signup,UserSignUpButton);
        return;
    }
    else if(!emailRule.test(signUpUserEmail)){
        showAlert("請輸入正確信箱格式。",dialog_sign__main__container_signup,UserSignUpButton);
        return;
    }
    // 如有輸入資料，送出連線至後端確認
    try{
        let response = await fetch("/api/user", {
         method:"POST",
         headers:{"Content-Type": "application/json"},
         body:JSON.stringify({
            name:signUpUserName,
            email:signUpUserEmail,
            password:signUpUserPassword
         })
        });
        let data = await response.json();
        // console.log(data);
        if(data["ok"]){
            showAlert("註冊成功，請登入。",dialog_sign__main__container_signup,UserSignUpButton);
        }
        else if(data["error"]){
            showAlert(data["message"],dialog_sign__main__container_signup,UserSignUpButton);
        }
        }
    catch(error){
        showAlert(data["message"],dialog_sign__main__container_signup,UserSignUpButton);
    }
    }
)

// 使用者登入
let UserSignInBtn = document.getElementById("dialogSignInBtn");
let dialog_sign__main__container_signin = document.querySelector(".dialog-sign__main__container--signin");
UserSignInBtn.addEventListener('click', async function(){
    let signInUserEmail = document.getElementById("signInEmail").value;
    let signInUserPassword = document.getElementById("signInPassword").value;
    removeAlert();
    if( !signInUserEmail || !signInUserPassword){
        showAlert("請輸入信箱及密碼。",dialog_sign__main__container_signin,UserSignInBtn);
        return;
    }
    try{
        let response = await fetch("/api/user/auth", {
         method:"PUT",
         headers:{"Content-Type": "application/json"},
         body:JSON.stringify({
            email:signInUserEmail,
            password:signInUserPassword
         })
        });
        let data = await response.json();
        if(data["token"]){
            // console.log(data.token);
            localStorage.setItem("token", data.token); // 儲存 Token
            window.location.reload(); // 重新整理目前頁面
        }
        else if(data["error"]){
            showAlert(data["message"],dialog_sign__main__container_signin,UserSignInBtn);
        }
        }
    catch(error){
        showAlert(data["message"],dialog_sign__main__container_signin,UserSignInBtn);
    }
})

function showAlert(text, parentDOM, beforeChildDOM){
    let signAlert = document.createElement("div");
    let alertText = document.createTextNode(text);
    signAlert.className="Body_Med_16_500";
    signAlert.style.color="red";
    signAlert.id="signAlert";
    signAlert.appendChild(alertText);
    parentDOM.insertBefore(signAlert,beforeChildDOM);
}


function removeAlert() {
    let signAlert = document.getElementById("signAlert");
    if (signAlert) signAlert.remove();
}

// 預定按鈕
let navBookingBtn = document.getElementById("navBookingBtn");
navBookingBtn.addEventListener('click',async function(){
    let token = localStorage.getItem("token");
    let response = await fetch("/api/user/auth",{
        method:"GET",
        headers:{
            "Content-Type": "application/json",
            "Authorization": token? `Bearer ${token}`:""
        },
    })
    let data = await response.json();
    // console.log(data);
    if(data["data"]===null){
        let dialog_section__signin = document.getElementById("dialog-section--signin");
        // console.log(dialog_section__signin);
        dialog_section__signin.classList.remove("display-none");
    }
    else{
        window.location.href ="/booking";
    }
})