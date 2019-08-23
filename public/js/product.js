$(document).ready(function () {

    const url = window.location.search;

    $(document).on("click", "i#products-exit", event => {
        window.location.href = "/"
    });

    // If we have this section in our url, we pull out the post id from the url
    // In localhost:8080/cms?post_id=1, postId is 1
    if (url.indexOf("?product_id=") !== -1) {
        productId = url.split("=")[1];
        renderProduct(productId);
    };

    function renderProduct(productId) {
        $.get("/api/products/" + productId).then(product => {
            console.log("Product pre process:");
            console.log(product);

            //remove and use returned results
            // $("#product-display").text(product.product_name);
            // This is where we would render the Div for the product, and the submit / add to cart / quantity
        });
    };
});