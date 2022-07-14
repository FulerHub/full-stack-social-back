const db = require('../models')

class SubscribersController  {
    async getMySubscribers(req,res,next){//на кого я подписан
        try {
            const subscribes = await db.Subscribers.findAll({
                where:{
                    userid: req.user.id
                },
                include:[
                    {
                        model:db.Users,
                        attributes: ['id','name','city','avatar'],
                        as: 'subsProfile'
                    },
                ]
            })
            res.status(200).json(subscribes)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async getSubscribers(req,res,next){//кто на меня подписан
        try {
            const subscribes = await db.Subscribers.findAll({
                where:{
                    profileid: req.params.id
                },
                include:[
                    {
                        model:db.Users,
                        attributes: ['id','name','city','avatar'],
                        raw: true,
                        as: 'subsUser'
                    },
                ]
            })
            return res.status(200).json(subscribes)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async addSubscriber(req,res,next){
        try {
            const {userID} = req.body;
            if(userID === req.user.id) return res.status(403).json({ message: 'UserID is wrong' });
            const checkFriend = await db.Subscribers.findOne({
                where:{
                    userid: req.user.id,
                    profileid: userID//req.params.id
                }
            });
            if(checkFriend !== null) return res.status(403).json({ message: 'Friend already added' })
            const user= await db.Subscribers.create({
                userid: req.user.id,
                profileid: userID
            });
            const findSubscriber = await db.Subscribers.findOne({
                where:{
                    id:user.id,
                },
                include:{
                    model:db.Users,
                    attributes: ['id','name','city','avatar'],
                    as: 'subsProfile'
                }
            });
            return res.status(200).json(findSubscriber)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async deleteFriend(req,res,next){
        try {
            if(req.params.id === req.user.id) return res.status(403).json({ message: 'UserID is wrong' });
            const checkFriend = await db.Subscribers.findOne({
                where:{
                    userid: req.user.id,
                    profileid: req.params.id
                }
            });
            if(checkFriend === null) return res.status(403).json({ message: 'Friend not found' })
            const friends = await db.Subscribers.destroy({
                    where:{
                        userid: req.user.id,
                        profileid: req.params.id
                    }
            });
            return res.status(200).json(checkFriend)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
}
module.exports =  new SubscribersController();
