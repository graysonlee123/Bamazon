$(document).ready(function () {
    const display = $("#main-container");

    showAllProducts();

    $("#all-products").on("click", showAllProducts);
    $("#low-inventory").on("click", showLowInventory);
    $("#main-container").on("click", "#update-stock", updateProductStock);
    $("#main-container").on("click", "#update-price", updatePrice);
    $("#main-container").on("click", ".add-new-product", addNewProductForm);
    $("#main-container").on("click", ".add-product", addProduct);
    $("#main-container").on("click", ".delete-product", deleteProduct);
    $("#main-container").on("click", ".cancel-product-add", removeAddProductRow);

    function showAllProducts() {
        emptyDisplay();
        updateButtons(1);
        console.log("Showing all products...");

        $.get("/api/products").then(data => {
            const table = createTable();
            data.forEach(item => {
                table.append(createProductRow(item));
            });

            display.append(table);
            display.append(`<i class="fas fa-plus-square add-new-product"></i>`)
        });
    }

    function showLowInventory() {
        emptyDisplay();
        updateButtons(2);
        $.get("/api/products").then(data => {
            const table = createTable();
            data.forEach((item, index) => {
                if (item.stock_quantity < 5) {
                    table.append(createProductRow(item));
                };
            });

            display.append(table);
        })
    }

    function createTable() {
        return $(`<table id="table">
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Department</th>
            <th>Update Stock</th>
            <th>Update Price</th>
            <th>Actions</th>
        </table>`);
    }

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
            const table = $("#table");
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
            $.get("/api/departments", function(departments) {
                departments.forEach(department => {
                    $("#new-product-department").append(`<option value="${department.id}, ${department.department_name}">${department.department_name}</option>`)
                });
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
            error: function () {
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

    function emptyDisplay() {
        console.log("Emptying display...");
        display.empty();
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