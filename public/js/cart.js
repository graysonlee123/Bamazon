const cart = $("#cart-div");
const cartList = $("#cart-list");

const cartIds = JSON.parse(localStorage.getItem("cartIds"));
let total = 0;

cartIds.forEach( item => {
    buildListItem(item);
})

function buildListItem(item) {
    $.get("/api/products/id/" + item.itemId).then( data => {
        const product = buildItemObj(data);
        total += product.price;

        product.userPurchaseQuantity = item.itemQty;

        const listItem = $("<li>");
        listItem.addClass("cart-list-item");

        const image = $(`<img src="/images/products/${product.trimmedName}.jpg">`);
        image.addClass("cart-img");

        const itemName = $(`<h3 class="cart-item-name">`);
        itemName.text(`${product.name}`);
        
        const itemQuantity = $(`<span class="cart-quantity">`);
        itemQuantity.text(product.userPurchaseQuantity);

        listItem.append(image, itemName, itemQuantity);
        cartList.append(listItem);
    });
};

const userTotal = $(`<span class="user-total">`);
userTotal.text(`\$${total}`);

cart.append(userTotal);