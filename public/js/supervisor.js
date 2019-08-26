$(document).ready(function () {
    console.log("Loaded supervisor page");

    const display = $("#main-container");

    showAllDepartments();

    // Click handlers
    $("#main-container").on("click", ".add-new-department", addNewDepartmentForm);
    $("#main-container").on("click", ".delete-department", deleteDepartment);
    $("#main-container").on("click", ".add-product", addDepartment);

    function showAllDepartments() {
        emptyDisplay();
        console.log("Showing all departments...");

        $.get("/api/departments").then(data => {
            console.log(data);
            const table = createTable();
            data.forEach(item => {
                table.append(createDepartmentRow(item));
            });

            display.append(table);
            display.append(`<i class="fas fa-plus-square add-new-department"></i>`)
        });
    }

    function createTable() {
        return $(`<table id="table">
            <th>Department Name</th>
            <th>Department ID</th>
            <th>Overhead Costs</th>
            <th>Product Sales</th>
            <th>Total Profit</th>
            <th>Actions</th>
        </table>`);
    }

    function createDepartmentRow(item) {
        let totalSales = 0;
        console.log("Creating row...");

        return $(`<tr data-department-id="${item.id}">
            <td>${item.department_name}</td>
            <td>${item.id}</td>
            <td>\$${item.over_head_costs}</td>
            <td>\$coming later</td>
            <td>\$10</td>
            <td><i class="fas fa-times delete-department"></i></td>
        </tr>`);

        $.ajax({
            url: "/api/products",
            method: "GET",
            success: function (departments) {
                departments.forEach(department => {
                    console.log(department);
                    console.log(totalSales);
                    console.log(department.product_sales);
                    totalSales += parseInt(item.product_sales);
                });
            }
        })
    }

    function addNewDepartmentForm() {
        // Will check to see if #add-product-row already exists
        if (!$("#add-product-row").length) {
            console.log("Adding new products form...");
            const table = $("#table");
            table.append(`<tr id="add-product-row">
                <td>
                    <input type="text" placeholder="Department Name" id="new-department-name">
                </td>
                <td>
                    next ID number
                </td>
                <td>
                    <input type="text" placeholder="Overhead Cost Example: 10000.00" id="new-department-overhead">
                </td>
                <td>
                    $0
                </td>
                <td>$0</td>
                <td>
                    <i class="fas fa-check add-product"></i><i class="fas fa-times cancel-product-add"></i>
                </td>
            </tr>`);
        };
    }

    function addDepartment() {
        const name = $("#new-department-name").val();
        const overhead = $("#new-department-overhead").val();
        console.log("detected overhead: " + overhead);
        $.ajax({
            url: '/api/departments',
            type: 'POST',
            data: { department_name: `${name}`, over_head_costs: `${overhead}` },
            success: function () {
                alert("Department added succesfully!");
                window.location.reload();
            },
            error: function () {
                alert("Department adding was failed, check your inputs.");
            }
        });
    }

    function deleteDepartment() {
        const departmentId = $(this).parent().parent().attr("data-department-id");
        console.log("Removing department id: " + departmentId);
        $.ajax({
            url: "/api/departments/" + departmentId + "/delete",
            type: "DELETE",
            success: function (err) {
                if (err) return console.log(err);
                else {
                    alert("Department was succesfully deleted!");
                    window.location.reload();
                };
            }
        });
    }

    function emptyDisplay() {
        console.log("Emptying display...");
        display.empty();
    }
});