module.exports = (sequelize, dataTypes) => {

    let alias = "usertypes"

    let columnas = {
        idtipo: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        nombre: {
            type: dataTypes.STRING,
            allowNull: false
        }
    }
    let config = {
        tableName: "usertypes",
        timestamps: false
    }

    const usertypes = sequelize.define(alias, columnas, config)

    usertypes.associate = models => {
        usertypes.hasMany(models.users, {
            as: "usuario",
            foreingKey: "tiposIdtipo"
        })
    }

    return usertypes;
}