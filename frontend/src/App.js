import './App.css';
import {
  Routes,
  Route
} from 'react-router-dom';

import Login from './components/Login';
import Register from './components/Register';
import LogoBar from './components/LogoBar';
import NavigationBar from './components/NavigationBar';
import Home from './components/Home';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard';
import Dashboard from './components/Dashboard';


function App() {
  return (
    <div className="App">
      <LogoBar/>
      <NavigationBar/>
      <Routes>
        <Route exact path='/' element={<Home/>}/>
        <Route path='/login' exact element={<Login/>}/>
        <Route path='/register' exact element={<Register/>}/>
        <Route path='/admindashboard' exact element={<AdminDashboard/>}/>
        <Route path='/dashboard' exact element={<Dashboard/>}/>       
      </Routes>      
      <br/>
      <br/>
      <Footer/>
    </div>
  );
}

export default App;
