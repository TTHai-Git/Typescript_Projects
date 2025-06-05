import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { NavBar } from './Components/NavBar';
import Home from './Components/Home';
import { CartProvider } from './Context/Cart';
import Login from './Components/Login';
import Register from './Components/Register';
import { Provider } from 'react-redux';
import store from './store';
import UserInfo from './Components/UserInfo';
import ListOrders from './Components/ListOrders';
import ListOrderDetails from './Components/ListOrderDetails';
import Products from './Components/Products';
import ProductClothesType from './Components/ProductClothesType';
import ProductAccessoryType from './Components/ProductAccessoryType';
import ProductFoodType from './Components/ProductFoodType';
import ProductDogType from './Components/ProductDogType';
import GenerateOTP from './Components/GenerateOTP';
import ResetPassword from './Components/ResetPassword';
import { Footer } from './Components/Footer';
import FavoriteList from './Components/FavoriteList';
import UpdateCommentForm from './Components/Customs/UpdateCommentForm';
import PaymentReturn from './Components/Payment/VNPAY/VNPAYPaymentReturn';
import PAYOSPaymentReturn from './Components/Payment/PAYOS/PAYOSPaymentReturn';
import PaymentInfomation from './Components/PaymentInfomation';
import PaymentInfomationDetails from './Components/PaymentInfomationDetails';
import Breadcrumbs from './Components/BreadCrumbs';
import CheckOut from './Components/CheckOut';
import Cart from './Components/Cart';
import Shipment from './Components/Shipment';
import ShipmentInfomation from './Components/ShipmentInfomation';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <CartProvider>
          <NavBar />
          <div className='page-container'>
            <Breadcrumbs />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login/>} />
              <Route path="/generate-otp" element={<GenerateOTP/>} />
              <Route path="/reset-password" element={<ResetPassword/>} />
              <Route path="/register" element={<Register/>} />
              <Route path="/userinfo" element={<UserInfo/>} />
              <Route path="/userinfo/:user_id/orders" element={<ListOrders/>}/>
              <Route path="/userinfo/:user_id/orders/:order_id/orderDetails" element={<ListOrderDetails/>}/>
              <Route path="/userinfo/:user_id/orders/:order_id/paymentInfo" element={<PaymentInfomation/>}/>
              <Route path="/userinfo/:user_id/orders/:order_id/shipmentInfo" element={<ShipmentInfomation/>}/>
              <Route path='/userinfo/:user_id/orders/:order_id/paymentInfo/:payment_id/details' element={<PaymentInfomationDetails/>}/> 
              <Route path="/userinfo/:user_id/favoritelist" element={<FavoriteList/>}/>
              <Route path="/products" element={<Products />} />
              <Route path="/products/food/:product_id" element={<ProductFoodType/>}/>
              <Route path="/products/clothes/:product_id" element={<ProductClothesType/>}/>
              <Route path="/products/accessory/:product_id" element={<ProductAccessoryType/>}/>
              <Route path="/products/dog/:product_id/" element={<ProductDogType/>}/>
              <Route path="/comments/:commentId/updateCommentForm" element={<UpdateCommentForm/>}/>
              <Route path='/VNPAY/payment-return' element={<PaymentReturn/>}/>
              <Route path='/PAYOS/payment-return' element={<PAYOSPaymentReturn/>}/>
              <Route path='/cart/shipment' element={< Shipment/>}/>
              <Route path= "/cart/shipment/checkout" element={< CheckOut/>}/>
            </Routes>
          </div>
          <Footer/>
        </CartProvider>
      </Router>
    </Provider>
  );
}

export default App;
