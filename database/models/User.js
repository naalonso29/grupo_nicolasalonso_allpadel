module.exports = (sequelize, dataTypes) => {

    let alias = "users"

    let columnas = {
        id: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        nombre: {
            type: dataTypes.STRING,
            allowNull: false
        },
        apellido: {
            type: dataTypes.STRING,
            allowNull: false
        },
        email: {
            type: dataTypes.STRING,
            allowNull: false
        },
        contrasenia: {
            type: dataTypes.STRING,
            allowNull: false
        },
        imagen: {
            type: dataTypes.STRING,
            allowNull: false
        },
        id_tipo: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    }
    let config = {
        tableName: "users",
        timestamps: false
    }

    const users = sequelize.define(alias, columnas, config)

    users.associate = models => {
        users.belongsTo(models.usertypes, {
            as: "tipos",
            foreingKey: "id_tipo"
        })
    }

    return users;
}