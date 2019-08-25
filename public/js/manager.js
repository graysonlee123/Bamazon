$(document).ready(function () {
    const display = $("#main-container");

    showAllProducts();

    $("#all-products").on("click", showAllProducts);
    $("#low-inventory").on("click", showLowInventory);
    $("#add-new").on("click", addNewProduct);
    $("#main-container").on("click", "#update-stock", updateStock);
    $("#main-container").on("click", "#update-price", updatePrice);

    function showAllProducts() {
        emptyDisplay();
        updateButtons(1);
        console.log("Showing all products...");

        $.get("/api/products").then(data => {
            const table = $(`<table>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Department</th>
                <th>Update Stock</th>
                <th>Update Price</th>
            </table>`);
            data.forEach(item => {
                table.append(`<tr>
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
                </tr>`);
            });

            display.append(table);
        })
    }

    function showLowInventory() {
        emptyDisplay();
        updateButtons(2);
        $.get("/api/products").then(data => {
            data.forEach((item, index) => {
                if (item.stock_quantity < 5) {
                    display.append(`<div>
                        <div><span class="mini">Product Name</span>${item.product_name}</div>
                        <div><span class="mini">Quantity</span>${item.stock_quantity}</div>
                        <div><span class="mini">Price</span>${item.price}</div>
                        <div><span class="mini">Department</span>${item.department_name}</div>
                        <hr>
                        <form>
                            <label for="update_stock">Update Stock</label>
                            <input type="text" name="update_stock" id="update-stock-value">
                            <input type="submit" value="Update Stock" id="update-stock" data-item-id="${item.id}">
                        </form>
                    </div>`);
                }
            });
        })
    }

    function addNewProduct() {
        emptyDisplay();
        updateButtons(3);
        console.log("Adding new products form");
    }

    function updateStock(event) {
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