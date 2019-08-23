const container = $("#products-display");

$.get("/api/products", data => {
    data.forEach(item => {
        const id = item.id;
        const name = item.product_name;
        const trimmedName = name.replace(/([ ])/g, "").toLowerCase();
        const imageUrl = `images/products/${trimmedName}.jpg`;
        console.log(imageUrl);
        const department = item.department_name;
        const price = item.price;
        const stock = item.stock_quantity;
        container.append(`<div class="product-container" data-id="${id}" data-name="${trimmedName}" data-department="${department}" data-stock="${stock}">
            <img class="product-image" src="${imageUrl}">
            <div class="product-text-container">
                <h2 class="product-name">${name}</h2>
                <p class="product-price">\$${price}</p>
            </div>
        </div>`);
    });
});