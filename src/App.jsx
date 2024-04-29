import { useState } from 'react';
import reactLogo from './assets/react.svg';
import colorsLogo from './assets/color.png';
import './App.css';
import { SketchPicker } from 'react-color'; // Import SketchPicker from react-color

function App() {
  const [count, setCount] = useState(0);
  const [color, setColor] = useState('#000000'); // State to store selected color

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
        <div className="color-picker-container"> {/* Added container div */}
          <SketchPicker
            color={color} // Set color from state
            onChange={(color) => setColor(color.hex)} // Handle color change and update state
          />
        </div>
        <div style={{ backgroundColor: color, width: '50px', height: '50px' }}></div>
      </div>
      <p className="read-the-docs">
        Click on the React and Colors logos to learn more
      </p>
    </>
  );
}

export default App;
