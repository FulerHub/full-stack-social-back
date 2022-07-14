module.exports = (sequelize, DataTypes) => {
    const Posts = sequelize.define("Posts", {
        message:{
            type: DataTypes.STRING(1024),
        },
        userid:{
            type: DataTypes.INTEGER,
        },
        profileid:{
            type: DataTypes.INTEGER,
        },
    });
    Posts.associate = models => {
        Posts.belongsTo(models.Users, {foreignKey: 'userid'});
    }
    return Posts;
}