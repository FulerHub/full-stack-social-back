const UserController = require("../controllers/UsersController.js");
const roleMiddleWare  = require("../middleWare/roleMiddleWare.js");

const express = require('express')
const router = express.Router();

router.get('/',roleMiddleWare([1,2]), UserController.getAll);
router.get('/:id',roleMiddleWare([1,2]), UserController.getOne);
//router.post('/',roleMiddleWare([1,2]), UserController.addOne);
//router.post('/avatar',roleMiddleWare([1,2]), UserController.uploadAvatar);

module.exports = router;