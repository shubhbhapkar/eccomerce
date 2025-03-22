import React,{useEffect} from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './footer';
import Products from './products';
import Slider from './slider';
import ProductCategories from './categorydisplay';
import CartCount from './cartCount';

const HomePage = () => {

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the route changes
  }, [location]);

    const { cartCount, setCartCount, updateCartCount } = CartCount();

    return (
        <div>
      <Navbar cartCount = {cartCount}  setCartCount = {setCartCount} updateCartCount = {updateCartCount}/>
     <Slider/>
     <ProductCategories/>
      <Products  updateCartCount = {updateCartCount}/>
      <Footer/>

    </div>
                   
    );
};

export default HomePage;
