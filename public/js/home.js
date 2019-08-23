const container = $("#products-display");
const cartItems = JSON.parse(localStorage.getItem("cartIds")) || [];

function renderProducts() {
    $.get("/api/products", data => {
        data.forEach(product => {
            container.append(`<div class="product-container" data-id="${product.id}">
                <img class="product-image" src="/images/products/${product.image_file}">
                <div class="product-text-container">
                    <h2 class="product-name">${product.product_name}</h2>
                    <p class="product-price">\$${product.price}</p>
                </div>
            </div>`);
        });
    });
};

$("#products-display").on("click", ".product-container", e => {
    const id = $(e.currentTarget).attr("data-id")
    window.location.href = "/product?product_id=" + id;
});

$("#exit-overlay").on("click", e => closeOverlay());

function addToCart(id) {
    const qty = parseInt($("#quantity-select").val());
    console.log("Adding to cart... id: " + id + ", Quantity: " + qty);
    cartItems.push({ itemId: id, itemQty: qty });
    localStorage.setItem("cartIds", JSON.stringify(cartItems));
};

$(document).ready(function () {
    renderProducts();
    let scrolling = false;
    const products = $("#products");

    $("#layout").bind('mousewheel', function (e) {
        if (!scrolling) {
            setTimeout(() => {
                scrolling = false;
            }, 1200);
            scrolling = true;
            if (e.originalEvent.wheelDelta / 120 > 0) {
                console.log('scrolling up !');
                scroll(620);
            }
            else {
                console.log('scrolling down !');
                scroll(-620);
            }
        }
    });
    function scroll(distance) {
        const products = $("#products");
        products.stop().animate({
            scrollLeft: products.scrollLeft() + distance
        }, 500);
    }
});