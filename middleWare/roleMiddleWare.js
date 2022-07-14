const role = (roles)=>{
    return (req, res, next) => {
        if(!req.user) return res.status(403).json({ message: 'User not auth' })
        let hasRole = (roles.indexOf(req.user.roles) !== -1);
        if (!hasRole) return res.status(403).json({message: "У вас нет доступа"})
        next()
    }
}

module.exports = role;