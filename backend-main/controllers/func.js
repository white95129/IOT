const {User, HistoryOrder, Room} = require("../models/schema")
const {bot, client} = require("../models/bot")

let UserName , UserID ;
let OrderUserName , OrderUserID;	//儲存目前要送訂單的人的資訊
let ServerCanOrder=true;       		//一次只能一人訂餐
//每間房間都應有相對應之預設密碼儲存於Database
let passcode, Roomnum, password;
let OrderSend; 					//send 車子訂單資訊

/******Bot相關******/
const linebotParser = bot.parser();

const Bot_Follow = (event) => {
    client.getProfile(event.source.userId).then((profile) => {
        UserID = event.source.userId;
        UserName = profile.displayName;  
        console.log(profile.displayName); //顯示使用者名字
        console.log(profile.userId);
        console.log(profile.pictureUrl); // 顯示使用者大頭照網址
        console.log(profile.statusMessage) // 使用者自介內容le.displayName;
    }).catch((err) => {
        // error handling
    });
    event.reply('需要點餐請先登入，登入格式為：ROOM房號-密碼\n密碼可於您的房卡上找到！');
}

const Bot_Message = async(event) => {
    //獲取用戶資料
    client.getProfile(event.source.userId).then((profile)=>{
        UserID = event.source.userId;
        UserName = profile.displayName;
    }).catch((err) => {
        // error handling
    });///
    //查詢用戶訊息和房間訊息
    //console.log(UserID);
    //console.log(UserName);
    //console.log(profile.displayName); //顯示使用者名字
    //console.log(profile.userId);
    //console.log(profile.pictureUrl); // 顯示使用者大頭照網址
    //console.log(profile.statusMessage) // 使用者自介內容le.displayName;
    
    //let UserID="U3e32fb149e068d91e0fcef163e47db50";
    //let UserName ="henry";
    
    try{
        let userdata = await User.findOne({UserID:UserID,UserName:UserName})
        
            console.log("已找到使用者資訊\n", userdata);
            let roomdata = await Room.findOne({ CurrentUserID: UserID, CurrentUserName: UserName })
        
            console.log("已找到使用者房間資訊\n", roomdata);
            console.log(roomdata,userdata);
            //比對資料庫的房號以及使用者ID=>是否已登入/////////////
            if(userdata != null && roomdata != null){
            //使用者登出 //event.reply("歡迎");
            if(roomdata.Islogin){
                    switch (event.message.text) {
                    //使用者LineBot訂餐
                    case "我要點餐":
                        OrderUserID = UserID;
                        OrderUserName = UserName;
                        event.reply("以下為菜單\n請選取餐點後點選提交(Submit)：\nhttp://192.168.56.1:3000");
                        break;
                    case "登出系統":
                        await Room.findOneAndUpdate({ CurrentUserName: UserName, CurrentUserID: UserID }, { Islogin: false, CurrentUserName: null, CurrentUserID: null }, { new: true }).then(mes => {
                            console.log(mes);
                        }).catch((e) => {
                            console.log("Error", e);
                        });
                        await User.findOneAndUpdate({ UserName: UserName, UserID: UserID }, { room: null }, { new: true }).then(mes => {
                            console.log(mes);
                        }).catch((e) => {
                            console.log("Error", e);
                        });
                        event.reply(UserName + '您已登出系統！\n若要再次使用服務請重新登入！');
                        break;
                        case "歷史查詢":
                        //比對資料庫的房號以及使用者ID=>先提取User總訂單數再用迴圈把每一筆提出來
                        let userdata = await User.findOne({ UserID: UserID, UserName: UserName }) ;
                
                        let stringfororder = "";
                        let stringmenu = "";
                        stringfororder += (UserName + '您好\n您目前的總消費金額為 NTD ' + userdata.totalmoney + "元\n總共有" + userdata.orderNUM + "筆訂單資料！");
                        stringfororder += "\n------------------------------------";
                        console.log("找到使用者總訂單數\n");
                        for (i = 0; i < userdata.orderNUM; i++) {
                            let stringmenu = "";
                            console.log("第" + (i + 1) + "筆訂單");
                            try {
                                let historydata = await historyOrder.findOne({ UserID: UserID, orderNUM: i + 1 })
                                        .then((docs)=>{console.log("Result :",docs);})
                                        .catch((err)=>{
                                        console.log(err);
                                    });

                                if (historydata != null) {
                                    for (k = 0; k < 10; k++) {
                                        console.log("這是Historydata測試\n" + historydata);
                                        console.log("這是k:" + k);
                                        if (historydata.order[k] != 0) {
                                            switch (k) {
                                                case 0:
                                                    stringmenu += ("\n牛肉麵×" + historydata.order[k] + "   NTD " + historydata.order[k] * 120 + "元");
                                                    break;
                                                case 1:
                                                    stringmenu += ("\n小籠包×" + historydata.order[k] + "   NTD " + historydata.order[k] * 90 + "元");
                                                    break;
                                                case 2:
                                                    stringmenu += ("\n滷肉飯×" + historydata.order[k] + "   NTD " + historydata.order[k] * 30 + "元");
                                                    break;
                                                case 3:
                                                    stringmenu += ("\n蚵仔麵線×" + historydata.order[k] + "   NTD " + historydata.order[k] * 60 + "元");
                                                    break;
                                                case 4:
                                                    stringmenu += ("\n蚵仔煎×" + historydata.order[k] + "   NTD " + historydata.order[k] * 55 + "元");
                                                    break;
                                                case 5:
                                                    stringmenu += ("\n臭豆腐×" + historydata.order[k] + "   NTD " + historydata.order[k] * 50 + "元");
                                                    break;
                                                case 6:
                                                    stringmenu += ("\n雞排×" + historydata.order[k] + "   NTD " + historydata.order[k] * 65 + "元");
                                                    break;
                                                case 7:
                                                    stringmenu += ("\n珍珠奶茶×" + historydata.order[k] + "   NTD " + historydata.order[k] * 45 + "元");
                                                    break;
                                                case 8:
                                                    stringmenu += ("\n刨冰×" + historydata.order[k] + "   NTD " + historydata.order[k] * 50 + "元");
                                                    break;
                                                case 9:
                                                    stringmenu += ("\n鳳梨酥×" + historydata.order[k] + "   NTD " + historydata.order[k] * 80 + "元");
                                                    break;
                                                default:
                                                    break;
                                            }
                                        }
                                    }
                                        switch (historydata.orderstatus) {
                                            case "working":
                                            stringmenu += ("\n\n此筆訂單目前還在運送中或處理中！");
                                            break;
                                        case "canceled":
                                            stringmenu += ("\n\n此筆訂單已經取消！");
                                            break;
                                        case "finished":
                                            stringmenu += ("\n\n此筆訂單已經運送完成！");
                                            break;
                                        default:
                                            break;
                                        }
                                    stringfororder += ("\n第" + (i + 1) + "筆訂單明細如下：" + stringmenu + "\n此筆訂單消費金額為:NTD " + historydata.money + "元\n------------------------------------");
                                }
                            }catch (e) {
                                console.log("Error\n", e);
                            };
                        }
                        event.reply(stringfororder);
                            break;
                        default:
                        event.reply('請點選選單圖片或打歷史查詢，我要點餐，登出系統以使用我們的服務');
                        break;  
                    }
            }
            }else{ 
                console.log("not user");
                Roomnum = event.message.text[4];
                console.log("2 ",Roomnum);
                let roomdata2 = await Room.findOne({ room: Roomnum });
                console.log("3 ",roomdata2);
                passcode = roomdata2.pass;
                password = ('ROOM' + Roomnum + '-' + passcode);
                console.log("4 ",password);
                switch(event.message.text){
                    //使用者LineBot登入
                    //比對房號及密碼
                    case password:
                        //登入成功
                        let userdata2 = await User.findOne({ UserName: UserName, UserID: UserID })
                            .then((docs)=>{console.log("Result :",docs);})
                            .catch((err)=>{
                            console.log(err);
                        });
                        if (userdata2 != null) {
                            await User.updateOne({ UserName: UserName, UserID: UserID }, { room: Roomnum });
                        }else{
                        const UserOBJ = new User({
                            UserID: UserID,
                            UserName: UserName,
                            totalmoney: 0,
                            room: Roomnum,
                            Isorder: false,
                            orderNUM: 0,
                        })
                        await UserOBJ.save().then(() => {
                            console.log("User Data Saved.");
                        }).catch((e) => {
                            console.log("Error");
                            console.log(e);
                        });
                        }
                        await Room.updateOne({ room: Roomnum }, { Islogin: true, CurrentUserName: UserName, CurrentUserID: UserID });
                        event.reply('登入成功！\n' + UserName + '您好，很高興為您服務！\n如欲觀看菜單請輸入:我要點餐');
                        break;
                    //登入失敗
                    default:
                        event.reply('請按照格式輸入：ROOM房號-密碼\n範例：ROOMa-0000\n若有疑問請洽櫃台！');
                    break;
                }
            }
    }catch(e){
        event.reply('請按照格式輸入：ROOM房號-密碼\n範例：ROOMa-0000\n若有疑問請洽櫃台！');
        console.log("Error\n", e);
    }
}

