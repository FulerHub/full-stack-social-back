const authMiddleWare = require( './middleWare/authMiddleWare.js');
const express = require('express');
const fileUpload = require("express-fileupload");
const apiRoutes = require('./routes/apiRoutes');
const db = require('./models');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 9090;

app.use(fileUpload({}));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use('/images',express.static(path.join(__dirname,'uploads')));

app.use(function (req, res, next) {
   // res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Origin', 'https://node.river-fuler.ru');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(authMiddleWare);
app.use("/api",apiRoutes);

db.sequelize.sync().then(()=>{
    app.listen(PORT, ()=>{
        console.log('Server start on PORT: ',PORT)
    })
});