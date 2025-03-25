
let attraction = {
      id: 55,
      name: "陽明山中山樓",
      category: "歷史建築",
      description:
        "陽明山國家公園內的中山樓，是蔣介石總統在位時，為了紀念國父孫中山先生百年誕辰，於1965年所興建，由名建築師修澤蘭女士規劃，位於群山環抱的綠意之中，外表為中國傳統古典式建築，內部陳設典雅細緻，過去是國民大會的會場，並為國家元首接待外賓或舉辦國宴的重要場地，如今已被指定為市立古蹟，並開放場地租借及參觀導覽，是一座具有歷史紀念價值的建築物。 參觀導覽 02-2861-6391 / 場地租借 02-2861-0565",
      address: "臺北市  北投區陽明路2段15號",
      transport:
        "捷運劍潭站轉乘紅5、260至教師研習站下車到達公車－每日行駛：&nbsp;中山樓正門站─260 &nbsp;(說明：駛入園區直接停於本樓)中山樓站─260、681、紅5、1717(皇家客運) &nbsp;(說明：停於園區門口，步行5分鐘至本樓)陽明山站─230、303、小8、小9 &nbsp;(說明：步行5分鐘至園區門口，在步行5分至本樓)假日行駛：中山樓站─109、111、128 &nbsp;(說明：停於園區門口，步行5分鐘至本樓)陽明山站─129 &nbsp;(說明：步行5分鐘至園區門口，在步行5分至本樓)&nbsp;",
      mrt: "劍潭",
      lat: 25.155623,
      lng: 121.552772,
      images: [
        "https://www.travel.taipei/d_upload_ttn/sceneadmin/image/A0/B0/C0/D370/E882/F626/420c6cf8-45c6-4c31-8e0a-42d44a1a5eac.jpg",
        "https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11003127.jpg",
        "https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11003128.jpg",
        "https://www.travel.taipei/d_upload_ttn/sceneadmin/pic/11003129.jpg",
      ],
    };

let imagesNum = attraction["images"].length;

//將fetch拿到的資料渲染到畫面上
//渲染圖片
let pictureCurrent = document.getElementById("pictureCurrent");
for(let i =0; i<imagesNum; i++){
    let newPictureWrapper = document.createElement("div");
    newPictureWrapper.className = "attraction-section__picture-current--wrapper";
    let newPictureImage = document.createElement("img");
    newPictureImage.className="attraction-section__picture-current--img";
    newPictureImage.src=attraction["images"][i];
    newPictureWrapper.appendChild(newPictureImage);
    pictureCurrent.appendChild(newPictureWrapper);
}
//景點名稱
let profileName = document.getElementById("profileName");
let newProfileNameText = document.createTextNode(attraction["name"]);
profileName.appendChild(newProfileNameText);
//景點種類&位置
let profileCategory = document.getElementById("profileCategory");
let newProfileCategoryText = document.createTextNode(`${attraction["category"]} at ${attraction["mrt"]}`);
profileCategory.appendChild(newProfileCategoryText);
//景點描述
let inforsDescription = document.getElementById("inforsDescription");
let newInforsDescriptionText = document.createTextNode(attraction["description"]);
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

//調整價錢
let radioAM = document.getElementById("am");
let radioPM = document.getElementById("pm");
let price = document.getElementById("price");

radioAM.addEventListener('change',radioChangePrice);
radioPM.addEventListener('change',radioChangePrice);
function radioChangePrice(){
    price.innerHTML="";
    if(radioAM.checked){
        let priceText = document.createTextNode("新台幣 2000 元");
        price.appendChild(priceText);
    }
    else if(radioPM.checked){
        let priceText = document.createTextNode("新台幣 2500 元");
        price.appendChild(priceText);
    }
}



let cot = 0;

function imagesLeftScroll() {
    if (cot < imagesNum - 1) {
        let imagesScrollBar = document.querySelector(
        ".attraction-section__picture-current"
        );
        let imageWidth = document.querySelector(
        ".attraction-section__pictureBar"
        ).offsetWidth;
        imagesScrollBar.style.transform = `translateX(-${
        (cot + 1) * imageWidth
        }px)`;
        cot++;
    }
}

function imagesRightScroll() {
    if (cot > 0) {
        let imagesScrollBar = document.querySelector(
        ".attraction-section__picture-current"
        );
        let imageWidth = document.querySelector(
        ".attraction-section__pictureBar"
        ).offsetWidth;
        imagesScrollBar.style.transform = `translateX(-${
        (cot - 1) * imageWidth
        }px)`;
        cot--;
    }
}

let imageLeftArrow = document.querySelector(
    ".attraction-section__picture-leftArrow"
);
imageLeftArrow.addEventListener("click", function () {
    imagesRightScroll();
    }
);

let imageRightArrow = document.querySelector(
    ".attraction-section__picture-rightArrow"
);
imageRightArrow.addEventListener("click", function () {
    imagesLeftScroll();
    }
);
