module.exports = (sequelize, dataTypes) => {

    let alias = "carts"

    let columnas = {
        id_compra: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        total: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    }
    let config = {
        tableName: "carts",
        timestamps: false
    }

    const carts = sequelize.define(alias, columnas, config)

    return carts;
}