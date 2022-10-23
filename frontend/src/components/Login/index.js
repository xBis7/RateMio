import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState } from "react";
import { Form, Button } from 'react-bootstrap';

export default function Login() {

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [authUser, setAuthUser] = useState({});

  const [errMessage, setErrMessage] = useState('');

  const userAuth = async (event) => {
    event.preventDefault();

    const user = {
      username: username,
      password: password
    };

    DataService.login(user)
      .then(response => {
        if (JSON.stringify(response.data.username) === 'null') {
          alert('User Authentication failed!');
          window.location.href = '/login';
        } else {
//          alert('Successful user authentication!');
          setAuthUser(JSON.stringify(response.data));
//          alert(authUser.userId);
          localStorage.setItem('authUser', JSON.stringify(response.data));
          localStorage.setItem('auth', true);
          if (JSON.stringify(response.data.accessLevel) === "1") {
            window.location.href = '/admindashboard';
          } else {
            window.location.href = '/dashboard';
          }
        }
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  return (
    <div className='Login'>
      <section>
        <h1>Login</h1>
        <br/>
        <Form onSubmit={userAuth}>
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoComplete="off"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              required
              type="text" 
              placeholder="Enter Username" 
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control 
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              required   
              type="password" 
              placeholder="Enter Password" 
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Login
          </Button>
        </Form>
        <br/>
        <p>
          Don't have an account?
          <br/>
          <a href='/register'>Sign Up</a>
        </p>
      </section>
    </div>
  );
}