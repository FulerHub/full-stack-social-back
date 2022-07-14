module.exports = (sequelize, DataTypes) => {
    const DialogsList = sequelize.define("DialogsList", {
        userid:{
            type: DataTypes.INTEGER,
        },
        dialogid:{
            type: DataTypes.INTEGER,
        },
        groups:{
            type: DataTypes.BOOLEAN,
            defaultValue: 0
        },
        lastTime:{
            type: DataTypes.DATE
        }
    });

    DialogsList.associate = models => {
        DialogsList.belongsTo(models.Users, {foreignKey: 'userid'});
        DialogsList.belongsTo(models.Dialogs,{foreignKey: 'dialogid'})
    }

    return DialogsList;
}