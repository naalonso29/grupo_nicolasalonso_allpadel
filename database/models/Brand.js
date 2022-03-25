module.exports = (sequelize, dataTypes) => {

    let alias = "brands"

    let columnas = {
        idmarca: {
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

    brands.associate = models => {
        brands.hasMany(models.products, {
            as: "productos",
            foreingKey: "marcasIdmarca"
        })
    }

    return brands;
}