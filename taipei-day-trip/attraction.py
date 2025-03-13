import json
import mysql.connector

# 建立資料庫連線
con=mysql.connector.connect(
    user="root",
    password="123456789",
    host="localhost",
    database="taipei_day_trip"
)

# 讀取json檔案
with open('data/taipei-attractions.json','r',encoding='utf-8')as file:
    data = json.load(file)
# print(data)
rawData=data["result"]["results"]
# print(rawData[0])#可成功印出第一筆資料

# 整理成所需的資料
attractions=[] # 放主表的資料
image_urls=[] # 放圖片資料
for item in rawData:
    # 處理圖片url
    urls=item["file"]
    split_urls=["http"+url for url in urls.split("http")if url]
    # 篩選jpg或是png結尾
    filter_urls=[url for url in split_urls if url.endswith(('jpg','JPG','png','PNG'))]
    image_urls.append(filter_urls)
    attractions.append({
        # "id":item["_id"],
        "name":item["name"],
        "category":item["CAT"],
        "description":item["description"],
        "address":item["address"],
        "transport":item["direction"],
        "mrt":item["MRT"],
        "lat":item["latitude"],
        "lng":item["longitude"]
    })

# 將資料寫入MySQL attractions table(尚不包含圖片url)
cursor=con.cursor()
for item in attractions:
    cursor.execute(
        "INSERT INTO attractions(name, category, "
        "description, address, transport, mrt, lat, lng) "
        "VALUES (%s,%s,%s,%s,%s,%s,%s,%s)",[
            item["name"],item["category"],
            item["description"],item["address"],
            item["transport"],item["mrt"],item["lat"],item["lng"]
        ])
    
# 將圖片網址寫入圖片attractions_images table
for index, item in enumerate(image_urls):
    for url in item:
        cursor.execute(
        "INSERT INTO attractions_images(attractions_id,url) VALUES (%s, %s)",[index+1,url]
    )
con.commit()
con.close()
