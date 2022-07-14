/*
var request = require('request');

var URL = 'http://www.ferra.ru/ru/techlife/news/';

*/
//import db from './models.js';
//const request = require('request');
const request = require('request-promise');
const jsDom = require("jsdom");

class TelegramController {

    async getPosts(req,res,next){
        try {
            const posts = [];
            if(req.query.channels) {
                const channels = req.query.channels.split(',');//
                console.log('channels', channels)
                await Promise.all(channels.map(item => {
                    const URL = "https://tgstat.ru/channel/@" + item;
                    return request({method: 'GET', url: URL}).then((DOM)=>{
                        const document = new jsDom.JSDOM(DOM);
                        const postsBody = document.window.document.querySelector(".posts-list");
                        postsBody.querySelectorAll(".card").forEach(item=>{
                            posts.push({
                                logo: (item.querySelector(".post-header .rounded")) && item.querySelector(".post-header .rounded").src,
                                channel: (item.querySelector(".post-header .media-body a")) && item.querySelector(".post-header .media-body a").textContent,
                                date: (item.querySelector(".post-header .text-muted small")) && item.querySelector(".post-header .text-muted small").textContent,
                                content:{
                                    image:(item.querySelector(".post-img .post-img-img")) && item.querySelector(".post-img .post-img-img").src,
                                    media:{
                                        video: (item.querySelector(".post-body .wrapper-video-video source")) && item.querySelector(".post-body .wrapper-video-video source").src,
                                        poster: (item.querySelector(".post-body .wrapper-video-video")) && item.querySelector(".post-body .wrapper-video-video").poster,
                                    },
                                    text:(item.querySelector(".post-body .post-text")) && item.querySelector(".post-body .post-text").innerHTML,
                                },
                                statistic:{
                                    views: (item.querySelector(".col.col-12.d-flex > a:first-child")) && item.querySelector(".col.col-12.d-flex > a:first-child").textContent.replace(/\n| /g, ''),
                                    shares: (item.querySelector(".col.col-12.d-flex span")) && item.querySelector(".col.col-12.d-flex span").textContent.replace(/\n| /g, '')
                                }
                            })
                        })//media-body
                    })
                }))
            }
            return res.status(200).json(posts)
        } catch (e) {
            res.status(400).json({message: 'Login error'})
            next(e);
        }
        return res.status(404).json({ message: 'User not found' })
    }


}

module.exports = new TelegramController();