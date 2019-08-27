$(document).ready(function () {
    const cartDiv = $("#cart-div");
    const cartList = $("#cart-list");

    // Flag for setting when the user loads the page with items in their cart
    let itemsInCart = false;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    $(document).on("click", "#clear-cart", clearCart);
    $(document).on("click", "#submit-order", submitOrder);
    $(document).on("click", ".remove-cart-item", handleRemoveCartItem);

    if (cart.length != 0) {
        itemsInCart = true;
        cart.forEach(cartItem => {
            buildListItems(cartItem);
        });
        $("#submit-order").removeAttr("disabled");
        $("#clear-cart").removeAttr("disabled");
    } else {
        console.log("Empty Cart!");
        cartList.append(`
        <li style="font-size: 22px;">Cart is empty!</li>
        <li style="margin-bottom:16px; margin-top: 6px;"><a href="/">View all products</a></li>
        `);
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

            cartList.append(`
            <li class="cart-list-item">
                <img src="/images/products/blandsofa.jpg" alt="blandsofa" class="cart-image">
                <div>
                    <div>Name:</div>
                    <div>Quantity:</div>
                </div>
                <div>
                    <div>${product.product_name}</div>
                    <div>${product.userPurchaseQuantity}</div>
                </div>
                <div class="remove-cart-item" data-id="${product.id}">
                    <i class="fas fa-times"></i>
                </div>
            </li>
            `);
        });
    }

    function calculateTotal(priceIncrement) {
        const userTotalSpan = $(`<span class="user-total">`);
        total += priceIncrement;
        userTotalSpan.text(`\$${total.toFixed(2)}`);
        cartDiv.append(userTotalSpan);
    }

    function removeItemFromCart(id) {
        if (itemsInCart) {
            cart.forEach((item, index) => {

                // Has to be only two equal signs, for reasons unknown
                if (item.id == id) {
                    cart.splice(index, 1);
                    console.log(cart);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    window.location.reload();
                };
            });
        };
    }

    function handleRemoveCartItem() {
        const id = $(this).attr("data-id");

        console.log("Item: ", id);
        removeItemFromCart(id);
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
                            url: '/api/products/id/' + data.id,
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