import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect, useRef } from "react";
import { Form, Button } from 'react-bootstrap';

export default function Register() {

  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');

  const [errMessage, setErrMessage] = useState('');

  const newUser = async (event) => {
    event.preventDefault();    
    
    const user = {
      email: email,
      username: username,
      password: password
      };

    DataService.register(user)
      .then(response => {
        setUsername(JSON.stringify(response.data.username));
        setEmail(JSON.stringify(response.data.email));
        alert('Successful registration!');
        window.location.href = '/login'; 
      })
      .catch(err => {
        if (!err.response) {
          setErrMessage('No Server Response!');
        } else if (err.response.status === 409) {
          setErrMessage('Username already taken!');
        } else {
          setErrMessage('Error: ' + err.response.data);
        }
        alert(errMessage);
      }) 
  }

  return (
    <div className='Register'>
      <section>
        <h1>Register</h1>
        <br/>
        <Form onSubmit={newUser}>
          <Form.Group className="mb-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              type="email" 
              placeholder="Enter Email" 
            />
            <Form.Text className="text-muted">
              Your email will not be shared with anyone outside this platform.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              autoComplete="off"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              type="text" 
              placeholder="Enter Username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required               
              type="password" 
              placeholder="Enter Password" 
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              value={confPassword}
              onChange={(e) => setConfPassword(e.target.value)}
              required                
              type="password" 
              placeholder="Enter Password again" 
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Register
          </Button>
        </Form>
        <br/>
        <p>
          Already have an account?
          <br/>
          <a href='/login'>Log In</a>
        </p>
      </section>
    </div>
  );
}