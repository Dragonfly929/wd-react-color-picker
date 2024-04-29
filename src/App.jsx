import React, { useState, useEffect, useRef } from 'react';
import reactLogo from './assets/react.svg';
import colorsLogo from './assets/color.png';
import './App.css';
import { SketchPicker } from 'react-color';
import Dexie from 'dexie';

function App() {
  const [color, setColor] = useState(localStorage.getItem('selectedColor') || '#000000');
  const [image, setImage] = useState(null);
  const [favoriteColors, setFavoriteColors] = useState([]);
  const [popularColors, setPopularColors] = useState([
    { color: '#FF0000', liked: false },
    { color: '#00FF00', liked: false },
    { color: '#0000FF', liked: false }
  ]);
  const [notification, setNotification] = useState(null);
  const [theme, setTheme] = useState('light'); // 'light' or 'dark'
  const imageRef = useRef(null);

  useEffect(() => {
    localStorage.setItem('selectedColor', color);
  }, [color]);

  useEffect(() => {
    const fetchData = async () => {
      const db = new Dexie('colorPickerDB');
      db.version(1).stores({
        favoriteColors: '++id,color'
      });
      const favoriteColorsFromDB = await db.favoriteColors.toArray();
      if (favoriteColorsFromDB) {
        setFavoriteColors(favoriteColorsFromDB.map(favColor => favColor.color));
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

  const addToFavorites = () => {
    if (!favoriteColors.includes(color)) {
      setFavoriteColors([...favoriteColors, color]);
      setNotification(`Added ${color} to Favorites`);
      setTimeout(() => {
        setNotification(null);
      }, 2000);

      // Save to IndexedDB
      const db = new Dexie('colorPickerDB');
      db.version(1).stores({
        favoriteColors: '++id,color'
      });
      db.favoriteColors.add({ color });
    }
  };

  const removeFromFavorites = (colorToRemove) => {
    const updatedFavorites = favoriteColors.filter((c) => c !== colorToRemove);
    setFavoriteColors(updatedFavorites);
    setNotification(`Removed ${colorToRemove} from Favorites`);
    setTimeout(() => {
      setNotification(null);
    }, 2000);

    // Remove from IndexedDB
    const db = new Dexie('colorPickerDB');
    db.version(1).stores({
      favoriteColors: '++id,color'
    });
    db.favoriteColors.where('color').equals(colorToRemove).delete();
  };

  const toggleLike = (index) => {
    const updatedPopularColors = [...popularColors];
    updatedPopularColors[index].liked = !updatedPopularColors[index].liked;
    const likedColor = updatedPopularColors[index].color;
  
    if (updatedPopularColors[index].liked) {
      setNotification(`Liked ${likedColor}`);
      setFavoriteColors([...favoriteColors, likedColor]);
      // Save to IndexedDB if not already in favorites
      const db = new Dexie('colorPickerDB');
      db.version(1).stores({
        favoriteColors: '++id,color',
        likedColors: '++id,color'
      });
      db.favoriteColors.add({ color: likedColor });
      db.likedColors.add({ color: likedColor });
    } else {
      setNotification(`Unliked ${likedColor}`);
      const updatedFavorites = favoriteColors.filter((c) => c !== likedColor);
      setFavoriteColors(updatedFavorites);
      // Remove from IndexedDB if unliked
      const db = new Dexie('colorPickerDB');
      db.version(1).stores({
        favoriteColors: '++id,color',
        likedColors: '++id,color'
      });
      db.favoriteColors.where('color').equals(likedColor).delete();
      db.likedColors.where('color').equals(likedColor).delete();
    }
  
    setPopularColors(updatedPopularColors);
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
                {image && <button onClick={handleDownload}>Download Image</button>}
              </div>
            </div>
          )}
        </div>
        <div className="favorite-button-container">
          <button className="add-favorite-button" onClick={addToFavorites}>
            <i className="fas fa-star"></i> Add to Favorites
          </button>
        </div>
        {notification && (
          <div className="notification">
            {notification}
          </div>
        )}
        <div className="favorites-container">
          <h2>Your Favorite Colors</h2>
          <div className="color-list">
            {favoriteColors.map((favColor, index) => (
              <div
                key={index}
                className="color-box"
                style={{ backgroundColor: favColor }}
                onClick={() => setColor(favColor)}>
                <button className="remove-button" onClick={() => removeFromFavorites(favColor)} title="Remove from Favorites">
                  <i className="fas fa-times"></i> Remove
                </button>
                <span className="color-name">{favColor}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="popular-container">
          <h2>Popular Colors</h2>
          <div className="color-list">
            {popularColors.map((popColor, index) => (
              <div className="color-box" style={{ backgroundColor: popColor.color }} key={index}>
                <button className="like-button" onClick={() => toggleLike(index)} title={popColor.liked ? "Unlike" : "Like"}>
                  {popColor.liked ? <i className="fas fa-heart heart-icon"></i> : <i className="far fa-heart heart-icon"></i>} {popColor.liked ? "Unlike" : "Like"}
                </button>
                <span className="color-name">{popColor.color}</span>
              </div>
            ))}
          </div>
        </div>
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
