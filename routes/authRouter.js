const authController = require("../controllers/AuthController.js");
const express = require('express');
const {check} = require('express-validator');
const router = express.Router();

router.post('/register', [
    check('login', "Login must be more than 3 and less than 32 characters").isLength({min:3, max:32}),
    check('email', "Email must be not empty/Wrong email").isEmail(),
    check('password', "Password must be more than 6 and less than 24 characters").isLength({min:6, max:24})], authController.registration)
router.post('/login', authController.login);
router.post('/check', authController.check);
router.post('/update', authController.uploadAvatar);
router.put('/setting', authController.updateMe);

module.exports = router;

/*
const Router = require('express')
const router = new Router()
const controller = require('./authController')
const {check} = require("express-validator")
const authMiddleware = require('./middlewaree/authMiddleware')
const roleMiddleware = require('./middlewaree/roleMiddleware')

router.post('/registration', [
    check('username', "Имя пользователя не может быть пустым").notEmpty(),
    check('password', "Пароль должен быть больше 4 и меньше 10 символов").isLength({min:4, max:10})
], controller.registration)
router.post('/login', controller.login)
router.get('/users', roleMiddleware(["ADMIN"]), controller.getUsers)

module.exports = router*/
