module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define("Users", {
        name:{
            type: DataTypes.STRING,
        },
        password:{
            type: DataTypes.STRING,
        },
        email:{
            type: DataTypes.STRING,
            unique: true
        },
        role:{
            type: DataTypes.INTEGER,
            defaultValue: 1
        },
        date:{
            type: DataTypes.STRING,
        },
        status:{
            type: DataTypes.STRING,
        },
        city:{
            type: DataTypes.STRING,
        },
        lang:{
            type: DataTypes.STRING,
        },
        avatar:{
            type: DataTypes.STRING,
            defaultValue: 'no-user.jpg'
        },
        groupList:{
            type: DataTypes.STRING,
        },
        mood:{
            type: DataTypes.INTEGER
        },
        moodAvatar:{
            type: DataTypes.STRING,
        },
        isLocked:{
            type: DataTypes.BOOLEAN,
        }
    });
    Users.associate = models => {
       // Users.hasMany(models.DialogsList,{foreignKey: 'userid'});


    }


    return Users;
}