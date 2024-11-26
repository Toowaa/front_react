
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router'
import Home from './homet.tsx'



createRoot(document.getElementById('root')!).render(
   
  <BrowserRouter>
  <Routes>
    
        <Route path="/" element={<App />} />
        <Route path="/home" element={<Home/>} />
     
      </Routes>
</BrowserRouter>
)
