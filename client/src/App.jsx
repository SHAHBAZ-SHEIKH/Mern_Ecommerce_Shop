import Product from "./pages/Product";
import Home from "./pages/Home";
import ProductList from "./pages/ProductList";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Success from "./components/Success";
import Cancel from "./components/Cancel";
import { useSelector } from "react-redux";
import OTPVerify from "./pages/OTPVerify"
import ForgotPassword from "./pages/ForgotPassword";
import ForgotPasswordSentPage from "./pages/VerifyEmail";
import ChangePassword from "./pages/ChangePassword";

const App = () => {
  const user = useSelector((state)=>state.user.currentUser)
  console.log("user",user)
  
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/products/:category" element={<ProductList />} />
        <Route path="/product/:id" element={<Product />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
          
        <Route path="/cart" element={<Cart />} />
        <Route path = "/success" element={<Success/> }/>
        <Route path = "/cancel" element={<Cancel/> }/>
        <Route path="/otp-verification" element={<OTPVerify/>} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="/verify-email" element={<ForgotPasswordSentPage/>} />
        <Route path="/change-password/:abcd/:12345" element={<ChangePassword/>} />



      </Routes>
    </BrowserRouter>
  )
};

export default App;