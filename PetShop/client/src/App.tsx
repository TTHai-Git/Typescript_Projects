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
import Login from './Components/Login';
import Register from './Components/Register';
import { Provider } from 'react-redux';
import store from './store';
import AuthWrapper from './Components/AuthWrapper';
import UserInfo from './Components/UserInfo';

function App() {
  const [dogs, setDogs] = useState<Dog[]>([]);

  useEffect(() => {
    async function fetchDogs() {
      try {
        const response = await axios.get('/v1/dogs');
        setDogs(response.data);
      } catch (error) {
        console.error('Error fetching dogs:', error);
      }
    }
    fetchDogs();
  }, []);

  return (
    <Provider store={store}>
      <Router>
        <CartProvider>
          <AuthWrapper /> {/* Move authentication logic to separate component */}
          <NavBar />
          <div className='page-container'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dogs" element={<DogsPage dogs={dogs} />} />
              <Route path="/checkout" element={<Cart />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/userinfo" element={<UserInfo/>} />
            </Routes>
          </div>
        </CartProvider>
      </Router>
    </Provider>
  );
}

export default App;
