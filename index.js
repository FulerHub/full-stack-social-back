const authMiddleWare = require( './middleWare/authMiddleWare.js');
const express = require('express');
const fileUpload = require("express-fileupload");
const apiRoutes = require('./routes/apiRoutes');
const db = require('./models');

const path = require('path');


const app = express();


const PORT = process.env.PORT || 9090


app.use(fileUpload({}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/images',express.static(path.join(__dirname,'uploads')));

app.use(function (req, res, next) {
    // res.setHeader('Content-Type', 'application/json');
    // Website you wish to allow to connect
   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', 'https://node.river-fuler.ru');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);
    //console.log(res)
    // Pass to next layer of middleware
    next();
});

app.use(authMiddleWare);

app.use("/api",apiRoutes);

db.sequelize.sync().then(()=>{
    app.listen(PORT, ()=>{
        console.log('Server start on PORT: ',PORT)
    })
});

/**
 * Authorization+
 *{
 *     "POST", "/api/auth/login",  "email,password" //Получить токен авторизацию
 *     "POST", "/api/auth/register", "login,email,password" //Создать нового пользователя
 *     "POST", "/api/auth/check", "" //проверить токен пользователя
 *
 *}
 *Users +
 *{
 *     "GET", "/api/users/",  "" //Получить всех пользователей
 *      "GET", "/api/users/{id}",  "" //Получить конкретного пользователя
 *}
 *Dialogs+
 *{
 *     "GET", "/api/dialogs/",  "" //Получить все свои диалоги
 *      "POST", "/api/dialogs/",  "" //Создать диалог с "userid"
 *      "DELETE", "/api/dialogs/{id}",  "" //Удалить диалог с {id}
 *}
 *Messages
 *{
 *     "GET", "/api/messages/{id}",  "" //Получить сообщения с диалога
 *      "POST", "/api/messages/",  "" //Создать сообщение в диалог "id"(dialog), "message"
 *      "DELETE", "/api/messages/{id}",  "" //Удалить сообщение с диалога {messageID}
 *}
 *Subscribers
 *{
 *     "GET", "/api/subscribers/",  "" //Получить свои подписки
 *     "GET", "/api/subscribers/{id}",  "" //Получить подписки пользователя {userID}
 *      "POST", "/api/subscribers/{id}",  "" //Создать подписку с {userID}
 *      "DELETE", "/api/subscribers/{id}",  "" //Удалить подписку с {userID}
 *}
 *Posts
 *{
 *     "GET", "/api/posts/",  "" //получить все свои посты на странице
 *     "GET", "/api/posts/{userID}",  ""// получить все посты пользователя
 *      "POST", "/api/posts/",  "" //добавить пост пользователю "profileID", "message"
 *       "PUT", "/api/posts/{id}",  "" //обновить пост {id},"message"
 *      "DELETE", "/api/posts/{id}",  "" //Удалить пост  {id}
 *}
 * **/