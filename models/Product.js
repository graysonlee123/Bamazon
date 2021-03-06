module.exports = function (sequelize, dataType) {
    const Product = sequelize.define("Product", {
        product_name: {
            type: dataType.STRING,
            allowNull: false,
        },
        image_url: {
            type: dataType.STRING,
            allowNull: false
        },
        price: {
            type: dataType.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: { args: [0], msg: "Must be numbers greater than 0!" }
            }
        },
        stock_quantity: {
            type: dataType.INTEGER,
            allowNull: false,
            validate: {
                min: { args: [0], msg: "Pick 0-100 please" }
            }
        },
        product_sales: {
            type: dataType.DECIMAL(10, 2),
            allowNull: false,
            defaultValue: 0.00,
            validate: {
                isDecimal: true
            }
        }
    });

    Product.associate = models => {
        Product.belongsTo(models.Department);
    };

    return Product;
};