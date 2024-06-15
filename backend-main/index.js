const express = require('express');
const app  = express();
const portnum = 8080;

//mogodb & axios
const axios = require('axios');
const mongoose = require('mongoose');	//需要裝mogodb

//database 連線
const dbURL = 'mongodb+srv://901130henry:Lev9G3rnpS1YB1Ub@cluster0.qbxtxkj.mongodb.net/food?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(dbURL).then(() => {
	console.log('Connected to MongoDB...')
	app.listen(process.env.PORT|| portnum , () => {
		console.log("server is running at localhsot");
	})
}).catch(() => {
	console.log(err);
});

//parser
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
var jsonParser = bodyParser.json();

const {
	linebotParser, Bot_Follow, Bot_Message,
	finduser, findOrCreateRoom, CORS,
	App_Update, App_Order, App_Arrive, App_Moveon, App_Accident, App_LoseWeight, App_TimeOut, App_Canceled, App_Completed, App_Menu,
} = require("./controllers/func")

app.post('/linewebhook',linebotParser);// linebot webhook
//CORS
//app.use(CORS);

const cors = require("cors")
app.use(cors())
app.use(express.json())

//variable
const RoomNumber = 3; 				//預設3間房間
let iislogin = new Array(RoomNumber).fill(false);

//const host = 'Your_domain';//render address
/*
//test
bot.on('message', function (event) {
  // event.message.text是使用者傳給bot的訊息
  // 使用event.reply(要回傳的訊息)方法可將訊息回傳給使用者
  var replyMsg = `Hello你剛才說的是:${event.message.text}`;
  event.reply(replyMsg).then(function (data) {
    // 當訊息成功回傳後的處理
  }).catch(function (error) {
    // 當訊息回傳失敗後的處理
  });
});
*/

const { bot } = require("./models/bot")
bot.on('follow', Bot_Follow);		//使用者加入好友
bot.on('message', Bot_Message);		//機器人回應

//Create Room object

/*Room.findOne({ room: 'h' }, async function (error, room) {
	var data = room;
	if (data != null) {
	}
	else {
		const RoomOBJ = new Room({
			Islogin: false,
			room: "h",
			pass: "1122",
			//RFID: [67, 56, 188, 233],
		})
		await RoomOBJ.save()
			.then(() => {
				console.log("RoomH Data Saved.");
			})
			.catch((e) => {
				console.log("Error");
				console.log(e);
			});
	}
});
Room.findOne({ room: 'j' }, async function (error, room) {
	var data = room;
	if (data != null) {
	}
	else {
		const RoomOBJ = new Room({
			Islogin: false,
			room: "j",
			pass: "3344",
			//RFID: [68, 231, 2, 40],
		})
		await RoomOBJ.save()
			.then(() => {
				console.log("RoomJ Data Saved.");
			})
			.catch((e) => {
				console.log("Error");
				console.log(e);
			});
	}
});*/
// ROOMk-5566
/*Room.findOne({ room: 'k' }, async function (error, room) {
	var data = room;
	if (data != null) {
	}
	else {
		const RoomOBJ = new Room({
			Islogin: false,
			room: "k",
			pass: "5566",
			//RFID: [161, 25, 227, 27],
		})
		await RoomOBJ.save()
			.then(() => {
				console.log("RoomK Data Saved.");
			})
			.catch((e) => {
				console.log("Error");
				console.log(e);
			});
	}
});*/

//finduser();
findOrCreateRoom() ;
//GET請求
//////////
app.get('/Update', App_Update)			//自走車拿取資訊獲准
app.get('/Order', App_Order)			//訂餐資訊
app.get('/Arrived', App_Arrive)			//自走車抵達使用者房門

app.get('/Moveon', App_Moveon)			//自走車前往送餐中
app.get('/Accidient', App_Accident)		//餐點被拿走
app.get('/LoseWeight', App_LoseWeight)	//重量減少
app.get('/Timeout', App_TimeOut)		//RFID確認timeout
//RFID錯誤
/*app.get('/Rfid', async function (req, res) {

})*/
app.get('/Canceled', App_Canceled)		//for後場=>送餐取消
app.get('/Completed', App_Completed)	//送餐完成
app.post('/Menu', jsonParser, App_Menu)	//網頁訂單


app.get("/api", (req, res) => {
	res.json({message: "Henry is N0.1."})
})
