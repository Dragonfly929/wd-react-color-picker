// PopularColors.js
import React from 'react';

const PopularColors = ({ popularColors, toggleLike }) => (
  <div className="popular-container">
    <h2>Popular Colors</h2>
    <div className="color-list">
      {popularColors.map((popColor, index) => (
        <div
          className="color-box"
          style={{ backgroundColor: popColor.color }}
          key={index}
        >
          <button
            className="like-button"
            onClick={() => toggleLike(index)}
            title={popColor.liked ? 'Unlike' : 'Like'}
          >
            {popColor.liked ? (
              <i className="fas fa-heart heart-icon"></i>
            ) : (
              <i className="far fa-heart heart-icon"></i>
            )}
            {popColor.liked ? 'Unlike' : 'Like'}
          </button>
          <span className="color-name">{popColor.color}</span>
        </div>
      ))}
    </div>
  </div>
);

export default PopularColors;
