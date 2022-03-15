module.exports = (sequelize, dataTypes) => {

    let alias = "brands"

    let columnas = {
        id_marca: {
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
        tableName: "brands",
        timestamps: false
    }

    const brands = sequelize.define(alias, columnas, config)

    return brands;
}