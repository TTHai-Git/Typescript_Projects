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
import VerifyEmail from './Components/VerifyEmail';
import PhoneVerify from './Components/PhoneVerify';
import Dashboard from './Components/Pages/Admin/Dashboard';
import RequireAdmin from './Components/Pages/Admin/RequireAdmin';
import AdminProducts from './Components/Pages/Admin/AdminProducts';
import AdminUsers from './Components/Pages/Admin/AdminUsers';
import AdminBrands from './Components/Pages/Admin/AdminBrands';
import AdminBreeds from './Components/Pages/Admin/AdminBreeds';
import AdminCategories from './Components/Pages/Admin/AdminCategories';
import AdminComments from './Components/Pages/Admin/AdminComments';
import AdminCommentDetails from './Components/Pages/Admin/AdminCommentDetails';
import AdminFavorites from './Components/Pages/Admin/AdminFavorites';
import AdminOrders from './Components/Pages/Admin/AdminOrders';
import AdminOrderDetails from './Components/Pages/Admin/AdminOrderDetails';
import AdminPayments from './Components/Pages/Admin/AdminPayments';
import AdminRoles from './Components/Pages/Admin/AdminRoles';
import AdminShipments from './Components/Pages/Admin/AdminShipments';
import AdminVendors from './Components/Pages/Admin/AdminVendors';
import AdminVouchers from './Components/Pages/Admin/AdminVouchers';
import Chatbot from './Components/ChatBot';


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
              <Route path ="/verify-email" element={<VerifyEmail/>} />
              <Route path ="/verify-phone" element={<PhoneVerify/>} />
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
              // CRUD Admin Routes
              <Route path="/admin-dashboard" element={<RequireAdmin><Dashboard /></RequireAdmin>} />
              <Route path="/admin-dashboard/brands" element={<RequireAdmin><AdminBrands /></RequireAdmin>} />
              <Route path="/admin-dashboard/breeds" element={<RequireAdmin><AdminBreeds /></RequireAdmin>} />
              <Route path="/admin-dashboard/categories" element={<RequireAdmin><AdminCategories /></RequireAdmin>} />
              <Route path="/admin-dashboard/breeds" element={<RequireAdmin><AdminBreeds /></RequireAdmin>} />
              <Route path="/admin-dashboard/comments" element={<RequireAdmin><AdminComments /></RequireAdmin>} />
              <Route path="/admin-dashboard/commentDetails" element={<RequireAdmin><AdminCommentDetails /></RequireAdmin>} />
              <Route path="/admin-dashboard/favorites" element={<RequireAdmin><AdminFavorites /></RequireAdmin>} />
              <Route path="/admin-dashboard/orders" element={<RequireAdmin><AdminOrders /></RequireAdmin>} />
              <Route path="/admin-dashboard/orderDetails" element={<RequireAdmin><AdminOrderDetails /></RequireAdmin>} />
              <Route path="/admin-dashboard/payments" element={<RequireAdmin><AdminPayments /></RequireAdmin>} />
              <Route path="/admin-dashboard/products" element={<RequireAdmin><AdminProducts /></RequireAdmin>} />
              <Route path="/admin-dashboard/roles" element={<RequireAdmin><AdminRoles /></RequireAdmin>} />
              <Route path="/admin-dashboard/shipments" element={<RequireAdmin><AdminShipments /></RequireAdmin>} />
              <Route path="/admin-dashboard/users" element={<RequireAdmin><AdminUsers /></RequireAdmin>} />
              <Route path="/admin-dashboard/vendors" element={<RequireAdmin><AdminVendors /></RequireAdmin>} />
              <Route path="/admin-dashboard/vouchers" element={<RequireAdmin><AdminVouchers /></RequireAdmin>} />
            </Routes>
          </div>
          <Chatbot/>
          
          <Footer/>
        </CartProvider>
      </Router>
    </Provider>
  );
}

export default App;
