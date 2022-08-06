import './index.css'
import React from 'react';
import Logo from '../../images/RateMio.png';
import { Nav, Container, Navbar, Image, Form, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';

export default function NavigationBar() {

  const [authUser, setAuthUser] = useState({});

  const [username, setUsername] = useState(''); 

  const [access, setAccess] = useState(3);

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    if (user) {
      setAuthUser(JSON.stringify(user));
      setUsername(user.username);
      setAccess(user.accessLevel);
//      alert('getItem: ' + user.username);
    }
  }, []);

  const logout = () => {
    setAuthUser({});
    localStorage.clear();
    window.location.href = '/login';
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg" fixed="top">
        <Container fluid>
          <Navbar.Brand href="/">RateMio<Image src={Logo} width="120px" height="50px" responsive/></Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
            >
              {access === 1 && 
                <Nav.Link href="/admindashboard">Admin Dashboard</Nav.Link>  
              }
              {(access === 2 || access === 3) && 
                <Nav.Link href="/dashboard">Dashboard</Nav.Link>  
              }
            </Nav>
            {username.length === 0 &&
              <Form className="d-flex">
                <Button variant="primary" href="/login" id="loginButton">Login</Button>
                <Button variant="info" href="/register" id="registerButton">Register</Button>
              </Form>
            }
            {username.length > 0 &&
              <Form className="d-flex">
                <h4 id='username'>Welcome back, {username}</h4>
                <Button variant='danger' onClick={logout} id="logoutButton">Logout</Button>  
              </Form>
            }
              
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </div>
  );
}