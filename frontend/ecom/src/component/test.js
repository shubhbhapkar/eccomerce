import React from 'react';
import './NikeCard.css'; // Import the CSS file for styling

function NikeCard() {
  return (
    <div className="nike-card">
      <div className="image-container">
        <img src="https://example.com/shoe-image.jpg" alt="Nike Running Shoe" />
        <button className="wishlist-button">♡</button>
      </div>

      <div className="details-container">
        <h2>Nike Running Shoe</h2>
        <p>EU38 BLACK/WHITE</p>
        <p>Crossing hardwood comfort with off-court flair. '80s-inspired construction, bold details and nothin'-but-net style.</p>

        <div className="price-container">
          <p>PRICE</p>
          <p>$69.99</p>
        </div>

        <button className="add-to-cart-button">Add to Cart</button>
      </div>
    </div>
  );
}

export default NikeCard;