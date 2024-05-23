// App.js
import React, { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import colorsLogo from './assets/color.png';
import './App.css';
import { SketchPicker } from 'react-color';
import db from './db';
import FavoriteColors from './FavoriteColors';
import PopularColors from './PopularColors';
import Notification from './Notification';

function App() {
  const [color, setColor] = useState(localStorage.getItem('selectedColor') || '#000000');
  const [image, setImage] = useState(null);
  const [favoriteColors, setFavoriteColors] = useState([]);
  const [popularColors, setPopularColors] = useState([
    { color: '#7469B6', liked: false },
    { color: '#AD88C6', liked: false },
    { color: '#E1AFD1', liked: false }
  ]);
  const [notification, setNotification] = useState(null);
  const [theme, setTheme] = useState('light');
  const imageRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('selectedColor', color);
  }, [color]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const favoriteColorsFromDB = await db.favoriteColors.toArray();
        if (favoriteColorsFromDB) {
          setFavoriteColors(favoriteColorsFromDB.map(favColor => favColor.color));
        }
      } catch (error) {
        console.error('Failed to fetch favorite colors:', error);
      }
    };
    fetchData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setImage(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleDownload = () => {
    if (image) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const img = new Image();
      img.src = image;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'edited_image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    }
  };

  const addToFavorites = async () => {
    if (!favoriteColors.includes(color)) {
      try {
        await db.favoriteColors.add({ color });
        setFavoriteColors([...favoriteColors, color]);
        showNotification(`Added ${color} to Favorites`);
      } catch (error) {
        console.error('Failed to add to favorites:', error);
      }
    }
  };

  const removeFromFavorites = async (colorToRemove) => {
    try {
      await db.favoriteColors.where('color').equals(colorToRemove).delete();
      const updatedFavorites = favoriteColors.filter((c) => c !== colorToRemove);
      setFavoriteColors(updatedFavorites);
      showNotification(`Removed ${colorToRemove} from Favorites`);
    } catch (error) {
      console.error('Failed to remove from favorites:', error);
    }
  };

  const toggleLike = async (index) => {
    const updatedPopularColors = [...popularColors];
    updatedPopularColors[index].liked = !updatedPopularColors[index].liked;
    const likedColor = updatedPopularColors[index].color;

    try {
      if (updatedPopularColors[index].liked) {
        if (!favoriteColors.includes(likedColor)) {
          await db.favoriteColors.add({ color: likedColor });
          setFavoriteColors([...favoriteColors, likedColor]);
        }
        await db.likedColors.add({ color: likedColor });
        showNotification(`Liked ${likedColor}`);
      } else {
        await db.likedColors.where('color').equals(likedColor).delete();
        const updatedFavorites = favoriteColors.filter((c) => c !== likedColor);
        setFavoriteColors(updatedFavorites);
        showNotification(`Unliked ${likedColor}`);
      }
    } catch (error) {
      console.error('Failed to toggle like:', error);
    }

    setPopularColors(updatedPopularColors);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => {
      setNotification(null);
    }, 2000);
  };

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <div className={`app-container ${theme}`}>
      <header className="header">
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <h1>React + Color</h1>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={colorsLogo} className="logo" alt="Colors logo" />
        </a>
      </header>
      <div className="card">
        <div className="color-picker-image-container">
          <div className="color-picker-container">
            <SketchPicker
              color={color}
              onChange={(color) => setColor(color.hex)}
            />
          </div>
          <div className="space"></div>
          <div className="image-upload-container">
            <input type="file" onChange={handleImageUpload} accept="image/*" />
          </div>
          {image && (
            <div className="image-container">
              <div className="image-wrapper" style={{ backgroundColor: color }}>
                <img
                  src={image}
                  alt="Uploaded"
                  className="uploaded-image"
                  ref={imageRef}
                />
              </div>
              <div className="download-container">
                <button onClick={handleDownload}>Download Image</button>
              </div>
            </div>
          )}
        </div>
        <div className="favorite-button-container">
          <button className="add-favorite-button" onClick={addToFavorites}>
            <i className="fas fa-star"></i> Add to Favorites
          </button>
        </div>
        {notification && <Notification message={notification} />}
        <FavoriteColors
          favoriteColors={favoriteColors}
          setColor={setColor}
          removeFromFavorites={removeFromFavorites}
        />
        <PopularColors popularColors={popularColors} toggleLike={toggleLike} />
        <div className="theme-toggle-container">
          <button className="theme-toggle-button" onClick={toggleTheme}>
            {theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          </button>
        </div>
      </div>
      <p className="read-the-docs">
        Click on the React and Colors logos to learn more
      </p>
    </div>
  );
}

export default App;
