import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "./footer";
import Navbar from "./Navbar";
import addToCart from "./add to cart";
import ProductCard from "./productcard";
import CartCount from "./cartCount";
const Category = () => {
  const {cartCount,setCartCount,updateCartCount} = CartCount();

  const { category_name } = useParams(); // Extract category_name from the URL
  const [products, setProducts] = useState([]);
  const [originalProducts, setOriginalProducts] = useState([]);
  // const [cartCount, setCartCount] = useState(0);

  // Price filter state
  
  const [maxPrice, setMaxPrice] = useState(1000); // Default max price

  const [currentMax, setCurrentMax] = useState(1000);

  // const updateCartCount = () => {
  //   setCartCount(cartCount + 1);
  //   console.log("Cart count updated:", cartCount);
  // };

  // useEffect(() => {
  //   const fetchCartCount = async () => {
  //     try {
  //       const response = await fetch("http://localhost:8000/user/cartcount/", {
  //         method: "GET",
  //         credentials: "include",
  //       });
  //       const data = await response.json();
  //       console.log("API Response:", data);

  //       // Simulate delay for debugging
  //       setTimeout(() => {
  //         setCartCount(data.cart_count);
  //         console.log("Cart count updated after delay:", data.cart_count);
  //       }, 1000);
  //     } catch (error) {
  //       console.error("Error fetching cart count:", error);
  //     }
  //   };

  //   fetchCartCount();
  // }, []);

  useEffect(() => {
    // Fetch products based on category_name
    axios
      .get(`http://localhost:8000/user/products/category/${category_name}/`, {
        withCredentials: true, // Include cookies in the request
      })
      .then((response) => {
        const uniqueProducts = [...new Map(response.data.map(item => [item.id, item])).values()];
        setProducts(uniqueProducts);
        setOriginalProducts(uniqueProducts);

        // Dynamically determine min and max price
        const prices = uniqueProducts.map((p) => p.discounted_price || p.price);
        
        setMaxPrice(Math.max(...prices));
       
        setCurrentMax(Math.max(...prices));

        console.log("Products fetched:", uniqueProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [category_name]); // Dependency array ensures effect runs when category_name changes

  // Filter products by price range
  const handleFilter = () => {
    const filtered = originalProducts.filter((product) => {
      const price = product.discounted_price || product.price;
      return price >= 0 && price <= currentMax;
    });
    setProducts(filtered);
  };

  // Reset filters
  const handleReset = () => {
    setProducts(originalProducts);
    
    setCurrentMax(maxPrice);
  };

  return (
    <>
      <Navbar cartCount={cartCount} setCartCount={setCartCount} updateCartCount={updateCartCount} />
      <section style={{ backgroundColor: "#eee" }}>
        <div className="text-center container py-5">
          <h4 className="mt-4 mb-5">
            <strong>{category_name}</strong>
          </h4>

          {/* Price Filter */}
          <div className="row mb-4 align-items-center">
            <div className="col-md-6 text-center">
              
            </div>
            <div className="col-md-3 text-center">
            <label htmlFor="maxRange" className="form-label fw-bold text-dark">
              Max Price: <span className="text-success">${currentMax}</span>
            </label>
            <input
              id="maxRange"
              type="range"
              className="form-range custom-range"
              min={0}
              max={maxPrice}
              value={currentMax}
              onChange={(e) => setCurrentMax(Number(e.target.value))}
            />
            </div>
            <div className="col-md-3 text-center mt-3 mt-md-0">
              <button className="btn btn-success me-2" onClick={handleFilter}>
                Apply Filter
              </button>
              <button className="btn btn-outline-secondary" onClick={handleReset}>
                Reset Filter
              </button>
            </div>
          </div>

          {/* Product Cards */}
          <div className="row">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                addToCart={addToCart}
                updateCartCount={updateCartCount}
              />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Category;
