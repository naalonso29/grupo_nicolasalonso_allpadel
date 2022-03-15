module.exports = (sequelize, dataTypes) => {

    let alias = "buydetails"

    let columnas = {
        id_detalle: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_compra: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_producto: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        preciounitario: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    }
    let config = {
        tableName: "buydetails",
        timestamps: false
    }

    const buydetails = sequelize.define(alias, columnas, config)

    return buydetails;
}