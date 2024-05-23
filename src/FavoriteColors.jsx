// FavoriteColors.js
import React from 'react';

const FavoriteColors = ({ favoriteColors, setColor, removeFromFavorites }) => (
  <div className="favorites-container">
    <h2>Your Favorite Colors</h2>
    <div className="color-list">
      {favoriteColors.map((favColor, index) => (
        <div
          key={index}
          className="color-box"
          style={{ backgroundColor: favColor }}
          onClick={() => setColor(favColor)}
        >
          <button
            className="remove-button"
            onClick={(e) => {
              e.stopPropagation();
              removeFromFavorites(favColor);
            }}
            title="Remove from Favorites"
          >
            <i className="fas fa-times"></i> Remove
          </button>
          <span className="color-name">{favColor}</span>
        </div>
      ))}
    </div>
  </div>
);

export default FavoriteColors;
