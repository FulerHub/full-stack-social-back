const jwt = require("jsonwebtoken")
const tokenKey = '1a2b-3c4d-5e6f-7g8h';
const auth = (req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization.split(' ')[1], tokenKey, (err, payload) => {
            if(payload){
                req.user = {
                    id: payload.id,
                    roles: payload.roles
                };
            }
            if (!req.user) next()
        })
    }
    next()
}


module.exports = auth;