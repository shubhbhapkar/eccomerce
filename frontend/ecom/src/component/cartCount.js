import {useState,useEffect} from "react";

const CartCount =()=>{


const [cartCount, setCartCount] = useState(0);

  const updateCartCount = (a) => {
    setCartCount( cartCount + a);
    console.log("cartcountupdated",cartCount)
  };

  useEffect(() => {
    const fetchCartCount = async () => {
        try {
            const response = await fetch('http://localhost:8000/user/cartcount/', {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();
            console.log('API Response:', data);

            // Simulate delay for debugging
            setTimeout(() => {
                setCartCount(data.cart_count);
                console.log('Cart count updated after delay:', data.cart_count);
            }, 1000);
        } catch (error) {
            console.error('Error fetching cart count:', error);
        }
    };

    fetchCartCount();
}, []);
            return{cartCount,setCartCount,updateCartCount};
};
export default CartCount;