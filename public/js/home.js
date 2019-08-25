$(document).ready(function () {
    // Render the products when the page loads
    renderProducts();

    // Set reset the scrolling flag
    let scrolling = false;

    const container = $("#products-display");

    // Loads the product webpage with the query for the product ID in the name
    $("#products-display").on("click", ".product-container", e => {
        const id = $(e.currentTarget).attr("data-id")
        window.location.href = "/product?product_id=" + id;
    });

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