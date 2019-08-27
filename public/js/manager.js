$(document).ready(function () {
    // Grab the main display div
    const display = $("#main-container");
    // And the overlay div
    const overlay = $("#overlay");
    // Grab the table element
    const table = $("table");
    // Grab the overlay form
    const form = $("#form");
    // Sets flag for products found in getProducts()
    let products = null;
    // Sets a flag for the selected product ID when editing 
    let selectedProductId = null;
    // Sets a variable for all departments found in getDepartments()
    let departments = null;
    // By default, get all products and departments
    getProducts();
    getDepartments();

    // Click handlers
    $(document).on("click", "button.delete", handleDelete);
    $(document).on("click", "button.add", handleAdd);
    $(document).on("click", "button.submit-add", handleSubmitAdd);
    $(document).on("click", "button.edit", handleEdit);
    $(document).on("click", "button.submit-edit", handleSubmitEdit);
    $(document).on("click", "button.cancel", handleCancel);

    // These functions handle the AJAX requests

    // This function will get all products by default, or only the
    // department specified by the ID passed into the function
    function getProducts(id) {
        // Sets the query if an ID is provided
        let idQuery = id || "";
        if (id) {
            idQuery = "/id/" + id;
        };
        // If no id was passed, it will be an empty string,
        // and just query all products
        $.get("/api/products" + idQuery).then(productsData => {
            products = productsData;
            console.log(products);
            if (!products || !products.length) {
                // Do something if there are no products found
            } else {
                // This will render the rows based on the 'products' variable
                renderRows();
            }
        });
    }

    // This function will delete a department based off of the id
    function deleteProduct(id) {
        if (!id) return console.log("No Id provided for deleteProduct()!");
        $.ajax({
            url: "/api/products/id/" + id,
            type: "DELETE",
            success: function (err) {
                if (err) return console.log(err);
                alert("Product was succesfully deleted!");
                window.location.reload();
            }
        });
    }

    // This function will post a new department
    function postProduct(data) {
        if (!data) return console.log("No data provided for postProduct()!");
        console.log("Data to post: ", data);
        $.ajax({
            url: '/api/products',
            type: 'POST',
            data: data,
            success: function () {
                alert("Product added succesfully!");
                window.location.reload();
            }
        });
    }

    // This function will update an existing Product
    function putProduct(data) {
        if (!data) return console.log("No data provided for putProduct()!");
        console.log("Data to put: ", data);
        $.ajax({
            url: '/api/products/id/' + selectedProductId,
            type: 'PUT',
            data: data,
            success: function () {
                alert("Product edited succesfully!");
                window.location.reload();
            }
        });
    }

    // This function gets all the available products,
    // for listing on the edit products overlay
    function getDepartments() {
        $.get("/api/departments").then(departmentsData => {
            departments = departmentsData;
            console.log("Departments: ", departments);
        })
    }

    // These are handler functions 

    // This function will handle the add button
    function handleAdd() {
        form.empty();
        renderProductForm("add");
        openOverlay();
    }

    // This function will get the form data and post a new product
    function handleSubmitAdd(event) {
        event.preventDefault();
        let departmentInfo = $("select.department").val().split(", ");
        const data = {
            product_name: $("input.name").val(),
            department_name: departmentInfo[0],
            image_file: "strangebed.jpg",
            price: $("input.price").val(),
            stock_quantity: $("input.stock").val(),
            product_sales: 0.00,
            DepartmentId: departmentInfo[1]
        };

        postProduct(data);
    }

    // This function will handle the edit button
    function handleEdit() {
        console.log("Handle edit");
        form.empty();
        // Goes to find the row, and look at the id column
        selectedProductId = $(this).parent().parent().children(".product-id").text();
        // Creates a data object based on the table to autofill the edit form
        const autofillData = {
            name: $(this).parent().parent().children(".product-name").text(),
            stock: $(this).parent().parent().children(".product-quantity").text(),
            price: $(this).parent().parent().children(".product-price").text(),
            department: $(this).parent().parent().children(".product-department").text(),
            departmentId: $(this).parent().parent().children(".product-department-id").text(),
        };
        console.log("Seleced id: ", selectedProductId);
        console.log("Form data: ", autofillData);
        renderProductForm("edit", autofillData);
        openOverlay();
    }

    // This function sends the put data
    function handleSubmitEdit() {
        event.preventDefault();

        // Splits the value tag from the department dropdown
        // Index [0] is name, [1] is id
        let departmentData = $("select.department").val().split(", ");

        const data = {
            product_name: $("input.name").val(),
            department_name: departmentData[0],
            DepartmentId: departmentData[1],
            price: $("input.price").val(),
            stock_quantity: $("input.stock").val(),            
        };

        console.log("data collected to submit: ", data);

        if (!data.product_name || !data.department_name || !data.DepartmentId || !data.price || !data.stock_quantity ) {
            return console.log("Bad data");
        } else putProduct(data);
    }

    // This function handles the cancel button on the overlay
    function handleCancel() {
        console.log("Handling cancel overlay...");
        form.empty();
        closeOverlay();
    }

    // This function will handle the delete button
    function handleDelete() {
        const id = $(this).parent().parent().children(".product-id").text();
        const name = $(this).parent().parent().children(".product-name").text();
        if (confirm("Are you sure you want to delete product " + name + "?")) {
            deleteProduct(id);
        };
    }

    // These are generic functions 

    // This function renders a row for each product
    function renderRows() {
        products.forEach(item => {
            table.append(`
            <tr>
                <td class="product-name">${item.product_name}</td>
                <td class="product-id">${item.id}</td>
                <td class="product-quantity">${item.stock_quantity}</td>
                <td class="product-price">${item.price}</td>
                <td class="product-department">${item.Department.department_name}</td>
                <td class="product-department-id">${item.Department.id}</td>
                <td>
                    <button class="edit"> <i class="fas fa-edit"></i> </button>
                    <button class="delete"> <i class="fas fa-times"></i> </button>
                </td>
            </tr>
            `);
        })
    }

    // This function will render the overlay for overlay forms
    function renderProductForm(className, autofillData = null) {
        form.append(`
        <label>Product Name</label>
        <input class="name" type="text" placeholder="Example: Watch">
        <label>Stock Quantity</label>
        <input class="stock" type="text" placeholder="Ex: 200">
        <label>Price</label>
        <input class="price" type="text" placeholder="Ex: 149.99">
        <label>Department</label>
        <select class="department">
            <option value="" selected disabled>Select One</option>
        </select>
        <button type="submit" class="submit-${className}">Submit Product</button>
        `);
        departments.forEach(department => {
            $(".department").append(`
            <option value="${department.department_name}, ${department.id}">${department.department_name}</option>
            `)
        });

        // If autofill data is detected in edit mode...
        if (className === "edit" && autofillData) {
            console.log("Edit detected, autofilling forms...");
            $("input.name").val(autofillData.name);
            $("input.stock").val(autofillData.stock);
            $("input.price").val(autofillData.price);
            $("select.department").val(`${autofillData.department}, ${autofillData.departmentId}`);
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