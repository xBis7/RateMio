import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";
import { Button, Form } from 'react-bootstrap';

export default function Dashboard() {

  const [authUser, setAuthUser] = useState({});

  const [username, setUsername] = useState('');

  const [activityName, setActivityName] = useState('');

  const [id, setId] = useState();
  const [access, setAccess] = useState(3);
  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    if (user) {
      setAuthUser(JSON.stringify(user));
      setId(user.userId);
      setUsername(user.username);
      setAccess(user.accessLevel);
    }
  }, []);

  const newAccessReq = (event) => {
    event.preventDefault();
    
    const reqType = 'access';

    DataService.newAccessRequest(id, reqType)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('Access request sent successfuly!');
        } else {
          alert('Access request failed!');
        }      
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const newActivity = (event) => {
    event.preventDefault();

    DataService.newActivity(id, activityName)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('Activity created successfuly!');
        } else {
          alert('Activity creation failed!');
        } 
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  return (
    <div className='Dashboard'>
      <section>
        {access === 3 &&
          <div>
            <p>Request team leader privileges</p>
            <Button onClick={newAccessReq}>Access Request</Button>
          </div>  
        }

        {access === 2 &&
          <div>
          <Form onSubmit={newActivity}>
            <h3>Create a new Activity</h3>
            <br/>
            <br/>
            <Form.Group className="mb-3">
              <Form.Label>Activity name</Form.Label>
              <Form.Control
                autoComplete="off"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                required  
                type="text" 
                placeholder="Enter activity name" 
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              New Activity
            </Button>
          </Form>
          </div>  
        }

      </section>
    </div>
  );
}