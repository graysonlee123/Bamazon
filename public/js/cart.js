const cart = $("#cart-div");
const cartList = $("#cart-list");

const cartIds = JSON.parse(localStorage.getItem("cartIds"));
let total = 0;

if (!cartIds || !cartIds.length) {
    console.log("Empty Cart!");
} else {
    cartIds.forEach(item => {
        buildListItem(item);
    });
};

function buildListItem(item) {
    console.log(item);
    $.get("/api/products/" + item.itemId).then(product => {
        total += product.price;

        product.userPurchaseQuantity = item.itemQty;

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

cart.append(userTotal);