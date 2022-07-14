//import db from './models.js';
const db = require('../models')
const fs = require('fs')
const path = require('path')
const { Op } = require("sequelize");

class UserController {
    async getOne(req,res,next){
        try {
           const User = await db.Users.findOne({attributes: ['id','name','status','city','lang','avatar','isLocked','mood','moodAvatar'],where:{id:req.params.id}});

           return res.status(200).json(User)

        }catch (e) {
            if(!e.statusCode) e.statusCode=500
            next(e);
        }
    }
    async getAll(req,res,next){
        try {
            const pageAsNumber = Number.parseInt(req.query.page);
            const sizeAsNumber = Number.parseInt(req.query.size);

            let page = (!Number.isNaN(pageAsNumber) && pageAsNumber > 0) ?  pageAsNumber : 0;
            let size = (!Number.isNaN(sizeAsNumber) && sizeAsNumber > 0 && sizeAsNumber < 100) ?  sizeAsNumber: 100;
            if(req.query.includes){
                const userList = req.query.includes.split(',');//
                return db.Users.findAndCountAll({
                    attributes: ['id','name','date','city','avatar','isLocked','mood','moodAvatar'],
                    where: {
                        id: {
                            [Op.in]:userList,
                            [Op.ne]:req.user.id
                        }
                    },
                    limit: size,
                    offset: page * size,
                }).then(item=>res.status(200).json(item));
            }
            if(req.query.search){
                return db.Users.findAndCountAll({
                    attributes: ['id','name','date','city','avatar'],
                    where: {
                        name: {
                            [Op.like]: '%'+req.query.search+'%'
                        }
                    },
                    limit: size,
                    offset: page * size,
                }).then(item=>res.status(200).json(item));
            }
            const userCount = await db.Users.findAndCountAll({
                attributes: ['id', 'name', 'date', 'city', 'avatar'],
                where: {
                    id: {
                        [Op.ne]:req.user.id
                    }
                },
                limit: size,
                offset: page * size,
            });
            return res.status(200).json(userCount)
        } catch (e) {
            res.status(400).json({message: 'Login error'})
            next(e);
        }
        return res.status(404).json({ message: 'User not found' })
    }
    async addOne(req,res,next){
        try {

        } catch (e) {

        }
        return res.status(404).json({ message: 'User not found' })
    }

}

module.exports = new UserController();