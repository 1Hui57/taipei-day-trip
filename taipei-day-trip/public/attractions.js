
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
    //有取得資料就呼叫渲染景點的函式
    loadAttractions();
})

window.addEventListener("scroll", async function(){
  if(window.scrollY+window.screen.height >= document.body.scrollHeight){
    if(nextPage!==null && !isLoading ){
      isLoading=true; //防止重複送出請求
      try{
        let url = `/api/attractions?page=${nextPage}`;
        if (currentKeyword !== null) {
            url += `&keyword=${currentKeyword}`; // 添加關鍵字篩選
        }
        let response = await fetch(url);
        console.log(url);
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

// 根據搜尋欄輸入的關鍵字搜尋景點並渲染
async function searchKeyword(){
  let searchWord = document.getElementById("searchBar__input").value;
  currentKeyword = searchWord;
  let response = await fetch(`/api/attractions?page=0&keyword=${searchWord}`);
  attractions = await response.json();
  currentPage=0;
  nextPage = attractions["nextPage"];
  //清空目前的景點DOM
  let attractionsGroup =document.getElementById("attractions__attractions-group");
  attractionsGroup.innerHTML="";
  //有取得資料就呼叫渲染景點的函式
  loadAttractions();
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
      newMrtName.className = "Body_Med_16";
      // 新增景點分類 DOM
      let newCategory = document.createElement("div");
      newCategory.className = "Body_Med_16 justify-content-end";

      // 組合DOM
      attractionsGroupDOM.appendChild(newAttractionDOM);
      newAttractionDOM.appendChild(newAttractionContainer);
      newAttractionContainer.appendChild(newAttractiomImg);
      // 加入圖片url
      newAttractiomImg.src = attractions["data"][i]["images"][0];
      newAttractionContainer.appendChild(newContainerDetails);
      newContainerDetails.appendChild(newContainerDetailsInfo);
      newContainerDetailsInfo.appendChild(newAttractionName);
      // 加入景點名稱
      let newNameText = document.createTextNode(
        attractions["data"][i]["name"]
      );
      newAttractionName.appendChild(newNameText);
      newAttractionDOM.appendChild(newAttractionDetail);
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

