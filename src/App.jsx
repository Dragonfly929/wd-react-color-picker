import { useState, useRef } from 'react';
import reactLogo from './assets/react.svg';
import colorsLogo from './assets/color.png';
import './App.css';
import { SketchPicker } from 'react-color'; // Import SketchPicker from react-color

function App() {
  const [color, setColor] = useState('#000000'); // State to store selected color
  const [image, setImage] = useState(null); // State to store uploaded image
  const imageRef = useRef(null); // Reference to the image element

  // Function to handle image upload
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

  // Function to handle image download
  const handleDownload = () => {
    if (image) {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      const img = new Image();
      img.src = image;

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        // Set the background color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw the image
        ctx.drawImage(img, 0, 0);

        // Convert canvas to data URL
        const dataURL = canvas.toDataURL('image/png');

        // Create a temporary link to download the image
        const a = document.createElement('a');
        a.href = dataURL;
        a.download = 'edited_image.png';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };
    }
  };

  return (
    <>
      <div>
        <a href="https://react.dev" target="_blank" rel="noopener noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <a href="https://vitejs.dev" target="_blank" rel="noopener noreferrer">
          <img src={colorsLogo} className="logo" alt="Colors logo" />
        </a>
      </div>
      <h1>React + Color</h1>
      <div className="card">
        <div className="color-picker-container">
          <SketchPicker
            color={color} // Set color from state
            onChange={(color) => setColor(color.hex)} // Handle color change and update state
          />
        </div>
        <div className="image-upload-container">
          <input type="file" onChange={handleImageUpload} accept="image/*" />
        </div>
        <div className="image-container">
          {image && (
            <div className="image-wrapper" style={{ backgroundColor: color }}>
              <img
                src={image}
                alt="Uploaded"
                className="uploaded-image"
                ref={imageRef}
              />
            </div>
          )}
        </div>
        <div className="download-container">
          {image && <button onClick={handleDownload}>Download Image</button>}
        </div>
      </div>
      <p className="read-the-docs">
        Click on the React and Colors logos to learn more
      </p>
    </>
  );
}

export default App;
