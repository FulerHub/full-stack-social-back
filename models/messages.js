module.exports = (sequelize, DataTypes) => {
    const Messages = sequelize.define("Messages", {
        message:{
            type: DataTypes.STRING(1024),
        },
        userid:{
            type: DataTypes.INTEGER,
        },
        dialogid:{
            type: DataTypes.INTEGER,
        },
    })
    Messages.associate = models => {
        Messages.belongsTo(models.Users, {foreignKey: 'userid'});
    }
    return Messages;
}