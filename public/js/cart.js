$(document).ready(function () {
    const cartDiv = $("#cart-div");
    const cartList = $("#cart-list");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    $(document).on("click", "#clear-cart", clearCart);

    if (cart.length != 0) {
        cart.forEach(cartItem => {
            buildListItems(cartItem);
        });
        calculateTotal();
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
            total += product.price;

            product.userPurchaseQuantity = item.quantity;

            const listItem = $("<li>");
            listItem.addClass("cart-list-item");

            const image = $(`<img>`);
            image.attr("src", `/images/products/${product.image_file}`)
            image.addClass("cart-img");

            const itemName = $(`<h3>`);
            itemName.addClass("cart-item-name");
            itemName.text(`${product.product_name}`);

            const itemQuantity = $(`<span>`);
            itemQuantity.addClass("cart-quantity");
            itemQuantity.text(product.userPurchaseQuantity);

            listItem.append(image, itemName, itemQuantity);
            cartList.append(listItem);
        });
    }

    function calculateTotal() {
        const userTotal = $(`<span class="user-total">`);
        userTotal.text(`\$${total}`);

        cartDiv.append(userTotal);
    }
});