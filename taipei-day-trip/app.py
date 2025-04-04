import math
from fastapi import *
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from typing import Annotated, Optional
import mysql.connector
from mysql.connector import pooling
from dotenv import load_dotenv
import os
import jwt
from jwt import ExpiredSignatureError, InvalidTokenError
from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone


app=FastAPI()
load_dotenv()
# 設定 JWT 參數
SECRETE_KEY = os.getenv("SECRETE_KEY")  # **請改成更安全的金鑰**
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_HOURS = 24*7  # Token 過期時間

# 密碼加密
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# 建立連線池
connection_pool = pooling.MySQLConnectionPool(
	pool_name="taipei_day_trip",
	pool_size=5,
	host=os.getenv("DB_HOST"),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME")
)

# 定義一個函式，可以根據要求字串抓取資料包括所有符合資料的圖片url
def getAttractionData(cursor, keyword=None, pageStartFrom=0, attractionId=None):
	if keyword:
		cursor.execute("SET SESSION group_concat_max_len = 100000;")
		cursor.execute("SELECT attractions.*, GROUP_CONCAT(attractions_images.url SEPARATOR ',')"
		"as images FROM attractions LEFT JOIN attractions_images  ON attractions.id=attractions_images.attractions_id "
		"WHERE mrt=%s OR name LIKE %s GROUP BY attractions.id ORDER BY attractions.id ASC LIMIT %s, %s",[keyword,'%'+keyword+'%',pageStartFrom,12])
	elif attractionId:
		cursor.execute("SET SESSION group_concat_max_len = 100000;")
		cursor.execute("SELECT attractions.*, GROUP_CONCAT(attractions_images.url SEPARATOR ',')"
		"as images FROM attractions LEFT JOIN attractions_images  ON attractions.id=attractions_images.attractions_id WHERE attractions.id=%s",[attractionId])
	else:
		cursor.execute("SET SESSION group_concat_max_len = 100000;")
		cursor.execute("SELECT attractions.*, GROUP_CONCAT(attractions_images.url SEPARATOR ',')"
		"as images FROM attractions LEFT JOIN attractions_images  ON attractions.id=attractions_images.attractions_id "
		" GROUP BY attractions.id ORDER BY attractions.id ASC LIMIT %s, %s",[pageStartFrom,12])
	return cursor.fetchall()

# 定義一個函式，可以根據要求字串抓取資料總筆數
def getAttractionNumber(cursor, keyword):
	if keyword:
		cursor.execute("SELECT COUNT(*) FROM  attractions WHERE mrt=%s OR name LIKE %s",[keyword, '%'+keyword+'%'])
	else:
		cursor.execute("SELECT COUNT(id) FROM  attractions")
	return cursor.fetchone()

@app.get("/api/attractions")
async def api_attractions(
	request: Request,
	page:Annotated[int, Query(ge=0)],
	keyword:Annotated[Optional[str], Query()]=None
	):
	connection = connection_pool.get_connection()
	cursor = connection.cursor()
	# 根據page算出查詢過後的起始筆數
	pageStartFrom=page*12 if page>0 else 0
	results=getAttractionData(cursor, keyword, pageStartFrom)
	resultsNumber=getAttractionNumber(cursor, keyword)
	cursor.close()
	connection.close() 
	if results:
		data=[]
		for item in results:
			images=item[9].split(',')
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
	connection = connection_pool.get_connection()
	cursor = connection.cursor()
	results=getAttractionData(cursor,keyword=None,pageStartFrom=0,attractionId=attractionId)
	cursor.close()
	connection.close() 
	if results[0][0] is not None:
		images=results[0][9].split(',')
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

@app.get("/api/mrts")
async def get_mrt(request:Request):
	connection = connection_pool.get_connection()
	cursor = connection.cursor()
	cursor.execute("SELECT mrt,COUNT(mrt) FROM attractions GROUP BY mrt ORDER BY COUNT(mrt) DESC")
	mrtData=cursor.fetchall()
	cursor.close()
	connection.close() 
	data=[]
	for item in mrtData:
		if item[0]:
			data.append(item[0])
		else:
			continue
	return {"data":data}

# 生成JWT token
def create_access_token(data:dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) +  timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRETE_KEY, ALGORITHM)

# 註冊帳號API
@app.post("/api/user")
async def signup(
	request:Request
):
	data = await request.json()
	connection = connection_pool.get_connection()
	cursor = connection.cursor()
	cursor.execute("SELECT * FROM user WHERE email=%s",[data["email"]])
	userData=cursor.fetchone()
	if userData==None:
		# 儲存使用者資料與加密後的密碼到資料庫
		cursor.execute("INSERT INTO user (name, email, password) VALUES (%s,%s,%s)",[data["name"],data["email"],pwd_context.hash(data["password"])])
		connection.commit()
		cursor.close()
		connection.close()
		return {"ok": True}
	elif userData[2]:
		cursor.close()
		connection.close()
		return JSONResponse(status_code=400,content={"error": True,"message":"此Email已註冊"})
	else:
		cursor.close()
		connection.close()
		return JSONResponse(status_code=500,content={"error": True,"message":"伺服器內部錯誤"})
	
# 登入API
@app.put("/api/user/auth")
async def signin(
	request:Request
):
	try:
		data = await request.json()
		connection = connection_pool.get_connection()
		cursor = connection.cursor()
		cursor.execute("SELECT * FROM user WHERE email=%s",[data["email"]])
		userData=cursor.fetchone()
		cursor.close()
		connection.close() 
		# 如果沒有相同的email
		if userData is None:
			return JSONResponse(status_code=400,content={"error": True,"message":"此帳號尚未註冊。"})
		# 如果密碼正確
		elif pwd_context.verify(data["password"], userData[3]):
			resultData = {"id":userData[0],"name":userData[1],"email":userData[2]}
			return {"token": create_access_token(resultData)}
		# 如果密碼不正確
		else:
			return JSONResponse(status_code=400,content={"error": True,"message":"帳號或密碼錯誤。"})
	except Exception as e:
		return JSONResponse(status_code=500,content={"error": True,"message":"伺服器內部錯誤。"})

# 確認使用者登入狀態API
@app.get("/api/user/auth")
async def getUserState(
	request:Request
):
	authorization = request.headers.get("Authorization")
	if authorization and authorization.startswith("Bearer"):
		token = authorization.replace("Bearer ", "").strip()
		try:				
			tokenVerifyData = jwt.decode(token, SECRETE_KEY, algorithms=["HS256"])
			print(tokenVerifyData)
			return{"data":tokenVerifyData}
		except ExpiredSignatureError:
			return {"data":None}
		except InvalidTokenError:
			return {"data":None}
	else:
		print("None")
		return {"data":None}

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

# 建立靜態檔案資料夾
app.mount("/public", StaticFiles(directory="public"))