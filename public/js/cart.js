$(document).ready(function () {
    const cartDiv = $("#cart-div");
    const cartList = $("#cart-list");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let total = 0;

    $(document).on("click", "#clear-cart", clearCart);
    $("#cart-list").on("click", ".clear-cart-item", removeItemFromCart);
    
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

    function calculateTotal() {
        const userTotal = $(`<span class="user-total">`);
        userTotal.text(`\$${total}`);

        cartDiv.append(userTotal);
    }

    function removeItemFromCart() {
        const itemId = $(this).parent().attr("item-id");
        console.log(itemId);
        if (cart) {
            console.log("cart detected");
            cart.forEach((item, index) => {
                console.log(item, index);

                // Has to be only two equal signs, for reasons unknown
                if (item.id == itemId) {
                    console.log("Removing from cart");
                    cart.splice(index, 1);
                    console.log("Updated cart: ");
                    console.log(cart);
                    localStorage.setItem("cart", JSON.stringify(cart));
                    window.location.reload();
                }
            })
        }
    }
});