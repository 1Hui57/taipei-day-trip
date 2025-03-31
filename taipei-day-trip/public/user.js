// // 使用者註冊
// let UserSignUpButton = document.getElementById("dialogSignUpBtn");
// let dialog_sign__main__container_signup = document.querySelector(".dialog-sign__main__container--signup");
// // 監聽註冊按鈕
// UserSignUpButton.addEventListener("click", async function(){
//     let signUpUserName = document.getElementById("signUpName").value;
//     let signUpUserEmail = document.getElementById("signUpEmail").value;
//     let signUpUserPassword = document.getElementById("signUpPassword").value;
//     removeAlert();
//     // 如任何欄位空白，出現警告
//     if (!signUpUserName|| !signUpUserEmail || !signUpUserPassword){
//         showAlert("請輸入姓名、信箱及密碼以註冊帳號。",dialog_sign__main__container_signup,UserSignUpButton);
//         return;
//     }
//     // 如有輸入資料，送出連線至後端確認
//     try{
//         let response = await fetch("/api/user", {
//          method:"POST",
//          headers:{"Content-Type": "application/json"},
//          body:JSON.stringify({
//             name:signUpUserName,
//             email:signUpUserEmail,
//             password:signUpUserPassword
//          })
//         });
//         let data = await response.json();
//         console.log(data);
//         if(data["ok"]){
//             showAlert("註冊成功，請登入。",dialog_sign__main__container_signup,UserSignUpButton);
//         }
//         else if(data["error"]){
//             showAlert(data["message"],dialog_sign__main__container_signup,UserSignUpButton);
//         }
//         }
//     catch(error){
//         showAlert(data["message"],dialog_sign__main__container_signup,UserSignUpButton);
//     }
//     }
// )

// // 使用者登入
// let UserSignInBtn = document.getElementById("dialogSignInBtn");
// let dialog_sign__main__container_signin = document.querySelector(".dialog-sign__main__container--signin");
// UserSignInBtn.addEventListener('click', async function(){
//     let signInUserEmail = document.getElementById("signInEmail").value;
//     let signInUserPassword = document.getElementById("signInPassword").value;
//     removeAlert();
//     if( !signInUserEmail || !signInUserPassword){
//         showAlert("請輸入信箱及密碼。",dialog_sign__main__container_signin,UserSignInBtn);
//         return;
//     }
//     try{
//         let response = await fetch("/api/user/auth", {
//          method:"PUT",
//          headers:{"Content-Type": "application/json"},
//          body:JSON.stringify({
//             email:signInUserEmail,
//             password:signInUserPassword
//          })
//         });
//         let data = await response.json();
//         if(data["token"]){
//             return ; //登入token並回首頁
//         }
//         else if(data["error"]){
//             showAlert(data["message"],dialog_sign__main__container_signin,UserSignInBtn);
//         }
//         }
//     catch(error){
//         showAlert(data["message"],dialog_sign__main__container_signin,UserSignInBtn);
//     }
// })

// function showAlert(text, parentDOM, beforeChildDOM){
//     let signAlert = document.createElement("div");
//     let alertText = document.createTextNode(text);
//     signAlert.className="Body_Med_16_500";
//     signAlert.style.color="red";
//     signAlert.id="signAlert";
//     signAlert.appendChild(alertText);
//     parentDOM.insertBefore(signAlert,beforeChildDOM);
// }


// function removeAlert() {
//     let signAlert = document.getElementById("signAlert");
//     if (signAlert) signAlert.remove();
// }

