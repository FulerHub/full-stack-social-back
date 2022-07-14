const db = require('../models')

class MessagesController  {
    async getMessagesDialog(req,res,next){
        try {
            const dialog = await db.DialogsList.findOne({
                where:{
                    userid: req.user.id,
                    dialogid: req.params.dialogID
                }
            });
            if(dialog === null) return res.status(403).json({ message: 'Wrong dialogID' })
            dialog.set({
                lastTime: new Date()
            });
            await dialog.save();
            const messages = await db.Messages.findAll({
                where:{
                    dialogid:req.params.dialogID
                },
                include:{
                    attributes: ['id','name','avatar'],
                    model:db.Users
                },
                order: [
                    ['id', 'ASC'],
                ],
            })
            return res.status(200).json(messages)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async addMessageToDialog(req,res,next){
        try {
            const {dialogID,message} = req.body;
            const dialog = await db.DialogsList.findOne({
                where:{
                    userid: req.user.id,
                    dialogid: dialogID
                }
            });
            if(dialog === null) return res.status(403).json({ message: 'Wrong dialogID' })
            const messageSend = await db.Messages.create({
                message:message,
                userid: req.user.id,
                dialogid:dialogID

            })
            const messageNew = await db.Messages.findOne({
                where:{
                    id: messageSend.id
                },include:[{
                    attributes: ['id','name','avatar'],
                    model:db.Users
                }]

            });
            return res.status(200).json(messageNew)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async updateMessage(req,res,next){
        try {
            let {message} = req.body;//message
            const findMessage = await db.Messages.findOne({
                where:{
                    id:req.params.id,
                    userid: req.user.id,
                }
            });
            if(findMessage === null) return res.status(403).json({ message: 'Wrong messageID' })
            findMessage.set({
                message:message
            })
            await findMessage.save();
            return res.status(200).json(findMessage)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async deleteMessage(req,res,next){
        try {
            const message = await db.Messages.findOne({
                where:{
                    id:req.params.id,
                    userid: req.user.id,
                }
            });
            if(message === null) return res.status(403).json({ message: 'Wrong messageID' })
            const deleteMessage = await db.Messages.destroy({
                where:{
                    id:req.params.id,
                    userid: req.user.id,
                }
            })
            return res.status(200).json(message)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
}


module.exports = new MessagesController();