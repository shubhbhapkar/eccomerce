import React from "react";
import Navbar from "./Navbar";
import CartCount from "./cartCount";
const About = () =>{

  const { cartCount, setCartCount, updateCartCount } = CartCount();
  
    return(
        <>
        <Navbar cartCount={cartCount} setCartCount={setCartCount} updateCartCount={updateCartCount}/>
      <div
  className=" text-white text-center py-5"
  style={{
    backgroundColor: "#2ECC71", // Flipkart blue background
    borderBottomLeftRadius: "100px",
    borderBottomRightRadius: "100px",
  }}
>
  <h1 className="mt-5 text-light z-1">About Us...</h1>

  {/* Content Container */}
  <div className="container">
    <div className="row justify-content-center mt-4">
      {/* Image Section */}
      <div className="col-12 col-md-5 mb-4 mb-md-0">
        <img
          src={`${process.env.PUBLIC_URL}/images/happy.jpg`}
          alt="Happy Shopping"
          style={{
            width: "100%",
            borderRadius: "10px", // Add smooth corners for the image
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // Add shadow for more depth
          }}
        />
      </div>

      {/* Text Section */}
      <div className="col-12 col-md-7 mt-4 mt-md-0">
        <p
          className="text-left text-light"
          style={{
            fontSize: "1.1rem",
            lineHeight: "1.8",
            fontWeight: "400", // Lighter text for better readability
          }}
        >
          "Welcome to our e-commerce site, your one-stop destination for a seamless online shopping experience!
          We are committed to bringing you a vast selection of high-quality products across categories like fashion,
          electronics, home essentials, and more. With user-friendly navigation, secure checkout, and dedicated customer
          support, we strive to make online shopping as convenient and enjoyable as possible. Explore our latest collections,
          discover exclusive deals, and shop confidently with us as we prioritize quality, affordability, and exceptional
          service in everything we offer. Join our community of satisfied shoppers today!"
        </p>
      </div>
    </div>
  </div>
</div>


        </>
    );
};
export default About;