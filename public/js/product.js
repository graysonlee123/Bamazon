$(document).ready(function () {

    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const url = window.location.search;
    let product = null;
    let queryId = null;

    $(document).on("click", "i#products-exit", function () { window.location.href = "/" });
    $(document).on("click", "#submit", handleSubmit);

    // If we have this section in our url, we pull out the post id from the url
    // In localhost:8080/cms?post_id=1, postId is 1
    if (url.indexOf("?product_id=") !== -1) queryId = parseInt(url.split("=")[1]);

    // Get the product used in the browser query
    getProduct(queryId);

    // AJAX Functions

    // This function gets the product's data 
    function getProduct(id) {
        let idQuery = "";
        if (id) {
            idQuery = "/id/" + id;
        }
        console.log("/api/products" + idQuery);
        $.get("/api/products" + idQuery).then(data => {
            product = data;
            renderProduct();
        });
    }

    //Handler Functions

    // Handles the submit button
    function handleSubmit() {
        if (checkCart()) addToCart();
        console.log("Checking cart...");
    }

    // Page Functions

    // Render all of the products to the page
    function renderProduct() {
        // Grab the elements from html
        $("#name").text(product.product_name);
        $("#price").text(product.price);
        $("#department").text(product.Department.department_name);
        $("#image").attr('src', product.image_url);

        // Check the stock of the item, and only allow the user
        // to choose from what is available
        const quantity = product.stock_quantity;
        const stockWarnElement = $("#out-of-stock-warning");

        if (quantity <= 0) {
            stockWarnElement.text("Out of Stock!");
            $("#quantity").remove();
            $("#submit").attr("disabled", "");
        } else {
            if (quantity < 5) $(".low-quantity").text("Low Quantity!");
            // Only allow maximum of 5 purchased items
            for (let i = 1, j = 1; i <= quantity && j <= 5; i++ , j++) {
                $("#quantity").append(`<option>${i}</option>`);
            };
        };
    }

    // Check the user's cart in order to see if they already have the item added
    function checkCart() {
        let alreadyInCart = false;
        if (cart) {
            cart.forEach(item => {
                if (item.id === product.id) {
                    alreadyInCart = true;
                    alert("Already in cart!");
                };
            });
        };

        if (alreadyInCart === false) return true;
    }

    // Adds the item to the local storage cart,
    // redirect to cart page
    function addToCart() {
        cart.push({ id: product.id, quantity: parseInt($("#quantity").val()) });
        localStorage.setItem("cart", JSON.stringify(cart));
        window.location.href = "/cart";
    }
});