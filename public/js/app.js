const container = $("#products-display");
const cartItems = JSON.parse(localStorage.getItem("cartIds")) || [];

function renderProducts() {
    $.get("/api/products", data => {
        data.forEach(product => {
            product = buildItemObj(product);
            container.append(`<div class="product-container" data-id="${product.id}" data-name="${product.trimmedName}" data-department="${product.department}" data-stock="${product.stock}">
                <img class="product-image" src="/images/products/${product.trimmedName}.jpg">
                <div class="product-text-container">
                    <h2 class="product-name">${product.name}</h2>
                    <p class="product-price">\$${product.price}</p>
                </div>
            </div>`);
        });
    });
};

function showItem(id) {
    $.get("/api/products/id/" + id).then(product => {
        product = buildItemObj(product);
        $("#overlay").addClass("overlay-active");
        $("#overlay-item").append(`<div>
            <img src="/images/products/${product.trimmedName}.jpg" class="overlay-image">
            <h2 class="product-name">${product.name}</h2>
            <p class="product-price">${product.price}</p>
            <select id="quantity-select">
                
            </select>
            <input type="submit" onclick="addToCart(${product.id})">
</div>`);
        for (let i = 1; i <= product.stock; i ++ ) {
            $("#quantity-select").append(`<option value="${i}">${i}</option>`);
            if (i >= 3) break;
        }
    });
    
};

$("#products-display").on("click", ".product-container", e => {
    const id = $(e.currentTarget).attr("data-id")
    showItem(id);
});

$("#exit-overlay").on("click", e => closeOverlay());

function addToCart(id) {
    const qty = $("#quantity-select").val();
    closeOverlay();
    console.log("Adding to cart... id: " + id + ", Quantity: " + qty);
    cartItems.push({ itemId: id, itemQty: qty });
    localStorage.setItem("cartIds", JSON.stringify(cartItems));
};

function closeOverlay() {
    $("#overlay").removeClass("overlay-active");
    $("#overlay-item").empty();
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