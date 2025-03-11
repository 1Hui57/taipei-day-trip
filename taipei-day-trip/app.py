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

# 將要求字串的輸入錯誤以statua=500回應
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request:Request, exc:RequestValidationError):
	return JSONResponse(status_code=500,content={"error":True,"message":"請輸入大於等於0的整數作為查詢頁數。"})

@app.get("/api/attractions")
async def api_attractions(
	request: Request,
	page:Annotated[int, Query(ge=0)],
	keyword:Annotated[Optional[str], Query()]=None
	):
	# 找出keyword相關的資料，同時驗證page是否為大於等於0的整數
	if keyword and type(page)==int and page>=0:
		cursor=con.cursor()
		# 根據page算出查詢過後的起始筆數
		pageStartFrom=page*11 if page>0 else 0
		# 根據keyword及page獲得該頁的所有資料
		cursor.execute("SELECT * FROM attractions WHERE name=%s OR mrt LIKE %s ORDER BY id ASC LIMIT %s, %s",[keyword,'%'+keyword+'%',pageStartFrom,12])
		results=cursor.fetchall()
		# 根據keyword獲得符合關鍵字的資料總筆數
		cursor.execute("SELECT COUNT(*) FROM  attractions WHERE name=%s OR mrt LIKE %s",[keyword, '%'+keyword+'%'])
		resultsNumber=cursor.fetchone() 
		if results: # 如果根據page跟keyword有查到相關資料
			data=[]
			for item in results:
				# 查詢相同id的圖片url
				cursor=con.cursor()
				cursor.execute("SELECT url FROM attractions_images WHERE attractions_id=%s",[item[0]])
				resultsUrls=cursor.fetchall()# 拿到的url資料會是tuple形式
				images=[url[0] for url in resultsUrls] # 將url資料轉換為list
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
			return {"nextPage":nextPage,"data":results}
		else:
			return JSONResponse(status_code=500,content={"error":True,"message":"您所查詢的關鍵字及頁數無相關資料。"})
	# 如果沒有keyword，但page是大於等於0的整數
	elif keyword is None and type(page)==int and page>=0 :
		pageStartFrom=page*12 if page>0 else 0
		cursor=con.cursor()
		cursor.execute("SELECT * FROM attractions ORDER BY id ASC LIMIT %s, %s",[pageStartFrom,12])
		results=cursor.fetchall()
		# 取得資料總筆數
		cursor.execute("SELECT COUNT(id) FROM  attractions")
		resultsNumber=cursor.fetchone() 
		if results: # 如果根據page有查到相關資料
			data=[]
			for item in results:
				# 查詢相同id的圖片url
				cursor=con.cursor()
				cursor.execute("SELECT url FROM attractions_images WHERE attractions_id=%s",[item[0]])
				resultsUrls=cursor.fetchall()# 拿到的url資料會是tuple形式
				images=[url[0] for url in resultsUrls] # 將url資料轉換為list
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
			return {"nextPage":nextPage,"data":results}
		else:
			return JSONResponse(status_code=500,content={"error":True,"message":"您所查詢的頁數無相關資料。"})
	else:
		return JSONResponse(status_code=500,content={"error":True,"message":"請輸入大於等於0的整數作為查詢頁數。"})
		
		


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