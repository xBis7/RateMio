import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";
import { Button, Table } from 'react-bootstrap';

export default function AdminDashboard() {

  const [users, setUsers] = useState('');

  const [requests, setRequests] = useState('');
  const [tmpId, setTmpId] = useState('');

  const [authUser, setAuthUser] = useState({});

  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    if (user) {
      setAuthUser(JSON.stringify(user));
      getAllUsers(user.userId);
      getAllRequests();
    }
  }, []);

  const getAllUsers = async (currId) => {
    
    DataService.getAllUsers(currId)
      .then(response => {
        setUsers(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const getAllRequests = async () => {
    
    DataService.getAllRequests()
      .then(response => {
        setRequests(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const deleteUser = async (id) => {
    DataService.deleteUser(id)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('User successfuly deleted!');
        } else {
          alert('User delete failed!');
        }
        window.location.href = '/admindashboard';
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const deleteRequest = async (id) => {
    DataService.deleteRequest(id)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('Request dismissed!');
        } else {
          alert('Failed to delete request!');
        }
        window.location.href = '/admindashboard';
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const deleteRequestBasedOnUserId = async (userid) => {
    Object.values(requests).forEach(function(item) {
      if (item.userid === userid) {
        deleteRequest(item.requestid);
      }
    });
  }

  const updateAccess = async (id, level) => {
    DataService.updateUserAccess(id, level)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          if (level === 2) {
            alert('User now has super access!');
          } else {
            alert('User now has basic access!');
          }
        } else { 
          alert('Updating user access failed!');
        }
        window.location.href = '/admindashboard'
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  return (
    <div className='AdminDashboard'>
      <h3>User Control Panel</h3>
      <Table striped>
      <tbody>
        <tr>
          <th>Id</th>
          <th>Username</th>
          <th>Email</th>
          <th>Access Level</th>
          <th>Delete User</th>
          <th>Update Access to</th>
          <th>Preview Activities</th>
          <th>Preview Reviews</th>
          <th></th>
          <th></th>
        </tr>
        {Object.values(users).map((item) => (
          <tr>
            <td>{item[0]}</td>
            <td>{item[1]}</td>
            <td>{item[2]}</td>
            <td>{item[3]}</td>
            <td>
              <Button variant="danger" onClick={() => deleteUser(parseFloat(item[0]))}>
                Delete
              </Button>
            </td>
            <td>
                {item[3] === 2 &&
                  <Button variant='info' onClick={() => updateAccess(parseFloat(item[0]), 3)}>
                    Basic
                  </Button>
                }
                {item[3] === 3 &&
                  <Button variant='info' onClick={() => {
                                                updateAccess(parseFloat(item[0]), 2);
                                                deleteRequestBasedOnUserId(parseFloat(item[0]));
                                                }}>
                    Super
                  </Button>
                }            
            </td>
            <td>
              <Button variant='secondary'>Activities</Button>
            </td>
            <td>
              <Button variant='secondary'>Reviews</Button>
            </td>
          </tr>
        ))}
      </tbody>
      </Table>

      <br/>
      <br/>

      <h3>Pending Requests</h3>
      <Table striped>
      <tbody>
        <tr>
          <th>Request Id</th>
          <th>User Id</th>
          <th>Type</th>
          <th>Delete Request</th>
        </tr>
        {Object.values(requests).map((item) => (
          <tr>
            <td>{item.requestid}</td>
            <td>{item.userid}</td>
            <td>{item.type}</td>
            <td>
              <Button variant="danger" onClick={() => deleteRequest(parseFloat(item.requestid))}>
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
      </Table>
    </div>
  );
}
 