/******函式******/
async function finduser() {
    await User.findOne({ UserName: 'henry' }).then(UserName => {
        if (UserName) {
            console.log("user already exists:", UserName);
        } else if(UserName==null) {
            const userOBJ = new User({
                UserID: "U3e32fb149e068d91e0fcef163e47db50",
                UserName: "henry",
            });

            userOBJ.save() .then(() => {
                console.log("user Data Saved.");
            }).catch(e => {
                console.log("Error");
                console.log(e);
            });
        }
    }).catch(error => {
        console.error("Error:", error);
    });
}

async function findOrCreateRoom() {
	await Room.findOne({ room: 'k' }).then(room => {
  		if (room) {
      		console.log("Room already exists:", room);
  		}else if(room==null) {
      		const RoomOBJ = new Room({
				Islogin: false,
				room: "k",
				pass: "5566",
				// RFID: [161, 25, 227, 27],
			});

			RoomOBJ.save().then(() => {
				console.log("RoomK Data Saved.");
			}).catch(e => {
				console.log("Error", e);
			});
  		}
	}).catch(error => {
		console.error("Error:", error);
	});
}

async function GetCanceled() {
	try {
		let userdata = await User.findOne({ UserID: OrderUserID, UserName: OrderUserName }).clone().catch(function (err) { console.log(err) });
		console.log("已找到此筆訂單消費者.\n");
		console.log(userdata);
		console.log(OrderUserID);
		console.log(userdata.totalmoney);

		let historydata = await historyOrder.findOne({ UserID: OrderUserID, orderNUM: userdata.orderNUM });
		console.log(historydata.money);

		let newmoney = userdata.totalmoney - historydata.money;
		console.log(newmoney);

		await historyOrder.updateOne({ UserID: OrderUserID, orderNUM: userdata.orderNUM }, { orderstatus: "canceled", money: 0 });
		console.log("已更新消費者此筆訂單取消.\n", historydata);
		const q = await User.updateOne({ UserID: OrderUserID, UserName: OrderUserName }, { totalmoney: (newmoney) })
			.clone().catch(function (err) { console.log(err) })
			.then(() => {
				console.log("已取消消費者上筆訂單金額.\n");
			})
			.catch((e) => {
				console.log("Error\n");
				console.log(e);
			});
		await q;
		ServerCanOrder = true;
	}catch (e) {
		console.log("Error\n", e);
	}
}

