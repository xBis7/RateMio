import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState } from "react";
import { Form, Button } from 'react-bootstrap';

export default function Dashboard() {

  const [username, setUsername] = useState('');

  const [id, setId] = useState('');

  const [errMessage, setErrMessage] = useState('');

  const getUserWithId = async (event) => {
    event.preventDefault();

    DataService.getUser(id)
      .then(response => {
        setUsername(JSON.stringify(response.data.username));
        //window.location.href = '/dashboard';
      }).catch(err => {
        setErrMessage('Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  return (
    <div className='Dashboard'>
      <section>
        <h1>Get User</h1>
        <br/>
        <Form onSubmit={getUserWithId}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Id</Form.Label>
            <Form.Control
              autoComplete="off"
              onChange={(e) => setId(e.target.value)}
              value={id}
              required
              type="number" 
              placeholder="Enter Id" 
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Get User
          </Button>
        </Form>
        <br/>
        <p>
          user: {username}
        </p>
      </section>
    </div>
  );
}