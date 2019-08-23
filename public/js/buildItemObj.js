function buildItemObj(product) {
    return {
        id: product.id,
        name: product.product_name,
        trimmedName: product.product_name.replace(/([ ])/g, "").toLowerCase(),
        department: product.department_name,
        price: product.price,
        stock: product.stock_quantity
    };
};