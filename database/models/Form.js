module.exports = (sequelize, dataTypes) => {

    let alias = "forms"

    let columnas = {
        id_forma: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        nombre: {
            type: dataTypes.STRING,
            allowNull: false
        },
        imagen: {
            type: dataTypes.STRING,
            allowNull: false
        }
    }
    let config = {
        tableName: "forms",
        timestamps: false
    }

    const forms = sequelize.define(alias, columnas, config)

    return forms;
}