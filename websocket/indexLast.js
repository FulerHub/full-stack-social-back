const ws = require('ws');
const wsServer = new ws.Server({ port: 5000 });

let Players = [];
let Chat = []
const db = require('../models')
const jwt = require("jsonwebtoken")
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const getUserFromToken = (token)=>{
    let user ={}
    jwt.verify(token, tokenKey, (err, payload) => {
        if(payload){
            user = {
                id: payload.id,
                roles: payload.roles
            };
        }
        if (!user) return {};
    })
    return user;
}
const getMessage = async (token,dialogid)=>{
    const user = getUserFromToken(token);

    const dialog = await db.DialogsList.findOne({
        where:{
            userid: user.id,
            dialogid: dialogid
        }
    });
    if(dialog === null) return {message:'Dialog not found'}

    return await db.Messages.findAll({
        where:{
            dialogid:dialogid
        },
        include:{
            attributes: ['id','name','avatar'],
            model:db.Users
        }
    });
}

const addMessage = async (token,dialogID,message)=>{
    const user = getUserFromToken(token);
    const dialog = await db.DialogsList.findOne({
        where:{
            userid: user.id,
            dialogid: dialogID
        }
    });
    if(dialog === null) return {message:'Wrong dialogID'}
    const messageSend = await db.Messages.create({
        message:message,
        userid: user.id,
        dialogid:dialogID

    })
    return await db.Messages.findOne({
        where:{
            id: messageSend.id
        },include:[{
            attributes: ['id','name','avatar'],
            model:db.Users
        }]

    });
}

function onConnect(wsClient) {
    wsClient.id = Date.now();

  //  wsClient.send(JSON.stringify({action:"profile",data:Player}))
 //   wsClient.send(JSON.stringify({action:"get_messages",data:Chat}))

    wsClient.on('close', function() {
        console.log('Пользователь отключился');
    });

    wsClient.on('message', function(message) {
        //console.log(message);
        try {
            const jsonMessage = JSON.parse(message);
            switch (jsonMessage.action) {
                case 'onLoad':
                    wsClient.dialogid = jsonMessage.data.dialogid;
                    break;
                case 'add_message':
                    addMessage(jsonMessage.data.token,jsonMessage.data.dialogid,jsonMessage.data.message).then(value=>{
                        allMessage(jsonMessage.data.dialogid,{action:'add_message',data:value})
                    });
                    break;
                default:
                    console.log('Неизвестная команда');
                    break;
            }
        } catch (error) {
            console.log('Ошибка', error);
        }
    });
}
wsServer.on('connection', onConnect);



function allMessage(dialogid,message){

    wsServer.clients.forEach(client =>{
        console.log('client.id',client.dialogid,dialogid)
        if(client.dialogid === dialogid)
        {
            client.send(JSON.stringify(message))
        }


    })
}

console.log('Сервер запущен на 5000 порту');