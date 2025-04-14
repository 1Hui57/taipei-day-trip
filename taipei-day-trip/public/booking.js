
// 會用到的變數
let attractionId;
let attractionName;
let attractionAddress;
let attractionImage;
let booingDate;
let bookingTime;
let bookingPrice;
let userId;
let userName;
let userEmail;
let userPhone;

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
        userId = userData["data"]["id"];
        userName =  userData["data"]["name"];
        userEmail =  userData["data"]["email"];
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
        //如果沒有預定資料，渲染沒有預定資料的頁面
        if (bookingData["data"]===null){
            // 渲染標題:還沒有預定行程
            let headline__text_container = document.querySelector(".headline__text-container");
            let newSpan = document.createElement("span");
            let newWelcomeText = document.createTextNode(`您好，${userName}，您目前還沒有預定行程唷`);
            newSpan.appendChild(newWelcomeText);
            headline__text_container.appendChild(newSpan);
            // 渲染圖片
            let section__picture__img = document.querySelector(".section__picture__img");
            section__picture__img.src = "/public/picture/no-bookingPicture.jpg";
            // 刪除景點資訊部分
            let section__infor = document.querySelector(".section__infor");
            section__infor.remove();
            // 隱藏"刪除按鈕"
            let section__delete = document.querySelector(".section__delete");
            section__delete.classList.add("display-none");
            // // 隱藏個人資訊DOM
            // let contactForm = document.querySelector(".contact-form");
            // let payment = document.querySelector(".payment");
            // contactForm.classList.add("display-none");
            // payment.classList.add("display-none");
            // // 隱藏分隔線
            // let booking__hr = document.querySelectorAll(".booking__hr");
            // booking__hr.forEach(element=>{
            //     element.classList.add("display-none")
            // });
            // 隱藏確認訂購部分DOM
            let confirm = document.querySelector(".confirm");
            confirm.classList.add("display-none");

        }
        // 有預訂資料，渲染畫面
        else if(bookingData["data"]){
            console.log(bookingData);
            // 整理得到的預訂資料
            attractionId = bookingData["data"]["attraction"]["id"];
            attractionName = bookingData["data"]["attraction"]["name"];
            attractionAddress = bookingData["data"]["attraction"]["address"];
            attractionImage = bookingData["data"]["attraction"]["image"];
            booingDate = bookingData["data"]["date"];
            bookingTime = bookingData["data"]["time"];
            bookingPrice = bookingData["data"]["price"];
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
            //使用者聯絡資料 姓名&信箱，以value添加而不是placeholder
            let userNameDOM = document.getElementById("userName");
            userNameDOM.value=userName;
            let userEmailDOM = document.getElementById("userEmail");
            userEmailDOM.value=userEmail;
        }
    }
    // 如使用者資料為None，代表未登入系統，回到首頁
    else{
        window.location.href ="/";
    }
})

// 回首頁按鈕
document.getElementById("backToIndex").addEventListener('click',function(){
    window.location.href ="/";
  })

// 刪除目前預定按鈕
let deleteBookingBtn = document.getElementById("deleteBookingBtn");
deleteBookingBtn.addEventListener('click',async function(){
    let token = localStorage.getItem("token");
    let deleteResponse = await fetch("/api/booking",{
        method:"DELETE",
        headers:{
            "Content-Type": "application/json",
            "Authorization": token? `Bearer ${token}`:"" 
        }
    })
    let deleteData = await deleteResponse.json();
    window.location.href ="/booking";
})

// tap pay程式區塊
TPDirect.setupSDK(159806, 'app_lOIzSdM7vPHElll1lTMRZe8nJPmA3yfQ7unbRmbXpoZI2UtjuuqYvZ9udKrV', 'sandbox');

// Display ccv field
let fields = {
    number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****'
    },
    expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY'
    },
    ccv: {
        element: '#card-ccv',
        placeholder: 'CCV'
    }
};
// 設定外觀
TPDirect.card.setup({
    fields: fields,
    styles: {
        // Style all elements
        'input': {
            'color': '#666666'
        },
        // Styling ccv field
        'input.ccv': {
            'font-size': '16px','font-weight':'500','font-family':"Noto Sans TC"
        },
        // Styling expiration-date field
        'input.expiration-date': {
            'font-size': '16px','font-weight':'500','font-family':"Noto Sans TC"
        },
        // Styling card-number field
        'input.card-number': {
            'font-size': '16px','font-weight':'500','font-family':"Noto Sans TC"
        },
        // style focus state
        ':focus': {
            'color': 'black'
        },
        // style valid state
        '.valid': {
            'color': 'green'
        },
        // style invalid state
        '.invalid': {
            'color': 'red'
        },
        // Media queries
        // Note that these apply to the iframe, not the root window.
        '@media screen and (max-width: 400px)': {
            'input': {
                'color': 'orange'
            }
        }
    },
    // 此設定會顯示卡號輸入正確後，會顯示前六後四碼信用卡卡號
    isMaskCreditCardNumber: true,
    maskCreditCardNumberRange: {
        beginIndex: 0,
        endIndex: 11
    }
}
)

// 按下按鈕送出信用卡資訊
document.getElementById("paymentBtn").addEventListener('click',async function(){

    // 取得輸入的手機號碼
    userPhone = document.getElementById("userPhone").value;
    // 取得 TapPay Fields 的 status
    const tappayStatus = TPDirect.card.getTappayFieldsStatus();

    // 確認是否可以 getPrime
    if (tappayStatus.canGetPrime === false) {
        alert('請輸入正確信用卡資訊ˋ^ˊ')
        return
    }
    // Get prime
    TPDirect.card.getPrime(async function(result){
        // 如果得到錯誤
        if (result.status !== 0) {
            alert('get prime error ' + result.msg)
            return
        }
        // 如果卡號正確，獲得prime
        alert('get prime 成功，prime: ' + result.card.prime)
        let token = localStorage.getItem("token");
        let orderResponse = await fetch("/api/orders",{
            method:"POST",
            headers:{
            "Content-Type": "application/json",
            "Authorization": token? `Bearer ${token}`:"" 
            },
            body:JSON.stringify({
                "prime":result.card.prime,
                "order":{
                    "price":bookingPrice,
                    "trip":{
                        "attraction":{
                            "id":attractionId,
                            "name":attractionName,
                            "address":attractionAddress,
                            "image":attractionImage
                        },
                        "date":booingDate,
                        "time":bookingTime
                    },
                    "contact":{
                        "name":userName,
                        "email":userEmail,
                        "phone":userPhone
                    }
                }
            })
        });
        let orderData = await response.json();

    });
})