module.exports = (sequelize, dataTypes) => {

    let alias = "colors"

    let columnas = {
        idcolor: {
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
        tableName: "colors",
        timestamps: false
    }

    const colors = sequelize.define(alias, columnas, config)

    colors.associate = models => {
        colors.hasMany(models.products, {
            as: "productos",
            foreingKey: "coloresIdcolor"
        })
    }

    return colors;
}