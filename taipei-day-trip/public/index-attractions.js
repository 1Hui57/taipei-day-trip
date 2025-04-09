
// 載入景點的程式

let attractions;
let currentPage=0;
let nextPage;
let currentKeyword = null;
let isLoading = false;

document.addEventListener("DOMContentLoaded", async function (){
  let response = await fetch("/api/attractions?page=0");
  attractions = await response.json();
  nextPage = attractions["nextPage"];
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
  //有取得資料就呼叫渲染景點的函式
  loadAttractions();
})

let scrollTriggerItem = document.getElementById("scrollTriggerItem");
let opition = {
  root:null,
  rootMargin:"0px 0px 20px 0px",
  threshold:0
};

let observer = new IntersectionObserver( (entries)=>{
  entries.forEach(async(entry)=>{
    if(entry.isIntersecting){
      // console.log("成功觸發");
      if(nextPage!==null && !isLoading ){
        isLoading=true; //防止重複送出請求
        try{
          let url = `/api/attractions?page=${nextPage}`;
          if (currentKeyword !== null) {
              url += `&keyword=${currentKeyword}`; // 添加關鍵字篩選
          }
          let response = await fetch(url);
          // console.log(url);
          attractions = await response.json();
          currentPage=nextPage;
          nextPage = attractions["nextPage"];
          loadAttractions();
        }
        catch(error){
          console.log("載入失敗")
        }
        finally{
          isLoading = false;
        }
      }
    }
  })
},opition);

observer.observe(scrollTriggerItem);

// 監聽滾動事件的程式
// window.addEventListener("scroll", async function(){
//   if(window.scrollY+window.innerHeight >= document.body.scrollHeight-100){
//     console.log("成功觸發");
//     if(nextPage!==null && !isLoading ){
//       isLoading=true; //防止重複送出請求
//       try{
//         let url = `/api/attractions?page=${nextPage}`;
//         if (currentKeyword !== null) {
//             url += `&keyword=${currentKeyword}`; // 添加關鍵字篩選
//         }
//         let response = await fetch(url);
//         console.log(url);
//         attractions = await response.json();
//         currentPage=nextPage;
//         nextPage = attractions["nextPage"];
//         loadAttractions();
//       }
//       catch(error){
//         console.log("載入失敗")
//       }
//       finally{
//         isLoading = false;
//       }
//     }
//   }
// })

// 根據搜尋欄輸入的關鍵字搜尋景點並渲染
async function searchKeyword(){
  let searchWord = document.getElementById("searchBar__input").value;
  currentKeyword = searchWord;
  let response = await fetch(`/api/attractions?page=0&keyword=${searchWord}`);
  attractions = await response.json();
  // 處裡關鍵字搜尋錯誤的畫面
  if(attractions["error"]){
    currentPage=null;
    nextPage=null;
    let attractionsGroup =document.getElementById("attractions__attractions-group");
    attractionsGroup.innerHTML="";
    attractionsGroup.className="";
    attractionsGroup.classList.add("attractions__attraSctions-group--error");
    let newDiv = document.createElement("div");
    newDiv.className="Body_Bold_16 colorGray errorText"
    newDiv.innerText = attractions["message"];
    attractionsGroup.appendChild(newDiv);
    return;
  }
  else{
    currentPage=0;
    nextPage = attractions["nextPage"];
    //清空目前的景點DOM
    let attractionsGroup =document.getElementById("attractions__attractions-group");
    attractionsGroup.innerHTML="";
    // 防止attractionsGroup class沒有從錯誤版變回原版
    attractionsGroup.className="";
    attractionsGroup.classList.add("attractions__attractions-group");
    //有取得資料就呼叫渲染景點的函式
    loadAttractions();
  }
}

// 搜尋按鈕監聽事件
let searchBarBtn = document.querySelector(".searchBar__btn");
searchBarBtn.addEventListener('click',searchKeyword);

// 輸入後按下enter
let searchInput = document.getElementById("searchBar__input");
searchInput.addEventListener("keydown", function(event){
  if(event.key==="Enter"){
    searchKeyword();
  }
})


// 透過拿到的資料載入attration DOM 的函式
function loadAttractions() {
    let attractionsNum = attractions["data"].length;
    // 父節點DOM
    let attractionsGroupDOM = document.getElementById(
      "attractions__attractions-group"
    );
    // 加入新景點
    for (let i = 0; i < attractionsNum; i++) {
      // 新增attraction DOM div
      let newAttractionDOM = document.createElement("div");
      newAttractionDOM.className = "attractions-group__attraction";
      // 新增 attraction__container DOM div
      let newAttractionContainer = document.createElement("div");
      newAttractionContainer.className = "attraction__container";
      // 新增attraction img
      let newAttractiomImg = document.createElement("img");
      // 新增 container__Details DOM div
      let newContainerDetails = document.createElement("div");
      newContainerDetails.className = "container__details";
      // 新增container__details__info DOM div
      let newContainerDetailsInfo = document.createElement("div");
      newContainerDetailsInfo.className = "container__details__info";
      // 新增 info內的div放景點名稱
      let newAttractionName = document.createElement("div");

      // 新增attraction__details DOM div
      let newAttractionDetail = document.createElement("div");
      newAttractionDetail.className = "attraction__details";
      // 新增 新增 details__info DOM div
      let newDetailsInfo = document.createElement("div");
      newDetailsInfo.className = "details__info";
      // 新增捷運站名稱DOM
      let newMrtName = document.createElement("div");
      newMrtName.className = "Body_Med_16_500";
      // 新增景點分類 DOM
      let newCategory = document.createElement("div");
      newCategory.className = "Body_Med_16_500 justify-content-end";

      // 組合DOM
      attractionsGroupDOM.appendChild(newAttractionDOM);
      newAttractionDOM.appendChild(newAttractionContainer);
      newAttractionContainer.appendChild(newAttractiomImg);
      // 加入圖片url
      newAttractiomImg.src = attractions["data"][i]["images"][0];
      newAttractionContainer.appendChild(newContainerDetails);
      newContainerDetails.appendChild(newContainerDetailsInfo);
      newContainerDetailsInfo.appendChild(newAttractionName);
      // 加入景點名稱、屬性
      let newNameText = document.createTextNode(
        attractions["data"][i]["name"]
      );
      newAttractionName.appendChild(newNameText);
      newAttractionDOM.appendChild(newAttractionDetail);
      newAttractionDOM.setAttribute("attraction-id",attractions["data"][i]["id"]);
      newAttractionDetail.appendChild(newDetailsInfo);
      newDetailsInfo.appendChild(newMrtName);
      // 加入mrt
      let newMrtText = document.createTextNode(
        attractions["data"][i]["mrt"]
      );
      newMrtName.appendChild(newMrtText);
      newDetailsInfo.appendChild(newCategory);
      // 加入景點種類
      let newCategoryText = document.createTextNode(
        attractions["data"][i]["category"]
      );
      newCategory.appendChild(newCategoryText);
    }
}

// 以事件委派，抓取景點的冒泡事件並跳轉至該景點頁面的函式
let attractionGroup = document.querySelector(".attractions__attractions-group");
attractionGroup.addEventListener('click',function(event){
  let clickedAttraction = event.target.closest(".attractions-group__attraction");
  if(clickedAttraction){
    let attractionId = clickedAttraction.getAttribute("attraction-id");
    if(attractionId){
      window.location.href = `/attraction/${attractionId}`;
    }
  }
})

// 回首頁按鈕
document.getElementById("backToIndex").addEventListener('click',function(){
  window.location.href ="/";
})      

