module.exports = (sequelize, DataTypes) => {
    const Dialogs = sequelize.define("Dialogs", {
        name:{
            type: DataTypes.STRING,
        },
    });
    return Dialogs;
}