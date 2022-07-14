const ws = require('ws');
const wsServer = new ws.Server({ port: 5000 });
let Chat = [];

let Players = [];
const db = require('../models')
const jwt = require("jsonwebtoken");
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
    });
    return user;
};
const getDialogs = async (userID)=>{
    return await db.DialogsList.findAll({
        attributes: ['dialogid'],
        where:{
            userid: userID
        }
    });

}

const addMessage = async (id,dialogID,message)=>{
    //const user = getUserFromToken(token);
    const dialog = await db.DialogsList.findOne({
        where:{
            userid: id,
            dialogid: dialogID
        }
    });
    if(dialog === null) return {message:'Wrong dialogID'}
    dialog.set({
        lastTime: new Date()
    });
    await dialog.save();
    const messageSend = await db.Messages.create({
        message:message,
        userid: id,
        dialogid:dialogID

    });

    return await db.Messages.findOne({
        where:{
            id: messageSend.id
        },include:[{
            attributes: ['id','name','avatar'],
            model:db.Users
        }]

    });
};

function onConnect(wsClient) {
    //wsClient.id = Date.now();

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
                    wsClient.user = getUserFromToken(jsonMessage.data.token);
                    getDialogs(wsClient.user.id).then(value => {
                        const dialogListArray = value.map(item=>item.dialogid);
                        wsClient.dialogs = dialogListArray;
                    })
                    break;
                case 'load_dialog':
                    wsClient.dialogs.push(jsonMessage.data.dialogid);
                    break;
                case 'add_message':
                    if(!wsClient.user) return wsClient.send(JSON.stringify({message:'Yamete kudasai'}))
                    wsClient.dialogid = jsonMessage.data.dialogid;
                    addMessage(wsClient.user.id,jsonMessage.data.dialogid,jsonMessage.data.message).then(value=>{
                        allMessage(jsonMessage.data.dialogid,{action:'add_message',data:value})
                    });
                    break;
                default:
                    console.log('Unknown command');
                    break;
            }
        } catch (error) {
            console.log('ITS ERROR', error);
        }
    });
}
wsServer.on('connection', onConnect);



function allMessage(dialogid,message){

    wsServer.clients.forEach(client =>{
        if(client.dialogs.indexOf(Number(dialogid)) !== -1)
        {
            client.send(JSON.stringify(message))
        }


    })
}

console.log('Сервер запущен на 5000 порту');