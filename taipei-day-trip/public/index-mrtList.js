
// mrt list bar的相關程式

let mrt;
document.addEventListener("DOMContentLoaded", async function(){
    let response = await fetch("/api/mrts");
    let result = await response.json();
    mrt = result["data"];
    //有取得資料就呼叫渲染list的函式
    loadMrtList();
    mrtAttractions();
})

// 新增bar list 的捷運站列表
function loadMrtList() {
    let listItemContainer = document.getElementById("listItem-container");
    let mrtNum = mrt.length;
    for (let i = 0; i < mrtNum; i++) {
      let newListItem = document.createElement("div");
      newListItem.className = "listItem-container__listItem";
      let newListItemName = document.createTextNode(mrt[i]);
      newListItem.appendChild(newListItemName);
      listItemContainer.appendChild(newListItem);
    }
  }

// 寫一個函式監聽使用者點擊的捷運站，將attractions重新渲染成該捷運站附近景點
function mrtAttractions(){
  let mrtBtn = document.querySelectorAll('.listItem-container__listItem');
  mrtBtn.forEach((thisBtn)=>{
    thisBtn.addEventListener('click',async function(){
      let thisBtnText = this.textContent;
      //設定關鍵字，讓新載入的景點會是這個關鍵字的而不是預設的
      currentKeyword = thisBtnText;
      let response = await fetch(`/api/attractions?page=0&keyword=${thisBtnText}`);
      attractions = await response.json();
      currentPage=0;
      nextPage = attractions["nextPage"];
      //將搜尋欄的input放入點擊的捷運站
      document.getElementById("searchBar__input").value=thisBtnText;
      //清空目前的景點DOM
      let attractionsGroup =document.getElementById("attractions__attractions-group");
      attractionsGroup.innerHTML="";
      attractionsGroup.className="";
      //防止attractionsGroup的class沒有從錯誤版變回原版
      attractionsGroup.classList.add("attractions__attractions-group");
      //有取得資料就呼叫渲染景點的函式
      loadAttractions();
    })
  })
}
let mrtBtn = document.querySelectorAll('.listItem-container__listItem');

// 寫一個函式可以讓listItem-container滑順的移動，此功能會以button事件監聽並呼叫
function smoothScroll(element, scrollTo, duration) {
    let startTime = performance.now();
    let statrScrollPosition = document.getElementById("listItem-container").scrollLeft;
    //再寫一個函式是從一個位置移動到另一個位置的每一偵執行的動作
    function scroll() {
      let now = performance.now();
      let timePercent = Math.min(1, (now - startTime) / duration); //動畫的進度的百分比
      // let timeFunction = time * (2 - time);
      element.scrollLeft = timePercent * (scrollTo - statrScrollPosition) + statrScrollPosition;
      if (timePercent < 1) {
        requestAnimationFrame(scroll);
      }
    }
    requestAnimationFrame(scroll);
  }
// 將scroll bar的滑動函式添加到button事件監聽
document.getElementById("leftArrow").addEventListener("click", function () {
    let listItem_container = document.getElementById("listItem-container");
    let scrollTo = listItem_container.scrollLeft - 200;
    smoothScroll(listItem_container, scrollTo, 400);
    });

document.getElementById("rightArrow").addEventListener("click", function () {
    let listItem_container = document.getElementById("listItem-container");
    let scrollTo = listItem_container.scrollLeft + 200;
    smoothScroll(listItem_container, scrollTo, 400);
    });
