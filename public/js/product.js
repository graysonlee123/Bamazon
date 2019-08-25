$(document).ready(function () {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const url = window.location.search;
    let productId = null;

    $(document).on("click", "i#products-exit", function () { window.location.href = "/" });
    $(document).on("click", "#submit", checkCart);

    // If we have this section in our url, we pull out the post id from the url
    // In localhost:8080/cms?post_id=1, postId is 1
    if (url.indexOf("?product_id=") !== -1) {
        productId = parseInt(url.split("=")[1]);
        renderProduct(productId);
    };

    // Render all of the products to the page
    function renderProduct(productId) {
        $.get("/api/products/" + productId).then(product => {
            console.log("Product pre process:");
            console.log(product);

            $("#name").text(product.product_name);
            $("#price").text(product.price);
            $("#department").text(product.department_name);
            $("#image").attr('src', '/images/products/' + product.image_file);

            // Check the stock of the item, and only allow the user
            // to choose from what is available
            $.ajax({
                url: "/api/products/" + productId,
                method: "GET",
                success: function(product) {
                    const quantity = product.stock_quantity;
                    const stockWarnElement = $("#out-of-stock-warning");

                    // if (quantity <= 0) {
                    //     stockWarnElement.text("Out of Stock!");
                    //     $("#quantity").delete();
                    // } else {
                    //     if (quantity >= 1) {
                    //         $("#select-one").removeAttr("disabled");
                    //     };
                    //     if (quantity >= 2) {
                    //         $("#select-two").removeAttr("disabled");
                    //     };
                    //     if (quantity >= 3) {
                    //         $("#select-three").removeAttr("disabled");
                    //     };
                    // };
                    for (let i = 1, j = 1; i <= quantity && j <= 5; i ++, j++ ) {
                        $("#quantity").append(`<option>${i}</option>`);
                    }
                }
            })
        });
    }

    // Check the user's cart in order to see if they already have the item added
    function checkCart() {
        let alreadyInCart = false;
        if (cart) {
            cart.forEach(item => {
                if (item.id === productId) {
                    alreadyInCart = true;
                    alert("Already in cart!");
                };
            });
        };

        if (alreadyInCart === false) addToCart(cart);
    }

    function addToCart(cart) {
        cart.push({ id: productId, quantity: parseInt($("#quantity").val()) });
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.href = "/cart";
    }
});