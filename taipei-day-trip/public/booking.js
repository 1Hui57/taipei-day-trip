// 載入頁面
document.addEventListener("DOMContentLoaded", async function (){
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
        signinBtn.classList.add("display-none");
        signOutBtn.classList.remove("display-none");
        signOutBtn.addEventListener('click',function(){
        localStorage.removeItem("token");
        window.location.reload();
        })
        // 取得使用者資料
        let userId = userData["data"]["id"];
        let userName =  userData["data"]["name"];
        let userEmail =  userData["data"]["email"];
        // 送出GET方法 /api/booking連線
        const bookingResponse = await fetch("/api/booking",{
            method:"GET",
            headers:{
            "Content-Type": "application/json",
            "Authorization": token? `Bearer ${token}`:"" 
            }
        })
        // 得到後端回傳資料
        let bookingData = await bookingResponse.json();
        if(bookingData["data"]){
            console.log(bookingData["data"]);
            // 整理得到的預訂資料
            let attractionId = bookingData["data"]["attraction"]["id"];
            let attractionName = bookingData["data"]["attraction"]["name"];
            let attractionAddress = bookingData["data"]["attraction"]["address"];
            let attractionImage = bookingData["data"]["attraction"]["image"];
            let booingDate = bookingData["data"]["date"];
            let bookingTime = bookingData["data"]["time"];
            let bookingPrice = bookingData["data"]["price"];
            // 渲染得到的資料
            // 您好，Melody，待預定的行程如下：
            let headline__text_container = document.querySelector(".headline__text-container");
            let newSpan = document.createElement("span");
            let newWelcomeText = document.createTextNode(`您好，${userName}，待預訂的行程如下：`);
            newSpan.appendChild(newWelcomeText);
            headline__text_container.appendChild(newSpan);
            //渲染圖片
            let section__picture__img = document.querySelector(".section__picture__img");
            section__picture__img.src = attractionImage;
            //預訂資料
            let section__infor__titleDOM = document.querySelector(".section__infor__title");
            let newAttractionTitleText = document.createTextNode(`台北一日遊：${attractionName}`)
            section__infor__titleDOM.appendChild(newAttractionTitleText);
            //日期
            let bookingDateDOM = document.getElementById("bookingDate");
            let newbookingDateText = document.createTextNode(`日期：${booingDate}`);
            bookingDateDOM.appendChild(newbookingDateText);
            //時間
            let bookingTimeText = bookingTime==="morning"? "早上 8 點至中午 12 點":"下午 1 點至下午 5 點";
            let bookingTimeDOM = document.getElementById("bookingTime");
            let newbookingTimeText = document.createTextNode(`時間：${bookingTimeText}`);
            bookingTimeDOM.appendChild(newbookingTimeText);
            //費用
            let bookingPriceDOM = document.getElementById("bookingPrice");
            let newbookingPriceText = document.createTextNode(`費用：新台幣 ${bookingPrice} 元`);
            bookingPriceDOM.appendChild(newbookingPriceText);
            //地點
            let bookingAddressDOM = document.getElementById("bookingAddress");
            let newbookingAddressText = document.createTextNode(`地點： ${attractionAddress} `);
            bookingAddressDOM.appendChild(newbookingAddressText);
            //使用者聯絡資料 姓名&信箱
            let userNameDOM = document.getElementById("userName");
            userNameDOM.placeholder=userName;
            let userEmailDOM = document.getElementById("userEmail");
            userEmailDOM.placeholder=userEmail;
        }
        

    }
    // 如資料為None，代表未登入系統，回到首頁
    else{
        window.location.href ="/";
    }
})

// 回首頁按鈕
document.getElementById("backToIndex").addEventListener('click',function(){
    window.location.href ="/";
  })