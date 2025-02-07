import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Cart } from './Components/Cart';
import { NavBar } from './Components/NavBar';
import { useEffect, useState } from 'react';
import { Dog } from './Interface/Dogs';
import axios from 'axios';
import Home from './Components/Home';
import DogsPage from './Components/DogsPage';
import { CartProvider } from './Context/Cart';

function App() {
  const [dogs, setDogs] = useState<Dog[]>([])
  useEffect(() => {
    async function fetchDogs() {
      const response = await axios.get('/v1/dogs')
      console.log(response.data)
      setDogs(response.data)
    }
    fetchDogs()
  }, [])
  return (
    
    <Router>
      <CartProvider>
      <NavBar/>
      <div className='page-container'>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dogs" element={<DogsPage dogs={dogs} />} />
        <Route path="/checkout" element={<Cart />} />
      </Routes>
      
      </div>
      </CartProvider>
    </Router>
  );
}

export default App;
