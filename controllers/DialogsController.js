const db = require('../models')
const { Op } = require("sequelize");


class DialogsController  {
    async getUnreadMessage(req, res,next){
        const [messages] = await db.sequelize.query(`SELECT * FROM Messages WHERE id IN(SELECT MAX(id) FROM Messages WHERE dialogid IN(${dialogListArrayString}) GROUP BY dialogid DESC)`,{});
        //SELECT COUNT(*),dialogid FROM Messages WHERE dialogid IN(1,2,3) AND createdAt > '2022-07-09 19:29:11' GROUP BY dialogid
//SELECT dialogid FROM DialogsLists WHERE userid=1 ALL
    }
    async getDialogs(req,res,next){
        try {
            const dialogList = await db.DialogsList.findAll({//[Op.in]:req.user.id
                attributes: ['dialogid'],
                where: {
                    userid:req.user.id
                }
            });
            if(!dialogList.length) return res.status(200).json([]);
            const dialogListArray = dialogList.map(item=>item.dialogid);//sequelize.literal('(SELECT SUM("Orders"."amount") FROM "Orders" WHERE "Orders"."CustomerId" = "Customer"."id")')
          /*  const lastTimeList ={};
            dialogList.forEach(item=>{
                lastTimeList[item.dialogid] = new Date(item.lastTime).getTime();
            })*/
            const dialogListUser = await db.DialogsList.findAll({//[Op.in]:req.user.id
                where: {
                    [Op.and]:{
                        userid: {
                            [Op.ne]:req.user.id
                        },
                        dialogid:{
                            [Op.in]:dialogListArray
                        }
                    }
                }
            });
            const dialogListArrayString = dialogListArray.join(',')//SELECT * FROM messages WHERE id IN(SELECT MAX(id) FROM messages WHERE dialogid IN(${dialogListArrayString}) GROUP BY dialogid DESC)
            const [messages] = await db.sequelize.query(`SELECT * FROM Messages WHERE id IN(SELECT MAX(id) FROM Messages WHERE dialogid IN(${dialogListArrayString}) GROUP BY dialogid DESC)`,{});
            const [readMessage] = await db.sequelize.query(`SELECT COUNT(*) AS messages,DialogsLists.dialogid FROM Messages, DialogsLists WHERE Messages.dialogid=DialogsLists.dialogid AND DialogsLists.userid=${req.user.id} AND (DialogsLists.lastTime < Messages.createdAt) AND Messages.userid != ${req.user.id} GROUP BY DialogsLists.dialogid`,{});

            const messageList ={};
            const messageUserList ={};
            const messageUserTimeList ={};
            const countsUnreadMessages ={};
            readMessage.forEach(item=>{
                countsUnreadMessages[item.dialogid] = item.messages;
            })
            messages.forEach(item=>{
                messageList[item.dialogid] = item.message;
                messageUserList[item.dialogid] = item.userid;
                messageUserTimeList[item.dialogid] =  new Date(item.createdAt).getTime();
            })
            const result = dialogListUser.map(item=>{
                return {
                    id: item.id,
                    userid: item.userid,
                    dialogid: item.dialogid,
                  //  lastTime: lastTimeList[item.dialogid],
                    unReadMessages: countsUnreadMessages[item.dialogid] ? countsUnreadMessages[item.dialogid] : 0,
                    last:{
                        userid: messageUserList[item.dialogid]? messageUserList[item.dialogid] : req.user.id,
                        message:messageList[item.dialogid] ? messageList[item.dialogid] : "",
                        lastTimeMessage: messageUserTimeList[item.dialogid],
                    }

                }
            })
            const resultSort = result.sort((a, b) => a.last.lastTimeMessage < b.last.lastTimeMessage ? 1 : -1)
            return res.status(200).json(resultSort);
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async getDialog(req,res,next){
        try {
            const dialog = await db.DialogsList.findOne({//[Op.in]:req.user.id
                attributes: ['dialogid'],
                where: {
                    userid:req.user.id,
                    dialogid:req.params.id,
                }
            });

            if(dialog === null) return res.status(400).json({ message: 'Dialog not found' });
            const dialogListUser = await db.DialogsList.findOne({//[Op.in]:req.user.id
                where: {
                    [Op.and]:{
                        userid: {
                            [Op.ne]:req.user.id
                        },
                        dialogid:dialog.dialogid
                    }
                },
                include:{
                    attributes: ['id','name','date','avatar'],
                    model:db.Users
                }
            });

            return res.status(200).json(dialogListUser);
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async addDialog(req,res,next){
        try {
            const {userid,name} = req.body;
            const dialogList = await db.DialogsList.findAll({
                attributes: ['dialogid'],
                where: {
                    userid:req.user.id
                }
            });
            if(dialogList.length > 0 ){
                const dialogListArray = dialogList.map(item=>item.dialogid);
                const dialogListUser = await db.DialogsList.findAll({
                    where: {
                        [Op.and]:{
                            userid: {
                                [Op.ne]:req.user.id
                            },
                            dialogid:{
                                [Op.in]:dialogListArray
                            },
                            groups: false
                        }
                    }
                });
                const dialogListUserArray = dialogListUser.filter((item)=> item.userid == userid);
                if(dialogListUserArray.length > 0) return res.status(201).json(dialogListUserArray);//
            }

            const dialog = await db.Dialogs.create({name:name});
            await db.DialogsList.create({userid:req.user.id,dialogid:dialog.id,lastTime: new Date()})
            const result = await db.DialogsList.create({userid:userid,dialogid:dialog.id,lastTime:new Date()})
            return res.status(200).json([result])
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async deleteDialog(req,res,next){
        try {
            const dialogList = await db.DialogsList.findAll({
                where: {
                    id:req.params.id,
                    userid:req.user.id
                }
            });
            if(dialogList === null) return res.status(400).json({ message: 'Dialog not found' });
            const deleted= await db.DialogsList.destroy({
                where:{
                    id:req.params.id
                }

            });

            return res.status(200).json(dialogList)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
}

module.exports = new DialogsController();
