const cartDiv = $("#cart-div");
const cartList = $("#cart-list");

const cart = JSON.parse(localStorage.getItem("cart")) || [];
let total = 0;

if (cart === []) {
    console.log("Empty Cart!");
} else {
    cart.forEach(cartItem => {
        buildListItem(cartItem);
    });
};

function buildListItem(item) {
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
};

const userTotal = $(`<span class="user-total">`);
userTotal.text(`\$${total}`);

cartDiv.append(userTotal);