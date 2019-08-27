$(document).ready(function () {
    console.log("Loaded supervisor page");

    // Grab the main display div
    const display = $("#main-container");
    // And the overlay div
    const overlay = $("#overlay");
    // Grab the table element
    const table = $("table");
    // Grab the overlay form
    const form = $("#form");
    // Flag for setting the department ID to update
    let selectedDepartmentId = null;
    // Get all departments to start off
    let departments;

    // Click handlers
    $(document).on("click", "button.delete", handleDelete);
    $(document).on("click", "button.add", handleAdd);
    $(document).on("click", "button.submit-add", handleSubmitAdd);
    $(document).on("click", "button.edit", handleEdit);
    $(document).on("click", "button.submit-edit", handleSubmitEdit);
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
                // Do something if there are no products are found
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
        if (!data) return console.log("No data provided for postDepartment()!");
        console.log("Data to post: ", data);
        $.ajax({
            url: '/api/departments',
            type: 'POST',
            data: { department_name: data.name, over_head_costs: data.overhead },
            success: function () {
                alert("Department added succesfully!");
                window.location.reload();
            }
        });
    }

    // This function will update an existing department
    function putDepartment(data) {
        if (!data) return console.log("No data provided for putDepartment()!");
        console.log("Data to put: ", data);
        $.ajax({
            url: '/api/departments/id/' + selectedDepartmentId,
            type: 'PUT',
            data: { department_name: data.name, over_head_costs: data.overhead, id: selectedDepartmentId },
            success: function () {
                alert("Department edited succesfully!");
                window.location.reload();
            }
        });
    }

    // These functions handle the button presses

    // This function will handle the add button
    function handleAdd() {
        form.empty();
        renderDepartmentForm("add");
        openOverlay();
    }

    // This function will get the form data and post a new department
    function handleSubmitAdd(event) {
        event.preventDefault();
        const data = {
            name: $("input.name").val(),
            overhead: $("input.overhead").val()
        };

        postDepartment(data);
    }

    // This function will handle the edit button
    function handleEdit() {
        console.log("Handle edit");
        form.empty();
        // Goes to find the row, and look at the id column
        selectedDepartmentId = $(this).parent().parent().children(".department-id").text();
        // Creates a data object based on the table to autofill the edit form
        const autofillData = {
            name: $(this).parent().parent().children(".department-name").text(),
            overhead: $(this).parent().parent().children(".department-overhead").text()
        };
        renderDepartmentForm("edit", autofillData);
        openOverlay();
    }

    // This function sends the put data
    function handleSubmitEdit() {
        event.preventDefault();
        const data = {
            name: $("input.name").val(),
            overhead: $("input.overhead").val()
        };

        if (!data.name || !data.overhead) {
            return console.log("Bad data");
        } else putDepartment(data);
    }

    // This function handles the cancel button on the overlay
    function handleCancel() {
        console.log("Handling cancel overlay...");
        form.empty();
        closeOverlay();
    }

    // This function will handle the delete button
    function handleDelete() {
        const id = $(this).parent().parent().attr("data-department-id");
        if (confirm("Are you sure you want to delete department " + id + "? \nThis will delete ALL corresponding products!")) {
            deleteDepartment(id);
        };
    }

    // Generic functions

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
                <td class="department-name">${department.department_name}</td>
                <td class="department-id">${department.id}</td>
                <td class="department-overhead">${department.over_head_costs}</td>
                <td>${total}</td>
                <td>${parseFloat(total - department.over_head_costs)}</td>
                <td>
                    <button class="edit"> <i class="fas fa-edit"></i> </button>
                    <button class="delete"> <i class="fas fa-times"></i> </button>
                </td>
            </tr>`);
        })
    }

    // This function will render the overlay for overlay forms
    function renderDepartmentForm(className, autofillData) {
        form.append(`
        <label>Department Name</label>
        <input class="name" type="text" placeholder="Example: Furniture">
        <label>Overhead Costs</label>
        <input class="overhead" type="text" placeholder="Ex: 200.00">
        <button type="submit" class="submit-${className}">Add Product</button>
        `);

        // If autofill data is detected in edit mode...
        if (className === "edit" && autofillData) {
            console.log("Edit detected, autofilling forms...");
            $("input.name").val(autofillData.name);
            $("input.overhead").val(autofillData.overhead);
        }
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