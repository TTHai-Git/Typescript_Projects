import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Cart } from './Components/Cart';
import { NavBar } from './Components/NavBar';
import Home from './Components/Home';
import DogsPage from './Components/DogsPage';
import { CartProvider } from './Context/Cart';
import Login from './Components/Login';
import Register from './Components/Register';
import { Provider } from 'react-redux';
import store from './store';
import UserInfo from './Components/UserInfo';
import ListOrders from './Components/ListOrders';
import ListOrderDetails from './Components/ListOrderDetails';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <CartProvider>
          <NavBar />
          <div className='page-container'>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dogs/:page" element={<DogsPage />} />
              <Route path="/checkout" element={<Cart />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/userinfo" element={<UserInfo/>} />
              <Route path="/userinfo/:user_id/orders/:page" element={<ListOrders/>}/>
              <Route path="/userinfo/:user_id/orders/:order_id/orderDetails/:page" element={<ListOrderDetails/>}/>
            </Routes>
          </div>
        </CartProvider>
      </Router>
    </Provider>
  );
}

export default App;
