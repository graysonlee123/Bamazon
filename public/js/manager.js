$(document).ready(function () {
    const display = $("#main-container");

    showAllProducts();

    $("#all-products").on("click", showAllProducts);
    $("#low-inventory").on("click", showLowInventory);
    $("#add-new").on("click", addNewProduct);
    $("#main-container").on("click", "#update-stock", updateProductStock);
    $("#main-container").on("click", "#update-price", updatePrice);
    $("#main-container").on("click", ".delete-product", deleteProduct);

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
        return $(`<table>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Department</th>
            <th>Update Stock</th>
            <th>Update Price</th>
            <th>Remove Product</th>
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

    function addNewProduct() {
        emptyDisplay();
        updateButtons(3);
        console.log("Adding new products form");
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
        const addButton = $("#add-new");

        allButton.removeAttr("disabled");
        lowButton.removeAttr("disabled");
        addButton.removeAttr("disabled");

        if (activeButton === 1) {
            allButton.attr("disabled", "");
        } else if (activeButton === 2) {
            lowButton.attr("disabled", "");
        } else if (activeButton === 3) {
            addButton.attr("disabled", "");
        }
    }
})