const CORS = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	// handle OPTIONS method
	if ('OPTIONS' == req.method) {
		return res.sendStatus(200);
	} else {
		next();
	}
}

/******App相關******/
const App_Update = async (req, res) => {
	await User.findOne({ UserID: OrderUserID, UserName: OrderUserName, Isorder: true }, async function (error, user) {
		let data = user;
		if (data != null) {
			await User.updateOne({ UserID: OrderUserID, UserName: OrderUserName, Isorder: true }, { Isorder: false })
				.then(() => {
					console.log("已更新消費者Isorder狀態為false.\n");
				})
				.catch((e) => {
					console.log("Error\n");
					console.log(e);
				});
			res.send("1");
		}
		else
			res.send("0");
	}).then((msg) => {
		console.log("訂餐者資訊", msg);
	}).catch((e) => {
		console.log("Error", e);
	});
}

const App_Order = (req, res) => {
    res.send(OrderSend);
}

const App_Arrive = (req, res) => {
    bot.push(OrderUserID, OrderUserName + '您好，訂購的餐點已抵達房門口！\n請使用房卡刷卡後取餐！');
    res.send();
}

const App_Moveon = (req, res) => {
    console.log(OrderUserID);
	console.log(OrderUserName);
	bot.push(OrderUserID, OrderUserName + '您好，您訂購的餐點正在運送途中！\n提醒您記得留意抵達通知！');
	res.send();
}

