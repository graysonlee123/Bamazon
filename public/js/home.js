$(document).ready(function () {
    // Render the products when the page loads
    renderProducts();

    const container = $("#products-display");

    // Loads the product webpage with the query for the product ID in the name
    $("#products-display").on("click", ".product-container", e => {
        const id = $(e.currentTarget).attr("data-id")
        window.location.href = "/product?product_id=" + id;
    });

    function renderProducts() {
        $.get("/api/products", data => {
            data.forEach(product => {
                let lowQuantity = "";
                if (product.stock_quantity <= 0) {
                    lowQuantity = "Out of Stock!"
                } else if (product.stock_quantity < 5 ) {
                    lowQuantity = "Low Quantity!"
                }
                container.append(`<div class="product-container" data-id="${product.id}">
                <img class="product-image" src="/images/products/${product.image_file}">
                <div class="product-text-container">
                    <h2 class="product-name large-font name">${product.product_name}<span class="main-body-font low-quantity">${lowQuantity}</span></h2>
                    <p class="product-department department">${product.department_name}</p>
                    <p class="product-price price">\$${product.price}</p>
                </div>
            </div>`);
            });
        });
    };
});