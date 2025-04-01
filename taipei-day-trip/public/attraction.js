// 宣告會用到的變數
let attraction;
let imagesNum;

// 網頁載入，送出連線資料
document.addEventListener("DOMContentLoaded", async function () {
  // 取得當前頁面的 URL
  let url = window.location.pathname; // 例如 "/attraction/55"
  let id = url.split("/").pop(); // 取得attractionId
  let response = await fetch(`/api/attraction/${id}`);
  let data = await response.json();
  if(data["data"]){
    attraction = data["data"];
    imagesNum = attraction["images"].length;
    loadAttractionInfo();
  }
  else{
    noAtrractionData();
  }
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
  }
  // 如資料為None，代表未登入系統，顯示登入按鈕
  else{
    signinBtn.classList.remove("display-none");
    signOutBtn.classList.add("display-none");
  }
});

// 有景點資料，將fetch拿到的資料渲染到畫面上的函式
function loadAttractionInfo() {
  //渲染圖片
  let pictureCurrent = document.getElementById("pictureCurrent");
  let circleBox = document.querySelector(".attraction-section__circle-box");
  for (let i = 0; i < imagesNum; i++) {
    let newPictureWrapper = document.createElement("div");
    newPictureWrapper.className =
      "attraction-section__picture-current--wrapper";
    let newPictureImage = document.createElement("img");
    newPictureImage.className = "attraction-section__picture-current--img";
    newPictureImage.src = attraction["images"][i];
    newPictureWrapper.appendChild(newPictureImage);
    pictureCurrent.appendChild(newPictureWrapper);
    //渲染圖片圈圈數量
    let newSmallCircle = document.createElement("div");
    if(i===0){
      newSmallCircle.className="circle-box__small-circle circle-box__small-circle--change"
    }
    else{newSmallCircle.className="circle-box__small-circle circle-box__small-circle--origin";}
    circleBox.appendChild(newSmallCircle);
  }
  //景點名稱
  let profileName = document.getElementById("profileName");
  let newProfileNameText = document.createTextNode(attraction["name"]);
  profileName.appendChild(newProfileNameText);
  //景點種類&位置
  let profileCategory = document.getElementById("profileCategory");
  let newProfileCategoryText = document.createTextNode(
    `${attraction["category"]} at ${attraction["mrt"]}`
  );
  profileCategory.appendChild(newProfileCategoryText);
  //景點描述
  let inforsDescription = document.getElementById("inforsDescription");
  let newInforsDescriptionText = document.createTextNode(
    attraction["description"]
  );
  inforsDescription.appendChild(newInforsDescriptionText);
  //景點地址
  let inforsLocation = document.getElementById("inforsLocation");
  let newInforsLocationText = document.createTextNode(attraction["address"]);
  inforsLocation.appendChild(newInforsLocationText);
  //交通方式
  let inforsTraffic = document.getElementById("inforsTraffic");
  let attractionTransport = attraction["transport"].replace(/&nbsp;/g, "");
  let newInforsTrafficText = document.createTextNode(attractionTransport);
  inforsTraffic.appendChild(newInforsTrafficText);
}

// 沒有景點資料的畫面
function noAtrractionData(){
  let pictureCurrent = document.getElementById("pictureCurrent");
  let newPictureWrapper = document.createElement("div");
  newPictureWrapper.className = "attraction-section__picture-current--wrapper";
  let newPictureImage = document.createElement("img");
  newPictureImage.className = "attraction-section__picture-current--img";
  newPictureImage.src = "/public/picture/noAttraction.jpg";
  newPictureWrapper.appendChild(newPictureImage);
  pictureCurrent.appendChild(newPictureWrapper);
  //景點名稱
  let profileName = document.getElementById("profileName");
  let newProfileNameText = document.createTextNode("沒有資料");
  profileName.appendChild(newProfileNameText);
  //景點種類&位置
  let profileCategory = document.getElementById("profileCategory");
  let newProfileCategoryText = document.createTextNode("沒有資料");
  profileCategory.appendChild(newProfileCategoryText);
  //景點描述
  let inforsDescription = document.getElementById("inforsDescription");
  let newInforsDescriptionText = document.createTextNode("沒有資料");
  inforsDescription.appendChild(newInforsDescriptionText);
  //景點地址
  let inforsLocation = document.getElementById("inforsLocation");
  let newInforsLocationText = document.createTextNode("沒有資料");
  inforsLocation.appendChild(newInforsLocationText);
  //交通方式
  let inforsTraffic = document.getElementById("inforsTraffic");
  let newInforsTrafficText = document.createTextNode("沒有資料");
  inforsTraffic.appendChild(newInforsTrafficText);
  //處理預定按鈕
  let bookingButton = document.getElementById("bookingButton");
  bookingButton.style.display="none";
}

//調整價錢
let radioAM = document.getElementById("am");
let radioPM = document.getElementById("pm");
let price = document.getElementById("price");

radioAM.addEventListener("change", radioChangePrice);
radioPM.addEventListener("change", radioChangePrice);
function radioChangePrice() {
  price.innerHTML = "";
  if (radioAM.checked) {
    let priceText = document.createTextNode("新台幣 2000 元");
    price.appendChild(priceText);
  } else if (radioPM.checked) {
    let priceText = document.createTextNode("新台幣 2500 元");
    price.appendChild(priceText);
  }
}

// 圖片左右滑動效果
let cot = 0;
function imagesLeftScroll() {
  if (cot < imagesNum - 1) {
    let imagesScrollBar = document.querySelector(".attraction-section__picture-current");
    let imageWidth = document.querySelector(".attraction-section__pictureBar").offsetWidth;
    imagesScrollBar.style.transform = `translateX(-${(cot + 1) * imageWidth}px)`;
    cot++;
  }
}

function imagesRightScroll() {
  if (cot > 0) {
    let imagesScrollBar = document.querySelector(".attraction-section__picture-current");
    let imageWidth = document.querySelector(".attraction-section__pictureBar").offsetWidth;
    imagesScrollBar.style.transform = `translateX(-${(cot - 1) * imageWidth}px)`;
    cot--;
  }
}

let imageLeftArrow = document.querySelector( ".attraction-section__picture-leftArrow");
imageLeftArrow.addEventListener("click", function () {
  imagesRightScroll();
  circleChange();
});

let imageRightArrow = document.querySelector(".attraction-section__picture-rightArrow");
imageRightArrow.addEventListener("click", function () {
  imagesLeftScroll();
  circleChange();
});

// 圈圈變化效果
function circleChange(){
  let smallCircleDOM = document.querySelectorAll(".circle-box__small-circle");
  smallCircleDOM.forEach((thisCircle,i) => {
    if(i===cot){
      thisCircle.className="circle-box__small-circle circle-box__small-circle--change";
    }
    else{
      thisCircle.className="circle-box__small-circle circle-box__small-circle--origin";
    }
  })
}

// 回首頁按鈕
document.getElementById("backToIndex").addEventListener('click',function(){
  window.location.href ="/";
})

