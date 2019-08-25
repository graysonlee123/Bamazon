$(document).ready(function () {
    const cartDiv = $("#cart-div");
    const cartList = $("#cart-list");

    // Flag for setting when the user loads the page with items in their cart
    let itemsInCart = false;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    $(document).on("click", "#clear-cart", clearCart);
    $("#cart-list").on("click", ".clear-cart-item", removeItemFromCart);
    $("#cart-div").on("click", "#submit-order", submitOrder);

    if (cart.length != 0) {
        itemsInCart = true;
        cart.forEach(cartItem => {
            buildListItems(cartItem);
        });
        $("#submit-order").removeAttr("disabled");
        $("#clear-cart").removeAttr("disabled");
    } else {
        console.log("Empty Cart!");
    };

    function clearCart() {
        event.preventDefault();
        localStorage.setItem('cart', JSON.stringify([]));
        window.location.reload();
    }

    function buildListItems(item) {
        $.get("/api/products/" + item.id).then(product => {
            product.userPurchaseQuantity = item.quantity;

            calculateTotal(product.price * product.userPurchaseQuantity);

            const listItem = $("<li>");
            listItem.addClass("cart-list-item");
            listItem.attr("item-id", product.id);

            const image = $(`<img>`);
            image.attr("src", `/images/products/${product.image_file}`)
            image.addClass("cart-img");

            const itemName = $(`<h3>`);
            itemName.addClass("cart-item-name");
            itemName.text(`${product.product_name}`);

            const itemQuantity = $(`<span>`);
            itemQuantity.addClass("cart-quantity");
            itemQuantity.text(product.userPurchaseQuantity);

            const clearItem = $('<i class="fas fa-times clear-cart-item">');

            listItem.append(image, itemName, itemQuantity, clearItem);
            cartList.append(listItem);
        });
    }

    function calculateTotal(priceIncrement) {
        const userTotalSpan = $(`<span class="user-total">`);
        total += priceIncrement;
        userTotalSpan.text(`\$${total.toFixed(2)}`);
        cartDiv.append(userTotalSpan);
    }

    function removeItemFromCart() {
        const itemId = $(this).parent().attr("item-id");
        console.log(itemId);
        if (itemsInCart) {
            cart.forEach((item, index) => {

                // Has to be only two equal signs, for reasons unknown
                if (item.id == itemId) {
                    cart.splice(index, 1);
                    console.log(cart);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    window.location.reload();
                };
            });
        };
    }

    function submitOrder() {
        if (itemsInCart) {
            cart.forEach((item, index) => {
                $.ajax({
                    url: '/api/products/' + item.id,
                    type: 'GET',
                    success: data => {
                        const newQuantity = data.stock_quantity - item.quantity;
                        const newProductSales = parseFloat(data.product_sales) + item.quantity * data.price;
                        $.ajax({
                            url: '/api/products/' + data.id + '/quantity',
                            type: 'PUT',
                            data: { stock_quantity: newQuantity, product_sales: newProductSales },
                            success: function (err) {
                                if (err) return console.log(err);
                                else {
                                    alert("Price updated succesfully! You were charged: " + total);
                                    clearCart();
                                    window.location.href = "/"
                                };
                            }
                        });
                    }
                });
            });
        };
    }
});