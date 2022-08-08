import './App.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { Routes, Route } from "react-router-dom";

import Login from './components/Login';
import Register from './components/Register';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import UnauthAdmin from './components/UnauthAdmin';
import Dashboard from './components/Dashboard';
import Activity from './components/Activity';

function App() {

  const [auth, setAuth] = useState(false);
  const [access, setAccess] = useState(3);

  useEffect(() => {
    //get if authenticated
    const authenticated = localStorage.getItem('auth');
    setAuth(authenticated);

    //get user
    const authUser = localStorage.getItem('authUser');
    const user = JSON.parse(authUser);
    if (user) {
      setAccess(user.accessLevel);
    }
    
  }, []);

  return (
    <div className="App">
      <NavigationBar/>
      <br/><br/>
      <Routes>
        <Route exact path='/' element={<Home />}/>
        <Route exact path='/home' element={<Home />}/>
        <Route path='/login' exact element={<Login />}/>
        <Route path='/register' exact element={<Register />}/>
        <Route path='/admindashboard' exact element={(auth && access === 1) ? <AdminDashboard /> : <UnauthAdmin />}/>
        <Route path='/dashboard' exact element={auth ? <Dashboard /> : <Login />}/>  
        <Route path='/activity/:activityid' exact element={auth ? <Activity /> : <Login />}/>       
      </Routes>
      <br/><br/>
      <Footer/> 
    </div>
  );
}

export default App;
