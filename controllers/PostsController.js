const db = require('../models');
const { Op } = require("sequelize");

class PostsController  {
    async getPosts(req,res,next){
        try {
            const posts = await db.Posts.findAll({
                where:{
                    profileid: req.user.id,
                },
                include:[{
                    attributes: ['id','name','avatar'],
                    model:db.Users
                }]
            });
            if(posts === null) return res.status(403).json({ message: 'Wrong postID' })
            return res.status(200).json(posts)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async getPostsUser(req,res,next){
        try {
            const findUser = await db.Users.findOne({
                where:{
                    id:req.params.userID
                }
            });
            if(findUser === null) res.status(400).json({ message: 'User not found' });
            if(findUser.isLocked && findUser.id !== req.user.id) return res.status(403).json({ message: 'Profile is Closed' })
            const posts = await db.Posts.findAll({
                where:{
                    profileid: req.params.userID
                },
                include:[{
                    attributes: ['id','name','avatar'],
                    model:db.Users
                }]
            });
            if(posts === null) return res.status(403).json({ message: 'Wrong postID' })
            return res.status(200).json(posts)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500;
            next(e);
        }
    }
    async addPost(req,res,next){
        try {
            let {profileID,message} = req.body;//message
            const findUser = await db.Users.findOne({
                where:{
                    id:profileID ? profileID : req.user.id
                }
            });
            if(findUser === null) res.status(400).json({ message: 'User not found' });
            if(findUser.isLocked && findUser.id !== req.user.id) return res.status(403).json({ message: 'Profile is Closed' })
            const post = await db.Posts.create({
                message: message,
                userid: req.user.id,
                profileid:profileID ? profileID : req.user.id
            });
            const findPost = await db.Posts.findOne({
                where:{
                    id:post.id,
                },
                include:{
                    model:db.Users,
                    attributes: ['id','name','avatar']
                }
            });
            return res.status(200).json(findPost)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500;
            next(e);
        }
    }
    async updatePost(req,res,next){
        try {
            let {message} = req.body;//message
            const findPost = await db.Posts.findOne({
                where:{
                    id:req.params.id,
                    userid: req.user.id,
                }
            });
            if(findPost === null) return res.status(403).json({ message: 'Wrong postID' })
            findPost.set({
                message:message
            })
            await findPost.save();
            return res.status(200).json(findPost)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500;
            next(e);
        }
    }
    async deletePost(req,res,next){
        try {
            const findPost = await db.Posts.findOne({
                where:{
                    id:req.params.id,
                    [Op.or]: [
                        { userid: req.user.id },
                        { profileid: req.user.id }
                    ]

                }
            });
            if(findPost === null) return res.status(403).json({ message: 'Wrong postID' });
            const deletePost = await db.Posts.destroy({
                where:{
                    id:req.params.id,
                }
            });
            return res.status(200).json(findPost);
        }catch (e) {
            if(!e.statusCode) e.statusCode=500;
            next(e);
        }
    }
}


module.exports = new PostsController();