// 宣告變數
let userId;
let userName;
let userEmail;

//取得要求字串的訂單編號
let params = new URLSearchParams(window.location.search);
const order_no = params.get("number");

// 網頁載入
document.addEventListener("DOMContentLoaded", async function () {
    // 檢查是否有登入token
    let token = localStorage.getItem("token");
    // 送出連線，有token則送出，沒有則無
    let userResponse = await fetch("/api/user/auth",{
      method:"GET",
      headers:{
        "Content-Type": "application/json",
        "Authorization": token? `Bearer ${token}`:"" 
      }
    });
    // 得到後端回傳資料{"data":{"id":1....}}or{"data":None}
    let userData = await userResponse.json();
    let signinBtn = document.getElementById("signinBtn");
    let signOutBtn = document.getElementById("signOutBtn");
    // 如有資料代表使用者為登入狀態，顯示登出按鈕
    if(userData.data){
        // 取得使用者資料
        userId = userData["data"]["id"];
        userName =  userData["data"]["name"];
        userEmail =  userData["data"]["email"];
        signinBtn.classList.add("display-none");
        signOutBtn.classList.remove("display-none");
        signOutBtn.addEventListener('click',function(){
            localStorage.removeItem("token");
            window.location.href ="/";
        })
    }
    // 如資料為None，代表未登入系統，回首頁
    else{
        window.location.href ="/";
    }

    // 送出連線取得訂單資料
    let orderResponse = await fetch(`/api/orders/${order_no}`,{
        method:"GET",
        headers:{
          "Content-Type": "application/json",
          "Authorization": token? `Bearer ${token}`:"" 
        }
    });
    let orderData = await orderResponse.json();
    let data = orderData["data"];
    // 整理取得的訂單資料
    let orderPrice = data["price"];
    let orderAttractionName = data["trip"]["attraction"]["name"];
    let orderAttrActionAddress = data["trip"]["attraction"]["address"];
    let orderAttractionImage = data["trip"]["attraction"]["image"];
    let orderDate = data["trip"]["date"];
    let orderTime = data["trip"]["time"];
    let orderContactName = data["contact"]["name"];
    let orderContactEmail = data["contact"]["email"];
    let orderContactPhone = data["contact"]["phone"];
    let orderStatus = data["status"];
    let orderUserId = data["userId"];
    // 如果status=0為付款，反之
    let statusMsg = orderStatus===0? "已確認付款":"尚未付款";
    // 如果orderTime是afternoon
    let timeMsg = orderTime==="morning"? "早上 8 點至中午 12 點":"下午 1 點至下午 5 點";
    // 如果登入的使用者與建立訂單的使用者為同一人，渲染畫面
    if(orderUserId===userId){
        // 訂單編號及付款狀態
        let statusText = document.getElementById("statusText");
        let newStatusText = document.createTextNode(`您好，${userName}，您的訂單 ${order_no} ${statusMsg}。`);
        statusText.appendChild(newStatusText);
        // 景點圖片
        let info__image__img = document.querySelector(".info__image--img");
        info__image__img.src=orderAttractionImage;
        // 景點資料
        let attractionName = document.getElementById("attractionName");
        let newAttractionNameText = document.createTextNode(`景點：${orderAttractionName}`);
        attractionName.appendChild(newAttractionNameText);

        let attractionAddress = document.getElementById("attractionAddress");
        let newAttractionAddressText = document.createTextNode(`地址：${orderAttrActionAddress}`);
        attractionAddress.appendChild(newAttractionAddressText);

        let date =  document.getElementById("date");
        let newDateText = document.createTextNode(`日期：${orderDate}`);
        date.appendChild(newDateText);

        let time = document.getElementById("time");
        let newTimeText = document.createTextNode(`時間：${timeMsg}`);
        time.appendChild(newTimeText);

        let price = document.getElementById("price");
        let newPriceText = document.createTextNode(`訂單金額：${orderPrice} 元`);
        price.appendChild(newPriceText);

        let name = document.getElementById("name");
        let newNameText = document.createTextNode(`姓名：${orderContactName}`);
        name.appendChild(newNameText);

        let phone = document.getElementById("phone");
        let newPhoneText = document.createTextNode(`電話：${orderContactPhone}`);
        phone.appendChild(newPhoneText);

        let email = document.getElementById("email");
        let newEmailText = document.createTextNode(`電話：${orderContactEmail}`);
        email.appendChild(newEmailText);
    }
    // 下單使用者與登入使用者不同，無法顯示訂單資訊
    else{
        let thankyou = document.querySelector(".thankyou");
        let thankyou__info = document.querySelector(".thankyou__info");
        thankyou.removeChild(thankyou__info);
        let statusText = document.getElementById("statusText");
        let newStatusText = document.createTextNode(`您好，${userName}，此筆訂單無法顯示。`);
        statusText.appendChild(newStatusText);
    }
});

// 回首頁按鈕
document.getElementById("backToIndex").addEventListener('click',function(){
    window.location.href ="/";
})