import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState } from "react";
import { Form, Button } from 'react-bootstrap';

export default function Login() {

  const [user, setUser] = useState('');

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [errMessage, setErrMessage] = useState('');

  const userAuth = async (event) => {
    event.preventDefault();

    setUser({
      username: username,
      password: password
    });

    DataService.login(user)
      .then(response => {
        setUser(response.data);
        alert('Successful user authentication!');
        window.location.href = '/dashboard';
      }).catch(err => {
        if (!err.response) {
          setErrMessage('No Server Response!');
        } else if (err.response.status < 500) {
          setErrMessage('User authentication failed!');
        } else {
          setErrMessage('Error: ' + err.response.data);
        }
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