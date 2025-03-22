import React, { useState, useEffect } from 'react';
import { Carousel } from 'react-bootstrap';
import './slider.css'; // Custom CSS file for styling

const Slider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  

  const products = [
    {
      id: 1,
      image: "images/slider1.jpg",
      title: 'Product 1',
      description: 'A high-quality item designed with precision and durability.',
    },
    {
      id: 2,
      image: "images/slider2.jpg",
      title: 'Product 2',
      description: 'Elegance and functionality combined in one piece.',
    },
    {
      id: 3,
      image: "images/slider3.jpg",
      title: 'Product 3',
      description: 'Perfect for daily use, crafted with care and precision.',
    },
  ];

  

  // Handle Next Slide
  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % products.length);
  };

  // Handle Previous Slide
  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? products.length - 1 : prevIndex - 1
    );
  };

  // Handle Slide Select (for manual controls if needed)
  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  // Auto Slide Logic
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext(); // Automatically go to the next slide
    }, 4000); // Change slide every 3 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []); // Re-run if product length changes

  return (<Carousel
    activeIndex={activeIndex}
    onSelect={handleSelect}
    controls={false} // Disable default controls, we'll use custom ones
    indicators={false} // Disable indicators
    interval={null} // Disable default auto-cycling
    fade
  >
    {products.map((product, index) => (
      <Carousel.Item key={product.id}>
        <div className="carousel-image-wrapper position-relative">
          {/* Product Image */}
          <img
            className="d-block w-100 rounded-3 shadow-sm"
            src={product.image}
            alt={product.title}
            style={{
              objectFit: "cover",
              maxHeight: "400px",
            }}
          />
  
          {/* Caption Overlay */}
          <div
            className={`carousel-caption-wrapper position-absolute bottom-0 start-0 w-100 p-3 bg-gradient-to-top ${
              activeIndex === index ? "show" : ""
            }`}
            style={{
              background: "linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0))",
              color: "white",
            }}
          >
            <h5 className="carousel-title text-truncate text-light mb-1">
              {product.title}
            </h5>
            <p className="carousel-description text-light small mb-0">
              {product.description}
            </p>
          </div>
        </div>
      </Carousel.Item>
    ))}
  
    {/* Custom Previous Button */}
    <button
      className="carousel-control-prev rounded-circle bg-light shadow-lg"
      onClick={handlePrev}
      aria-label="Previous"
      style={{
        position: "absolute",
        top: "50%",
        left: "10px",
        transform: "translateY(-50%)",
        border: "none",
        width: "40px",
        height: "40px",
      }}
    >
      <span className="text-dark fs-5">&lt;</span> {/* Left Arrow */}
    </button>
  
    {/* Custom Next Button */}
    <button
      className="carousel-control-next rounded-circle bg-light shadow-lg"
      onClick={handleNext}
      aria-label="Next"
      style={{
        position: "absolute",
        top: "50%",
        right: "10px",
        transform: "translateY(-50%)",
        border: "none",
        width: "40px",
        height: "40px",
      }}
    >
      <span className="text-dark fs-5">&gt;</span> {/* Right Arrow */}
    </button>
  </Carousel>
  
  );
};

export default Slider;
