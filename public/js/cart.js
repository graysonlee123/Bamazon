$(document).ready(function () {
    // Grab cart container
    const cartDiv = $("#cart-div");
    // Grab cart list
    const cartList = $("#cart-list");
    // sets a flag for cart products
    const cartProducts = [];

    // Flag for setting when the user loads the page with items in their cart
    let itemsInCart = false;

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    $(document).on("click", "#clear-cart", handleClear);
    $(document).on("click", "#submit-order", handleSubmit);
    $(document).on("click", ".remove-cart-item", handleRemove);

    // Logic to check for cart data
    if (cart.length != 0) {
        itemsInCart = true;
        cart.forEach(cartItem => {
            getProduct(cartItem.id, cartItem.quantity);
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

    // Handler functions

    // This function handles the Clear button
    function handleClear() {
        clearCart();
        window.location.reload();
    }

    // This function handles the submit order logic
    function handleSubmit() {
        console.log("cart: ", cartProducts);
        if (itemsInCart) submitOrder();
    }

    // This functon handles deleting cart items
    function handleRemove() {
        const id = $(this).attr("data-id");
        if (itemsInCart) removeItemFromCart(id);
    }

    // AJAX Functions

    // AJAX for getting a product by ID, and passing user purchase quantity into it's data
    function getProduct(id, qty) {
        if (!id) return console.log("getProducts() needs an ID!");
        $.get("/api/products/id/" + id).then(product => {
            product.purchase_quantity = qty;
            cartProducts.push(product);
            listItem(product);
            total += parseFloat(product.purchase_quantity * product.price);
            updateTotal();
        });
    }

    // Page functions

    // This function clears the user's cart
    function clearCart() {
        event.preventDefault();
        localStorage.setItem('cart', JSON.stringify([]));
    }

    function listItem(product) {
        console.log(cartProducts)
        cartList.append(`
        <li class="cart-list-item">
            <img src="${product.image_url}" alt="${product.product_name}" class="cart-image">
            <div>
                <div>Name:</div>
                <div>Quantity:</div>
                <div>Price:</div>
            </div>
            <div>
                <div>${product.product_name}</div>
                <div>${product.purchase_quantity}</div>
                <div class="dollar">${product.price}</div>
            </div>
            <div class="remove-cart-item" data-id="${product.id}">
                <i class="fas fa-times"></i>
            </div>
        </li>
        `);
    }

    function updateTotal() {
        $("#total").text(total.toFixed(2));
    }

    function removeItemFromCart(id) {
        cart.forEach((item, index) => {
            // Has to be only two equal signs, for reasons unknown
            if (item.id == id) {
                cart.splice(index, 1);
                console.log(cart);
                localStorage.setItem("cart", JSON.stringify(cart));
                window.location.reload();
            };
        });
    }

    function submitOrder() {
        cartProducts.forEach((product, index) => {
            const newQuantity = cartProducts[index].stock_quantity - product.purchase_quantity;
            const newSales = parseFloat(cartProducts[index].product_sales) + parseFloat(product.price * product.purchase_quantity)
            console.log("New quantity: ", newQuantity, "New sales: ", newSales);
            $.ajax({
                url: "/api/products/id/" + product.id,
                type: "PUT",
                data: {
                    stock_quantity: newQuantity,
                    product_sales: newSales
                }
            });
        });

        if (confirm("Purchase succesfull! You were charged $" + total.toFixed(2) + ".")) {
            clearCart();
            window.location.href="/";
        }
    }
});