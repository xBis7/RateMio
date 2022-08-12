import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";
import { Button, Form, Card, Table, Accordion } from 'react-bootstrap';

export default function Dashboard() {

  const [authUser, setAuthUser] = useState({});

  const [activities, setActivities] = useState('');

  const [username, setUsername] = useState('');

  const [activityOwner, setActivityOwner] = useState({});

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
      getAllUserActivities(user.userId);

    }
  }, []);

  const getAllUserActivities = (currId) => {
    
    DataService.getAllUserActivities(currId)
      .then(response => {
        setActivities(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const getActivityOwner = (userid) => {
    DataService.getUser(userid)
      .then(response => {
        setActivityOwner(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  } 

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

  const newActivity = () => {

    DataService.newActivity(id, activityName)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('Activity created successfuly!');
          window.location.href = '/dashboard';
        } else {
          alert('Activity creation failed!');
        } 
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const deleteActivity = (activityid) => {

    DataService.deleteActivity(activityid)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('Activity deleted successfuly!');
          window.location.href = '/dashboard';
        } else {
          alert('Activity deletion failed!');
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
            <Button onClick={newAccessReq}>Request Access</Button>
          </div>  
        }

        {access === 2 &&
          <div className='newActivity'>
          <Form onSubmit={newActivity} className='newActivityForm'>
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
        
        <br/>
        <br/>

        {Object.values(activities).map((item) => (
          <Accordion defaultActiveKey="0" flush className='accordion'>
            <Accordion.Item>
              <Accordion.Header>Activity: {item[2]}</Accordion.Header>
              <Accordion.Body>
                  <Table striped>
                    <tbody>
                      <tr>
                        <th>Number of members</th>
                        <th>Number of teams</th>
                      </tr>
                        <tr>
                          <td>{item[3]}</td>
                          <td>{item[4]}</td>
                        </tr>
                    </tbody>
                  </Table>
                  <Button className='openActButton' variant="primary" href={`activity/${item[0]}`}>Open Activity</Button>
                  <Button className='deleteActButton' variant="danger" onClick={() => deleteActivity(parseFloat(item[0]))}>Delete Activity</Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}


        
      </section>
    </div>
  );
}