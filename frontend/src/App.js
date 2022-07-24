import './App.css';
import React from 'react';
import { Routes, Route } from "react-router-dom";

import Login from './components/Login';
import Register from './components/Register';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';
import About from './components/About';


function App() {
  return (
    <div className="App">
      <NavigationBar/>
      <br/><br/>
      <Routes>
        <Route exact path='/' element={<Home />}/>
        <Route exact path='/home' element={<Home />}/>
        <Route path='/login' exact element={<Login />}/>
        <Route path='/register' exact element={<Register />}/>
        <Route path='/admindashboard' exact element={<AdminDashboard />}/>
        <Route path='/dashboard' exact element={<Dashboard />}/>       
        <Route path='/about' exact element={<About />}/>       
      </Routes>
      <br/><br/>
      <Footer/> 
    </div>
  );
}

export default App;
