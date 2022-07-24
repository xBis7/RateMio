import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState } from "react";
import { Form, Button } from 'react-bootstrap';

export default function Register() {

  const [user, setUser] = useState('');

  const [email, setEmail] = useState('');

  const [username, setUsername] = useState('');

  const [password, setPassword] = useState('');

  const [confPassword, setConfPassword] = useState('');

  const [errMessage, setErrMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const newUser = async (event) => {
    if (email === "" || username === "" || password === "" || confPassword === "") {
      alert('All fields must be filled!');
    } else {
      event.preventDefault();

      setUser({
        email: email,
        username: username,
        password: password
      });

      DataService.register(user)
        .then(response => {
          setUser({
            email: response.user.email,
            username: response.user.username,
            password: response.user.password
          });
          alert('Successful registration!');
          setSuccess(true);
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
          
          if (errMessage != null) {
            alert(errMessage);
          } 
        }) 
    }
  }

  return (
    <div className='Register'>
      {success ? (
        <section>
          <h1>Success!</h1>
          <p>
            <a href="/login">Log In</a>
          </p>
        </section>
      ) : (
      <section>
        <h1>Register</h1>
        <br/>
        <Form onSubmit={newUser}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              required 
              type="email" 
              placeholder="Enter Email" 
            />
            <Form.Text className="text-muted">
              Your email will not be shared with anyone outside this platform.
            </Form.Text>
          </Form.Group>

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

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control 
              onChange={(e) => setConfPassword(e.target.value)}
              value={confPassword}
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
      )}
    </div>
  );
}