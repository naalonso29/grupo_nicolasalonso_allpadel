module.exports = (sequelize, dataTypes) => {

    let alias = "products"

    let columnas = {
        id_producto: {
            type: dataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        id_color: {
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
        id_forma: {
            type: dataTypes.INTEGER,
            allowNull: false
        },
        id_marca: {
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
            foreingKey: "colorIdColor"
        })
    }

    return products;
}