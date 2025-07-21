import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Canvas from './components/Canvas.jsx'
import PrivacyPolicy from './components/PrivacyPolicy.jsx'

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Canvas />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App

