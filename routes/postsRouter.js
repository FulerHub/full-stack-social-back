const PostsController = require("../controllers/PostsController.js");
const roleMiddleWare  = require("../middleWare/roleMiddleWare.js");

const express = require('express')
const router = express.Router();

router.get('/',roleMiddleWare([1,2]),PostsController.getPosts)//получить все свои посты на странице
router.get('/:userID',roleMiddleWare([1,2]),PostsController.getPostsUser)// получить все посты на странице пользователя
router.post('/',roleMiddleWare([1,2]),PostsController.addPost)//добавить пост персонажу
router.put('/:id',roleMiddleWare([1,2]),PostsController.updatePost)
router.delete('/:id',roleMiddleWare([1,2]),PostsController.deletePost)

module.exports = router;