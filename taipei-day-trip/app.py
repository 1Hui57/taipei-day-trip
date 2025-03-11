import math
from fastapi import *
from fastapi.responses import FileResponse, JSONResponse
from fastapi.exceptions import RequestValidationError
from typing import Annotated, Optional
import mysql.connector
app=FastAPI()

# 建立資料庫連線
con=mysql.connector.connect(
    user="root",
    password="123456789",
    host="localhost",
    database="taipei_day_trip"
)

# 優化/api/attractions
# 定義一個函式，可以根據要求字串抓取資料
def getAttractionData(cursor, keyword=None, pageStartFrom=0, attractionId=None):
	if keyword:
		cursor.execute("SELECT * FROM attractions WHERE name=%s OR mrt LIKE %s ORDER BY id ASC LIMIT %s, %s",[keyword,'%'+keyword+'%',pageStartFrom,12])
	elif attractionId:
		cursor.execute("SELECT * FROM attractions WHERE id=%s",[attractionId])
	else:
		cursor.execute("SELECT * FROM attractions ORDER BY id ASC LIMIT %s, %s",[pageStartFrom,12])
	return cursor.fetchall()

# 定義一個函式，可以根據要求字串抓取資料總筆數
def getAttractionNumber(cursor, keyword):
	if keyword:
		cursor.execute("SELECT COUNT(*) FROM  attractions WHERE name=%s OR mrt LIKE %s",[keyword, '%'+keyword+'%'])
	else:
		cursor.execute("SELECT COUNT(id) FROM  attractions")
	return cursor.fetchone()

# 定義一個函式，可以抓取圖片url
def getAttractionImg(cursor,attractions_id):
	cursor.execute("SELECT url FROM attractions_images WHERE attractions_id=%s",[attractions_id])
	resultsUrls=cursor.fetchall()# 拿到的url資料會是tuple形式
	imageUrl= [url[0] for url in resultsUrls] # 將url資料轉換為list
	return imageUrl
	 
@app.get("/api/attractions")
async def api_attractions(
	request: Request,
	page:Annotated[int, Query(ge=0)],
	keyword:Annotated[Optional[str], Query()]=None
	):
	cursor=con.cursor()
	# 根據page算出查詢過後的起始筆數
	pageStartFrom=page*12 if page>0 else 0
	results=getAttractionData(cursor, keyword, pageStartFrom)
	resultsNumber=getAttractionNumber(cursor, keyword)
	if results:
		data=[]
		for item in results:
			cursor=con.cursor()
			images=getAttractionImg(cursor,item[0])
			data.append({
					"id":item[0],
					"name":item[1],
					"category":item[2],
					"description":item[3],
					"address":item[4],
					"transport":item[5],
					"mrt":item[6],
					"lat":item[7],
					"lng":item[8],
					"images":images
					})
		# 計算結果有幾頁
		totalPages=math.ceil(resultsNumber[0]/12)-1 #  如果有三頁，是P0,P1,P2頁
		nextPage=page+1 if totalPages-page>0 else None
		return {"nextPage":nextPage,"data":data}
	elif keyword:
		return JSONResponse(status_code=500,content={"error":True,"message":"您所查詢的關鍵字無相關頁數資料。"})
	else:
		return JSONResponse(status_code=500,content={"error":True,"message":"您所查詢的頁數無相關資料。"})

# 將要求字串和路徑的輸入錯誤以statua=500回應
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request:Request, exc:RequestValidationError):
	return JSONResponse(status_code=500,content={"error":True,"message":"請輸入正確的查詢資料。"})


@app.get("/api/attraction/{attractionId}")		
async def api_attraction_attractionId(request:Request,attractionId:Annotated[int, Path(gt=0)]):
	cursor=con.cursor()
	results=getAttractionData(cursor,keyword=None,pageStartFrom=0,attractionId=attractionId)
	images=getAttractionImg(cursor,attractions_id=attractionId)
	if results and images:
		data={
			"id":results[0][0],
			"name":results[0][1],
			"category":results[0][2],
			"description":results[0][3],
			"address":results[0][4],
			"transport":results[0][5],
			"mrt":results[0][6],
			"lat":results[0][7],
			"lng":results[0][8],
			"images":images
		}
		return {"data":data}
	else:
		return JSONResponse(status_code=400,content={"error":True,"message":"您所查詢的景點編號不存在。"})


# Static Pages (Never Modify Code in this Block)
@app.get("/", include_in_schema=False)
async def index(request: Request):
	return FileResponse("./static/index.html", media_type="text/html")
@app.get("/attraction/{id}", include_in_schema=False)
async def attraction(request: Request, id: int):
	return FileResponse("./static/attraction.html", media_type="text/html")
@app.get("/booking", include_in_schema=False)
async def booking(request: Request):
	return FileResponse("./static/booking.html", media_type="text/html")
@app.get("/thankyou", include_in_schema=False)
async def thankyou(request: Request):
	return FileResponse("./static/thankyou.html", media_type="text/html")