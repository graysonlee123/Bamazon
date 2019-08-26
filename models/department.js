module.exports = function (sequelize, dataType) {
    const Department = sequelize.define("Department", {
        department_name: {
            type: dataType.STRING,
            allowNull: false,
            validate: {
                len: [1, 20]
            }
        },
        over_head_costs: {
            type: dataType.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                isDecimal: true
            }
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