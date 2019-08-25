module.exports = function (sequelize, dataType) {
    return sequelize.define("Department", {
        department_name: {
            type: dataType.STRING,
            allowNull: false,
        },
        price: {
            type: dataType.DECIMAL(10, 2),
            allowNull: false,
        }
    });
};