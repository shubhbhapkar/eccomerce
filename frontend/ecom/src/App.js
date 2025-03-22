// src/App.js

import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './component/login';
import RegistrationPage from './component/registration';
import HomePage from './component/Home';
import About from './component/about';
import Contact from './component/contact';
import ProductDisplay from './component/productdetails';
import Mycart from './component/mycart';
import Category from './component/categoryproduct';
import Profile from './component/profile';
import PasswordReset from './component/forgetpassemail';
import PasswordResetForm from './component/passreset';
// import NikeCard from './component/test';
import Vendor from './component/vendor';
import CreateProductForm from './component/vendorProducts';
import ProductList from './component/vendorproductpage';
import UpdateProductForm from './component/vendorproductoperation';
import OrderConfirmationPage from './component/confirmorder';
import OrderConfirm from './component/checkout';
import UserOrders from './component/myorders';
import VendorOrders from './component/vendororders';
import Categorys from './component/category';
import FeedbackList from './component/feedback';
import Dashboard from './component/dashboard';
import Vendorprofile from './component/vendorprofile';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/" element={<HomePage />} />
                <Route path='/about' element={<About/>}/>
                <Route path='/contact' element={<Contact/>}/>
                <Route path='/product/:productId' element={<ProductDisplay/>}/>
                <Route path='/Mycart' element={<Mycart/>}/>
                <Route path="/products/:category_name" element={<Category/>}/>
                <Route path='/user/' element={<Profile/>}/>
                <Route path='/password/' element={<PasswordReset/>}/>
                <Route path="/password-reset/:uid/:token" element={<PasswordResetForm />} />
                <Route path="/vendor" element={<Vendor />} />
                <Route path='/addpro' element={<CreateProductForm/>} />
                <Route path='/vendorproduct/' element={<ProductList/>}/>
                <Route path='/vendorproduct/:id' element={<UpdateProductForm/>}/>
                <Route path='/order/:productId' element={<OrderConfirmationPage/>}/>
                <Route path='/checkout' element={<OrderConfirm/>}/>
                <Route path='/userorders' element={<UserOrders/>}/>
                <Route path='/vendororders' element={<VendorOrders/>}/>
                <Route path='/cat' element={<Categorys/>}/>
                <Route path='/feedback' element={<FeedbackList/>}/>
                <Route path='/vendorprofile' element={<Vendorprofile/>}/>
                <Route path='/Dashboard' element={<Dashboard/>}/>
               
            </Routes>
            
        </Router>
    );
};

export default App;
