const jwt = require("jsonwebtoken");
const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const db = require('../models');
const path = require('path');

const tokenKey = '1a2b-3c4d-5e6f-7g8h';
class AuthController {
    async registration(req, res,next) {
        try {

          const errors = validationResult(req)
            if (!errors.isEmpty()) return res.status(400).json({message: "Error registration", errors});
            const {login,email,password} = req.body;
            const checkUser = await db.Users.findOne({ where: { email: email} });
            if(checkUser !== null) return res.status(400).json({message: "User with the same name already exists"});
            let hashPassword = bcrypt.hashSync(password, 9);
            const userNew =  await db.Users.create({ name: login, email: email, password: hashPassword });

            return res.status(200).json({
                id: userNew.id,
                email: userNew.email,
                name: userNew.name,
                city: userNew.city,
                lang: userNew.lang,
                status: userNew.status,
                avatar: userNew.avatar,
                groupList: userNew.groupList,
                mood: userNew.mood,
                moodAvatar: userNew.moodAvatar,
                isLocked: userNew.isLocked,
                token: jwt.sign({ id: userNew.id,login:userNew.name,roles: userNew.role }, tokenKey),
            })
        } catch (e) {
            return res.status(400).json({message: 'Can\'t create new user'})
        }
        next()
    }

    async login(req, res) {
        try {
            let {email,password} = req.body;
            const user = await db.Users.findOne({ where: { email: email} });
            const validPassword = bcrypt.compareSync(password, user.password);
            if (!validPassword) return res.status(400).json({message: `Wrong password entered`})
            if (email === user.email && validPassword) {
                return res.status(200).json({
                    id: user.id,
                    email: user.email,
                    name: user.name,
                    city: user.city,
                    lang: user.lang,
                    status: user.status,
                    avatar: user.avatar,
                    groupList: user.groupList,
                    mood: user.mood,
                    moodAvatar: user.moodAvatar,
                    isLocked: user.isLocked,
                    token: jwt.sign({ id: user.id,login:user.name,roles: user.role }, tokenKey),
                })
            }
        } catch (e) {
            res.status(400).json({message: 'Login error'})
        }

    }
    async check(req, res) {
        try {
            if (!req.user) return res.status(401).json({
                message: "Token not valid",
            });
            let user = await db.Users.findOne({ where: { id: req.user.id} });
            user.date = Date.now();
            await user.save();
            return res.status(200).json({
                id: user.id,
                email: user.email,
                name: user.name,
                city: user.city,
                lang: user.lang,
                status: user.status,
                avatar: user.avatar,
                groupList: user.groupList,
                mood: user.mood,
                moodAvatar: user.moodAvatar,
                isLocked: user.isLocked,
            })
        }
        catch (e)
        {
            res.status(400).json({message: 'Check error'})
        }

    }
    async updateMe(req,res,next){
        try {
            let {name,city,lang,status,groupList,isLocked} = req.body;//message
            const findUser = await db.Users.findOne({
                where:{
                    id:req.user.id
                }
            });
            if(findUser === null) return res.status(403).json({ message: 'Wrong messageID' });
            if(name.length < 3) return res.status(403).json({ message: 'The name is too short' });
            findUser.set({name,city,lang,status,groupList,isLocked});
            await findUser.save();
            return res.status(200).json(findUser)
        }catch (e) {
            if(!e.statusCode) e.statusCode=500;
            next(e);
        }
    }
    async uploadAvatar(req, res) {
        try {
            const file = req.files.file;
            const user = await db.Users.findOne({
                attributes: ['id','name','email','city','lang','status','avatar'],
                where:{
                    id: req.user.id
                }
            });
            if(user.avatar !== 'no-user.jpg'){

            }
            let avatarName = 'user'+req.user.id +Date.now()+ ".jpg"
            file.mv(path.join(__dirname,'../uploads/') + avatarName)

            user.avatar = avatarName;
            await user.save();
            return res.json(user);
        } catch (e) {
            return res.status(400).json({message: 'Upload avatar error'})
        }
    }
}



module.exports = new AuthController();