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

    // This function will get all departments by default, or only the
    // department specified by the ID passed into the function
    function getProducts(id) {
        // Sets the query if an ID is provided
        let idQuery = id || "";
        if (id) {
            idQuery = "/id/" + id;
            console.log(idQuery);
            console.log("/api/departments%s", idQuery);
        };
        // If no id was passed, it will be an empty string,
        // and just query all products
        $.get("/api/products" + idQuery).then(productsData => {
            products = productsData;
            console.log(products);
            if (!products || !products.length) {
                displayEmpty();
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

    // This function gets all the available departments
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
        const data = {
            name: $("input.name").val(),
            overhead: $("input.overhead").val()
        };

        if (!data.name || !data.overhead) {
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
        const id = $(this).parent().parent().attr("data-department-id");
        if (confirm("Are you sure you want to delete department " + id + "? \nThis will delete ALL corresponding products!")) {
            deleteDepartment(id);
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
                <td class="product-department">${item.department_name}</td>
                <td class="product-department-id">${item.DepartmentId}</td>
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
        <br>
        <label>Stock Quantity</label>
        <input class="stock" type="text" placeholder="Ex: 200">
        <br>
        <label>Price</label>
        <input class="price" type="text" placeholder="Ex: 149.99">
        <br>
        <label>Department</label>
        <select class="department">
            <option value="" selected disabled>Select One</option>
        </select>
        <br>
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

    // These are OLD FUNCTIONS

    function createProductRow(item) {
        return $(`<tr data-product-id="${item.id}">
            <td>${item.product_name}</td>
            <td>${item.stock_quantity}</td>
            <td>${item.price}</td>
            <td>${item.department_name}</td>
            <td>
                <form>
                    <input type="text" name="update_stock" placeholder="Example: 12" id="update-stock-value">
                    <input type="submit" value="Update Stock" id="update-stock" data-item-id="${item.id}">
                </form>
            </td>
            <td>
                <form>
                    <input type="text" name="update_price" placeholder="Example: 499.99" id="update-price-value">
                    <input type="submit" value="Update Price" id="update-price" data-item-id="${item.id}">
                </form>
            </td>
            <td><i class="fas fa-times delete-product"></i></td>
        </tr>`);
    }

    function addNewProductForm() {
        // Will check to see if #add-product-row already exists
        if (!$("#add-product-row").length) {
            console.log("Adding new products form...");
            table.append(`<tr id="add-product-row">
                <td>
                    <input type="text" placeholder="Product name" id="new-product-name">
                </td>
                <td>
                    <input type="text" placeholder="Product quantity" id="new-product-quantity">
                </td>
                <td>
                    <input type="text" placeholder="Product price" id="new-product-price">
                </td>
                <td>
                    <select id="new-product-department">
                        
                    </select>
                </td>
                <td>N/A</td>
                <td>N/A</td>
                <td>
                    <i class="fas fa-check add-product"></i><i class="fas fa-times cancel-product-add"></i>
                </td>
            </tr>`);
            $.get("/api/departments", function (departments) {
                console.log(departments);
                if (departments.length === 0) {
                    console.log("No departments detected!");
                    $("#new-product-department").append(`<option disabled>No Departments!</option>`)
                } else {
                    departments.forEach(department => {
                        $("#new-product-department").append(`<option value="${department.id}, ${department.department_name}">${department.department_name}</option>`)
                    });
                }
            });
        };
    }

    function addProduct() {
        const name = $("#new-product-name").val();
        const quantity = $("#new-product-quantity").val();
        const price = $("#new-product-price").val();
        let departmentInfo = $("#new-product-department").val();
        departmentInfo = departmentInfo.split(", ");
        const departmentName = departmentInfo[1];
        const departmentId = departmentInfo[0];
        console.log(departmentInfo);
        $.ajax({
            url: '/api/products/',
            type: 'POST',
            data: { product_name: name, department_name: departmentName, DepartmentId: departmentId, price: price, stock_quantity: quantity, image_file: "strangebed.jpg" },
            success: function () {
                alert("Product added succesfully!");
                window.location.reload();
            },
            fail: function () {
                alert("Product adding was failed, check your inputs.");
            }
        });
    }

    function removeAddProductRow() {
        $("#add-product-row").remove();
    }

    function updateProductStock(event) {
        event.preventDefault();
        const quantity = $(this).parent().children("#update-stock-value").val();
        const itemId = $(this).attr("data-item-id");
        $.ajax({
            url: '/api/products/' + itemId + '/quantity',
            type: 'PUT',
            data: `stock_quantity=${quantity}`,
            success: function (err) {
                if (err) return console.log(err);
                else {
                    alert("Stock updated succesfully!");
                    window.location.reload();
                };
            }
        });
    }

    function updatePrice(event) {
        event.preventDefault();
        const price = $(this).parent().children("#update-price-value").val();
        const itemId = $(this).attr("data-item-id");
        console.log("Updating price...");
        console.log(price);
        $.ajax({
            url: '/api/products/' + itemId + '/price',
            type: 'PUT',
            data: `price=${price}`,
            success: function (err) {
                if (err) return console.log(err);
                else {
                    alert("Price updated succesfully!");
                    window.location.reload();
                };
            }
        });
    }

    function deleteProduct() {
        const itemId = $(this).parent().parent().attr("data-product-id");
        console.log("Removing item id: " + itemId);
        $.ajax({
            url: '/api/products/' + itemId + '/delete',
            type: 'DELETE',
            success: function (err) {
                if (err) return console.log(err);
                else {
                    alert("Item was deleted succesfully!");
                    window.location.reload();
                };
            }
        });
    }

    function tableEmpty() {
        console.log("Emptying table...");
        table.empty();
    }

    function updateButtons(activeButton = 1) {
        console.log("Updating buttons");
        const allButton = $("#all-products");
        const lowButton = $("#low-inventory");

        allButton.removeAttr("disabled");
        lowButton.removeAttr("disabled");

        if (activeButton === 1) {
            allButton.attr("disabled", "");
        } else if (activeButton === 2) {
            lowButton.attr("disabled", "");
        };
    }
});