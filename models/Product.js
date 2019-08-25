module.exports = function (sequelize, dataType) {
    return sequelize.define("Product", {
        product_name: {
            type: dataType.STRING,
            allowNull: false,
        },
        department_name: {
            type: dataType.STRING,
            allowNull: false,
        },
        image_file: {
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
        }
    });
};