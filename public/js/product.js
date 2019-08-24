$(document).ready(function () {

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

    function renderProduct(productId) {
        $.get("/api/products/" + productId).then(product => {
            console.log("Product pre process:");
            console.log(product);

            $("#name").text(product.product_name);
            $("#price").text(product.price);
            $("#department").text(product.department_name);
            $("#image").attr('src', '/images/products/' + product.image_file);
        });
    }

    function checkCart() {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let alreadyInCart = false;
        if (cart) {
            cart.forEach(item => {
                if (item.id === productId) alreadyInCart = true;
                alert("Already in cart!");
            });
        }
        if (alreadyInCart === false) addToCart(cart);
    }

    function addToCart(cart) {
        cart.push({ id: productId, quantity: parseInt($("#quantity").val()) });
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.href = "/cart";
    }
});