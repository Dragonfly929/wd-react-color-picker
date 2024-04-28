import { useState } from 'react'
import reactLogo from './assets/react.svg'
import colorsLogo from './assets/color.png'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
         <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>       
        <a href="https://vitejs.dev" target="_blank">
          <img src={colorsLogo} className="logo" alt="Colors logo" />
        </a>
      </div>
      <h1>React + Color</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the React and Colors logos to learn more
      </p>
    </>
  )
}

export default App
