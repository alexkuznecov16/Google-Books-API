const cartItems = document.getElementById('cartItemsCount');
if (parseInt(cartItems.textContent) <= 0) {
    cartItems.style.display = 'none';
} else {
    cartItems.style.display = 'block';
}
