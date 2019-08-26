module.exports = function (sequelize, dataType) {
    const Department = sequelize.define("Department", {
        department_name: {
            type: dataType.STRING,
            allowNull: false,
        },
        over_head_costs: {
            type: dataType.DECIMAL(10, 2),
            allowNull: false,
        }
    });

    Department.associate = models => {
        Department.hasMany(models.Product, {
            onDelete: "CASCADE",
            foreignKey: {
                allowNull: false
            }
        })
    }

    return Department;

};