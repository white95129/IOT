const mongoose = require("mongoose")

//Define Schema
//使用者Schema => 以使用者ID做判定
const UserSchema = new mongoose.Schema({
    UserID: String, 	//用作查找使用者的依據 => 利用UserID(目前發言者)查找
    UserName: String,	//使用者名稱
    totalmoney: Number,	//此使用者所有訂單消費
    room: String,		//此使用者居住房號 => 若登出要消除
    Isorder: Boolean,	//確認使用者是否有送出訂單
    orderNUM: Number,	//記錄此使用者擁有的訂單數
})
//歷史訂單資料 => 以使用者的ID做判定
const HistorySchema = new mongoose.Schema({
    UserID: String,			//用作查找訂單的依據 => 利用OrderUserID(目前發出訂單者)查找
    orderNUM: Number,		//記錄此筆訂單是此使用者第幾筆
    order: [Number],		//訂單內容
    money: Number,			//單筆訂單之價格
    orderstatus: String,	// finished / working / canceled
    RFIDWrong: Number,		//此筆訂單RFID錯誤次數
})
//房間資訊Schema => 以房號做判定
const RooomSchema = new mongoose.Schema({
    Islogin: Boolean,			//記錄此房號是否有登入 => 若登出要消除
    CurrentUserID: String,		//紀錄目前此房號的房客 => 若登出要消除
    CurrentUserName: String,	//紀錄目前此房號的房客 => 若登出要消除
    room: String,				//房號
    pass: String,				//密碼
    RFID: [Number],				//UID
})

//Create Model
const User = mongoose.model("User", UserSchema);
const HistoryOrder = mongoose.model("Historyorder", HistorySchema);
const Room = mongoose.model("Room", RooomSchema);

module.exports = {User, HistoryOrder, Room}