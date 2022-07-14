module.exports = (sequelize, DataTypes) => {
    const Subscribers = sequelize.define("Subscribers", {
        userid:{
            type: DataTypes.INTEGER,

        },
        profileid:{
            type: DataTypes.INTEGER,

        },
    });
    Subscribers.associate = models => {
        //Subscribers.belongsTo(models.Users);
        Subscribers.belongsTo(models.Users, {as: "subsUser",foreignKey: 'userid'});
        Subscribers.belongsTo(models.Users, {as: "subsProfile",foreignKey: 'profileid'});
    }
    return Subscribers;
}