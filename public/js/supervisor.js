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

        $.get("/api/departments").then(departments => {
            console.log(departments);
            const table = createTable();
            departments.forEach(department => {
                table.append(createDepartmentRow(department));
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

    function createDepartmentRow(department) {
        let departmentTotal = 0;

        department.Products.forEach(product => {
            departmentTotal += parseFloat(product.product_sales);
        });

        return $(`<tr data-department-id="${department.id}">
            <td>${department.department_name}</td>
            <td>${department.id}</td>
            <td>\$${department.over_head_costs}</td>
            <td>\$${departmentTotal}</td>
            <td>\$${departmentTotal - department.over_head_costs}</td>
            <td><i class="fas fa-times delete-department"></i></td>
        </tr>`);
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
            data: { department_name: name, over_head_costs: overhead },
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