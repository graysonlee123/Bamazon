$(document).ready(function () {
    console.log("Loaded supervisor page");

    // Grab the main display div
    const display = $("#main-container");
    // And the overlay div
    const overlay = $("#overlay");
    // Grab the table element
    const table = $("table");
    // Flag for setting the department ID to update
    let selectedDepartmentId = null;
    // Get all departments to start off
    let departments;

    // Click handlers
    $(document).on("click", "button.delete", handleDelete);
    $(document).on("click", "button.add", handleAdd);
    $(document).on("click", "button.edit", handleEdit);
    $(document).on("click", "button.cancel", handleCancel);

    getDepartments();

    // These functions handle the AJAX requests

    // This function will get all departments by default, or only the
    // department specified by the ID passed into the function
    function getDepartments(id) {
        // Sets the query if an ID is provided
        let idQuery = id || "";
        if (id) {
            idQuery = "/id/" + id;
            console.log(idQuery);
            console.log("/api/departments%s", idQuery);
        };
        // If no id was passed, it will be an empty string,
        // and just query all departments
        $.get("/api/departments" + idQuery).then(departmentsData => {
            departments = departmentsData;
            console.log(departments);
            if (!departments || !departments.length) {
                displayEmpty();
                // Do something if there are no posts found
            } else {
                // This will render the rows based on the 'departments' variable
                renderRows();
            }
        });
    }

    // This function will delete a department based off of the id
    function deleteDepartment(id) {
        if (!id) return console.log("No Id provided for deleteDepartment()!");
        $.ajax({
            url: "/api/departments/id/" + id,
            type: "DELETE",
            success: function (err) {
                if (err) return console.log(err);
                alert("Department was succesfully deleted!");
                window.location.reload();
            }
        });
    }

    // This function will post a new department
    function postDepartment(data) {
        if (!data) return console.log("No data provided for postDepartment()!")
        $.ajax({
            url: '/api/departments',
            type: 'POST',
            data: { department_name: data.name, over_head_costs: data.overhead },
            success: function () {
                alert("Department added succesfully!");
                window.location.reload();
            },
            error: function () {
                alert("Department adding was failed, check your inputs.");
            }
        });
    }

    // These functions handle the button presses

    // This function will handle the delete button
    function handleDelete() {
        const id = $(this).parent().parent().attr("data-department-id");
        if (confirm("Are you sure you want to delete department " + id + "?")) {
            alert("Department removed!");
            deleteDepartment(id);
        };
    }

    // This button will handle the add button
    function handleAdd() {
        console.log("Handle add");
    }

    // This function will handle the edit button
    function handleEdit() {
        console.log("Handle edit");
    }

    function handleCancel() {
        console.log("Handling cancel overlay...");
    }

    // Generic functions

    // This function will empty the display
    function displayEmpty() {
        console.log("Emptying display...");
        display.empty();
    }

    // This function returns a department's products total revenue
    function getDepartmentTotal(department) {
        console.log("Calculating total for department: ", department);
        let total = 0;
        department.Products.forEach(product => {
            total += parseFloat(product.product_sales);
        });
        return total;
    }

    // This function will render the table's rows
    function renderRows() {
        console.log("Initializing rows...", departments);
        departments.forEach(department => {
            const total = getDepartmentTotal(department);
            table.append(`<tr data-department-id="${department.id}">
                <td>${department.department_name}</td>
                <td>${department.id}</td>
                <td>\$${department.over_head_costs}</td>
                <td>\$${total}</td>
                <td>\$${total - department.over_head_costs}</td>
                <td>
                    <button class="edit"> <i class="fas fa-edit"></i> </button>
                    <button class="delete"> <i class="fas fa-times"></i> </button>
                </td>
            </tr>`);
        })
    }

    // This function will render the overlay for overlay forms
    function renderNewDepartmentForm() {
        selectedDepartmentId = $(this).parent().parent().attr("data-department-id");
        const form = $("#form");
        form.empty();
        form.append(`<label>Overhead Costs</label>
        <input type="text", placeholder="Ex: 200.00">
        <input id="submit-changes" type="button" value="Submit Changes" data-department-id="${selectedDepartmentId}">`);
    }

    // This function opens the overlay
    function openOverlay() {
        overlay.css("display", "flex");
    }

    // This function closes the overlay
    function closeOverlay() {
        overlay.css("display", "none");
    }
});