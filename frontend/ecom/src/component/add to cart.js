import axios from "axios";

const addToCart = async (product) => {
    // Retrieve fresh data from session storage for each call
    const user = JSON.parse(sessionStorage.getItem('user'));
    const isLoggedIn = !!user;
    const username = isLoggedIn ? user.username : '';

    if (isLoggedIn) {
        try {
            const response = await axios.post(
                'http://localhost:8000/user/cartcreate/',
                {
                    user: username,
                    product: product.id,
                    quantity: 1,
                }
            );
            alert(response.data.message);
        } catch (error) {
            console.error("Failed to add item to cart", error);
        }
    } else {
        alert("You need to log in");
    }
};

export default addToCart;