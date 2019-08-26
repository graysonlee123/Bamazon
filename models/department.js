module.exports = function (sequelize, dataType) {
    return sequelize.define("Department", {
        department_name: {
            type: dataType.STRING,
            allowNull: false,
        },
        over_head_costs: {
            type: dataType.DECIMAL(10, 2),
            allowNull: false,
        }
    });
};