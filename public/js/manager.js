$(document).ready(function () {
    const display = $("#main-container");

    showAllProducts();

    $("#all-products").on("click", showAllProducts);
    $("#low-inventory").on("click", showLowInventory);
    $("#add-new").on("click", addNewProduct);
    $("#main-container").on("click", "#update-stock", updateStock);

    function showAllProducts() {
        emptyDisplay();
        updateButtons(1);
        console.log("Showing all products...");
        $.get("/api/products").then(data => {
            data.forEach((item, index) => {
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
            });
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