const App_Accident = (req, res) => {
	bot.push(OrderUserID, OrderUserName + '您好，您的餐點在未刷卡的情況下被取走。');
	res.send();
}

const App_LoseWeight = (req, res) => {
    bot.push(OrderUserID, OrderUserName + '您好，您的餐點重量異常減少。');
    res.send();
}

const App_TimeOut = async (req, res) => {
	bot.push(OrderUserID, OrderUserName + '您好，因為逾時未刷卡以及取餐\n所以我們已經取消此筆訂單。');
	//GetCanceled();
	res.send();
}

const App_Canceled = async (req, res) => {
    bot.push(OrderUserID, OrderUserName + '您好，因為您的訂單出現錯誤\n所以我們已經取消此筆訂單\n造成您的困擾非常抱歉！');
	GetCanceled();
	res.send();
}

const App_Completed = async(req, res) => {
    bot.push(OrderUserID, '訂單取餐完成！\n感謝您使用我們的服務，祝您用餐愉快！');
	try{
		let odm;
		const userdata = await User.findOne({ UserID: OrderUserID, UserName: OrderUserName })
			.clone().catch(function (err) { console.log(err) })
			.then((msg) => {
				console.log("已找到此筆訂單消費者.\n");
				console.log(msg);
				odm = msg.orderNUM;
			}).catch((e) => {
				console.log("Error\n", e);
			});
			console.log("data" + userdata);
			console.log("odm" + odm);
			await userdata;
			await historyOrder.updateOne({ UserID: OrderUserID, orderNUM: odm }, { orderstatus: "finished" })
				.clone().catch(function (err) { console.log(err) })
				.then((msg) => {
					console.log("已更新此筆訂單狀態.\n", msg);
				})
				.catch((e) => {
					console.log("Error\n", e);
				});
	}catch(e){
		console.log(e);
	}
	ServerCanOrder = true;
	res.send();
}

const App_Menu = async (req, res) => {
	//提取訂單資訊與金額 =>儲存到DataBase
	console.log(ServerCanOrder);
	if (ServerCanOrder){
		try{
			let { product, total } = req.body;
			let userdata = await User.findOneAndUpdate({ UserID: OrderUserID, UserName: OrderUserName }, { Isorder: true }, { new: true })
				.clone().catch(function (err) { console.log(err) });
			console.log("已提取訂餐使用者資訊.\n", userdata.totalmoney);
			await User.updateOne({ UserID: OrderUserID, UserName: OrderUserName }, { orderNUM: userdata.orderNUM + 1, totalmoney: userdata.totalmoney + total })
				.clone().catch(function (err) { console.log(err) })
				.then((msg) => {
					console.log("已更新使用者訂單數.\n", msg);
				})
				.catch((e) => {
					console.log("Error\n", e);
				});
			const HistoryOBJ = new historyOrder({
				UserID: OrderUserID,
				orderNUM: userdata.orderNUM + 1,
				order: product,
				money: total,
				orderstatus: "working",
				RFIDWrong: 0,
			})
			await HistoryOBJ.save()
				.then(() => {
					console.log("User Order Saved.\n");
				})
				.catch((e) => {
					console.log("Error\n", e);
				});
			let roomdata = await Room.findOne({ CurrentUserID: OrderUserID, CurrentUserName: OrderUserName, Islogin: true })
				.then((docs)=>{console.log("Result :",docs);})
				.catch((err)=>{
					console.log(err);
				});
			console.log("已提取使用者房間資訊.\n", roomdata);
			OrderSend = { "menu": product, "room": roomdata.room, "name": OrderUserName, "rfid": roomdata.RFID };
			console.log("訂單資訊" + product);
			console.log(product[0]);
			console.log("金額" + total);
			bot.push(OrderUserID, OrderUserName + '您好\n我們已經收到您的訂單！\n餐點正在製作中，請稍後片刻！');
			ServerCanOrder = false;
			res.send();
		}catch(e){
			console.log("error\n", e);
		}
	}
}
module.exports = {
    linebotParser, Bot_Follow, Bot_Message,
    finduser, findOrCreateRoom, GetCanceled, CORS,
    App_Update, App_Order, App_Arrive, App_Moveon, App_Accident, App_LoseWeight, App_TimeOut, App_Canceled, App_Completed, App_Menu}