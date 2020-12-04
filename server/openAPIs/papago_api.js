const config = require('../config/config')
const request = require('request');

const PAPAGO_URL = 'https://openapi.naver.com/v1/papago/n2mt'
const dPAPAGO_URL = 'https://openapi.naver.com/v1/papago/detectLangs'
const PAPAGO_ID = process.env.PAPAGO_ID
const PAPAGO_SECRET = process.env.PAPAGO_SECRET

exports.trans = (message, lang, io, room) => {
    request.post(
        {
            url: PAPAGO_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': `${PAPAGO_ID}`,
                'X-Naver-Client-Secret': `${PAPAGO_SECRET}`
            },
            body: `source=${lang}&target=ko&text=` + message,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                var Translated = body.message.result.translatedText;
                io.to(room).emit('chat message', "trans", Translated);
            }
        });
}


exports.detect = (message,io,room) => {
    request.post(
        {
            url: dPAPAGO_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': `${PAPAGO_ID}`,
                'X-Naver-Client-Secret': `${PAPAGO_SECRET}`
            },
            body: `query=` + message,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                var lang = body.langCode;
                if(lang != 'ko'){
                    this.trans(message,lang,io,room)
                }
            }
        });
}

exports.transchat = (message, lang, client, target) => {
    request.post(
        {
            url: PAPAGO_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': `${PAPAGO_ID}`,
                'X-Naver-Client-Secret': `${PAPAGO_SECRET}`
            },
            body: `source=${lang}&target=ko&text=` + message,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                var Translated = body.message.result.translatedText;
                client.say(target, "(번역) ", Translated);
            }
        });
}

exports.detectchat = (message, client,target) => {
    request.post(
        {
            url: dPAPAGO_URL,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                'X-Naver-Client-Id': `${PAPAGO_ID}`,
                'X-Naver-Client-Secret': `${PAPAGO_SECRET}`
            },
            body: `query=` + message,
            json:true
        },(error, response, body) => {
            if(!error && response.statusCode == 200) {
                var lang = body.langCode;
                if(lang != 'ko'){
                    this.trans(message,lang,client,target)
                }
            }
        });
}