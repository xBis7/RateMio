import './index.css'
import React from 'react';
import { useRef, useState, useEffect } from "react";
import axios from '../../api/axios';
import { Form, Button } from 'react-bootstrap';

const USER_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;
const REGISTER_URL = '/newUser';


export default function Register() {

  const [email, setEmail] = useState('');

  const [username, setUsername] = useState('');
  const [validName, setValidName] = useState(false);
  const [usernameFocus, setUsernameFocus] = useState(false);

  const [password, setPassword] = useState('');
  const [validPassword, setValidPassword] = useState(false);
  const [passwordFocus, setPasswordFocus] = useState(false);

  const [confPassword, setConfPassword] = useState('');
  const [validConf, setValidConf] = useState(false);
  const [confFocus, setConfFocus] = useState(false);

  const [errMessage, setErrMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:8080/RateMio/newUser',
        JSON.stringify({ username, email, password }), 
        {
          headers : { 'Content-Type': 'application/json' },
          withCredentials: true
        }
      );
      setSuccess(true);

      //clear state and inputs
      setUsername('');
      setPassword('');
      setConfPassword('');
    } catch (err) {
      if (!err.response) {
        setErrMessage('No Server Response');
      } else if (err.response.status === 409) {
        setErrMessage('Username Taken');
      } else {
        setErrMessage('Registration Failed')
      }
    }
    alert('Successful registration!');
/*    window.location.href = '/login' */
  }

  async function onRegister(event) {
    event.preventDefault()
    await fetch(`http://localhost:8080/RateMio/newUser`, {
      method: 'POST',
      headers:{
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        password
      }),
    })
    alert('Επιτυχής Εγγραφή')
    window.location.href = '/login'
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
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                autoComplete="off"
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