


import React, { useState, useEffect } from "react";
import {  useParams,useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import Navbar from "./Navbar";
import addToCart from "./add to cart";
import ProductCard from "./productcard";
import CartCount from "./cartCount";

const ProductDisplay = () => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to top when the route changes
  }, [location]);

  const {cartCount,setCartCount,updateCartCount} = CartCount();
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);  // State for selected color

  // const [cartCount, setCartCount] = useState(0);

  // const updateCartCount = () => {
  //   setCartCount( cartCount + 1);
  //   console.log("cartcountupdated",cartCount)
  // };

//   useEffect(() => {
//     const fetchCartCount = async () => {
//         try {
//             const response = await fetch('http://localhost:8000/user/cartcount/', {
//                 method: 'GET',
//                 credentials: 'include',
//             });
//             const data = await response.json();
//             console.log('API Response:', data);

//             // Simulate delay for debugging
//             setTimeout(() => {
//                 setCartCount(data.cart_count);
//                 console.log('Cart count updated after delay:', data.cart_count);
//             }, 1000);
//         } catch (error) {
//             console.error('Error fetching cart count:', error);
//         }
//     };

//     fetchCartCount();
// }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8000/user/getproduct/${productId}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setProduct(data);
        setSelectedColor(data.product_colors[0]);  // Set the default color to the first one
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchProduct();
  }, [productId]);

  // Fetch related products whenever `product` updates
  useEffect(() => {
    const fetchRelatedProducts = async () => {
      if (product && product.category) {
        try {
          const relatedResponse = await fetch(
            `http://localhost:8000/user/products/category/${product.category.name}/`
          );
          if (!relatedResponse.ok) {
            throw new Error("Failed to fetch related products");
          }
          const relatedData = await relatedResponse.json();
          setRelatedProducts(relatedData);
        } catch (error) {
          console.error("Fetch error for related products:", error);
        }
      }
    };

    fetchRelatedProducts();
  }, [product]); // Runs when `product` changes

  const handleColorChange = (color) => {
    const selected = product.product_colors.find(c => c.color === color);
    setSelectedColor(selected);
  };

  const StarRating = ({ rating, totalStars = 5 }) => (
    <div className="d-flex justify-content-center my-3">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <i
            key={index}
            className={`bi ${starValue <= rating ? "bi-star-fill text-warning" : "bi-star text-muted"}`}
            style={{ fontSize: "2rem" }}
          ></i>
        );
      })}
      <p className="ms-3 mt-3">Rating: {rating}</p>
    </div>
  );



  return (
    <>
      <Navbar cartCount = {cartCount}  setCartCount = {setCartCount} updateCartCount = {updateCartCount} />
      <section className="py-4" style={{ backgroundColor: "#f8f9fa" }}>
  <div className="container">
    <div className="row justify-content-center">
      <div className="col-lg-10">
        <div className="card border-0 rounded shadow-sm">
          <div className="row g-0">
            {/* Image Section */}
            <div className="col-lg-5">
              <div
                className="d-flex justify-content-center align-items-center p-3 bg-white h-100 border rounded-start"
                style={{ overflow: "hidden" }}
              >
                {product ? (
                  <img
                    src={`http://127.0.0.1:8000${selectedColor?.image_url}`}
                    alt={product.productname}
                    className="w-100 h-auto rounded"
                    style={{ objectFit: "contain" }}
                  />
                ) : (
                  <p className="text-muted">Loading image...</p>
                )}
              </div>
            </div>

            {/* Product Details Section */}
            <div className="col-lg-7">
              <div className="p-4">
                {/* Product Name */}
                <h3 className="text-dark fw-bold mb-3 text-truncate">
                  {product ? product.productname : "Loading..."}
                </h3>

                {/* Brand and Category */}
                <div className="d-flex flex-wrap mb-2">
                  <p className="mb-0 text-muted">
                    <strong>Brand:</strong>{" "}
                    <span className="text-primary" style={{fontSize:"20px"}}>{product?.productbrand}</span>
                  </p>
                  <p className="mb-0 ms-4 text-muted">
                    <strong>Category:</strong>{" "}
                    <span className="text-primary" style={{fontSize:"20px"}}>{product?.category?.name}</span>
                  </p>
                </div>

                {/* Description */}
                <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
                  {product ? product.description : "Loading product description..."}
                </p>

                {/* Color Selection */}
                {product?.product_colors.length > 1 && (
                  <div className="mb-3">
                    <label htmlFor="colorSelect" className="form-label fw-semibold">
                      Choose Color:
                    </label>
                    <select
                      id="colorSelect"
                      className="form-select"
                      value={selectedColor?.color}
                      onChange={(e) => handleColorChange(e.target.value)}
                    >
                      {product.product_colors.map((colorOption) => (
                        <option key={colorOption.color} value={colorOption.color}>
                          {colorOption.color.charAt(0).toUpperCase() +
                            colorOption.color.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Price and Stock */}
                <div className="d-flex align-items-center my-3">
                  <h5 className="text-success fw-bold mb-0 me-3">
                    ${product ? product.discounted_price : "0.00"}
                  </h5>
                  {product?.discount > 0 && (
                    <span className="text-muted text-decoration-line-through me-3">
                      ${product.price}
                    </span>
                  )}
                  <span
                    className={`badge ${
                      product?.stock_quantity ? "bg-success" : "bg-danger"
                    }`}
                  >
                    {product?.stock_quantity ? "In Stock" : "Out of Stock"}
                  </span>
                </div>

                {/* Ratings */}
                <div className="d-flex align-items-center mb-3">
                  {product ? (
                    <StarRating rating={product.rating} totalStars={5} />
                  ) : (
                    <p>Loading rating...</p>
                  )}
                </div>

                {/* Buttons */}
                <div className="d-flex">
                  <button
                    className="btn btn-success btn-lg me-3 px-4 text-white"
                    style={{ borderRadius: "30px" }}
                    onClick={() => window.location.href = `/order/${product.id}`}
                  >
                    Buy Now
                  </button>
                  <button
                    className="btn btn-outline-success btn-lg px-4"
                    style={{ borderRadius: "30px" }}
                    onClick={() => {
                      addToCart(product);
                      updateCartCount(1);
                    }}
                  >
                    <i className="bi bi-cart me-2"></i>Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


      <section style={{ backgroundColor: '#eee' }}>
      <div className="text-center container py-5">
        <h4 className="mt-4 mb-5">
          <strong>Similar Products</strong>
        </h4>
        <div className="row">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} updateCartCount={updateCartCount} />
          ))}
        </div>
      </div>
    </section>

    </>
  );
};

export default ProductDisplay;
