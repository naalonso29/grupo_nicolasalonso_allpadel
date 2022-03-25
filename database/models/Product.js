module.exports = (sequelize, dataTypes) => {

    let alias = "products"

    let columnas = {
        idproducto: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        coloresIdcolor: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        nombre: {
            type: dataTypes.STRING,
            allowNull: false
        },
        descripcion: {
            type: dataTypes.STRING,
            allowNull: false
        },
        imagen: {
            type: dataTypes.STRING,
            allowNull: false
        },
        precio: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        stock: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        formasIdforma: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        marcasIdmarca: {
            type: dataTypes.INTEGER,
            allowNull: false
        }
    }
    let config = {
        tableName: "products",
        timestamps: false
    }

    const products = sequelize.define(alias, columnas, config)

    products.associate = models => {
        products.belongsTo(models.colors, {
            as: "colores",
            foreingKey: "idcolor"
        })
        products.belongsTo(models.brands, {
            as: "marcas",
            foreingKey: "idmarca"
        })
        products.belongsTo(models.forms, {
            as: "formas",
            foreingKey: "idforma"
        })
    }

    return products;
}