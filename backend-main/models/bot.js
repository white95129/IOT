//line bot
const line = require('@line/bot-sdk');
const linebot = require('linebot');
// 用於辨識Line Channel的資訊
const bot = linebot({
	channelId: '2005586122',
	channelSecret: 'ff6873334a9fab9d7a3c4e09333d2091',
	channelAccessToken: 'LrkyVVTLBV8QnMUiA/SaLDqvq916OhpekbUttrkbfj2JkLakasIBm0u6m3G/sFcpxNc7tfRCCsBvg7+SOVaSK65ABfForE6jijv/Xw5mElKIL4Tvy+3RxZHL3cMOGuentjX4thMuBqFhzl8xyLCTgAdB04t89/1O/w1cDnyilFU='
});
const client = new line.Client({
	channelAccessToken: 'LrkyVVTLBV8QnMUiA/SaLDqvq916OhpekbUttrkbfj2JkLakasIBm0u6m3G/sFcpxNc7tfRCCsBvg7+SOVaSK65ABfForE6jijv/Xw5mElKIL4Tvy+3RxZHL3cMOGuentjX4thMuBqFhzl8xyLCTgAdB04t89/1O/w1cDnyilFU='
})

module.exports = {bot, client}