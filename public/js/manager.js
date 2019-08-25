$(document).ready(function () {
    const display = $("#main-container");

    showAllProducts();

    $("#all-products").on("click", showAllProducts);
    $("#low-inventory").on("click", showLowInventory);
    $("#add-new").on("click", addNewProduct);
    $("#main-container").on("click", "#update-stock", updateStock);

    function showAllProducts() {
        emptyDisplay();
        console.log("Showing all products...");
        $.get("/api/products").then(data => {
            data.forEach((item, index) => {
                console.log(item);
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
</div>
                `);
            });
        })
    }

    function showLowInventory() {
        emptyDisplay();
        console.log("Showing low products...");
    }

    function addNewProduct() {
        emptyDisplay();
        console.log("Adding new products");
    }

    function updateStock(event) {
        event.preventDefault();
        const quantity = $(this).parent().children("#update-stock-value").val();
        const itemId = $(this).attr("data-item-id");
        $.ajax({
            url: '/api/products/' + itemId,
            type: 'GET',
            success: data => {
                const newQuantity = data.stock_quantity - quantity;
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
        });
    }

    function emptyDisplay() {
        console.log("Emptying display...");
        display.empty();
    }
})