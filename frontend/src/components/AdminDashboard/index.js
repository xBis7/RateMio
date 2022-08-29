import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";
import { Button, Table } from 'react-bootstrap';

export default function AdminDashboard() {

  const [users, setUsers] = useState('');

  const [requests, setRequests] = useState('');
  const [activities, setActivities] = useState('');
  const [reviews, setReviews] = useState('');
  const [pendingReviews, setPendingReviews] = useState('');

  const [authUser, setAuthUser] = useState({});

  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    if (user) {
      setAuthUser(JSON.stringify(user));
      getAllUsers(user.userId);
      getAllAccessRequests();
      getAllPendingReviews();
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

  const getAllAccessRequests = async () => {
    
    DataService.getAllAccessRequests()
      .then(response => {
        setRequests(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const getAllPendingReviews = async () => {

    DataService.getAllPendingReviews()
      .then(response => {
        setPendingReviews(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const getAllUserActivities = (currId) => {
    
    DataService.getAllUserActivities(currId)
      .then(response => {
        if (response.data.length === 0) {
          alert('User has no activities!');
        }
        setActivities(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const getAllReviewerReviews = (currId) => {
    
    DataService.getAllReviewerReviews(currId)
      .then(response => {
        if (response.data.length === 0) {
          alert('User has no reviews!');
        }
        setReviews(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
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
      if (item[1] === userid) {
        deleteRequest(item[0]);
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

      {users.length === 0 &&
        <p>There are no registered users.</p>
      }


      {users.length > 0 &&
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
                <Button variant='secondary' onClick={() => getAllUserActivities(item[0])}>Activities</Button>
              </td>
              <td>
                <Button variant='secondary' onClick={() => getAllReviewerReviews(item[0])}>Reviews</Button>
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
      }

      <br/>
      <br/>

      <h3>Pending Access Requests</h3>
      
      {requests.length === 0 &&
        <p>There are no pending requests.</p>
      }

      {requests.length > 0 && 
        <Table striped>
        <tbody>
          <tr>
            <th>Request Id</th>
            <th>User Id</th>
            <th>Username</th>
            <th>Type</th>
            <th>Delete Request</th>
          </tr>
          {Object.values(requests).map((item) => (
            <tr>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
              <td>{item[2]}</td>
              <td>{item[3]}</td>
              <td>
                <Button variant="danger" onClick={() => deleteRequest(parseFloat(item[0]))}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
      }

      <br/>
      <br/>

      <h3>Pending Reviews</h3>

      {pendingReviews.length === 0 && 
        <p>There are no pending reviews.</p>
      }

      {pendingReviews.length > 0 &&
        <Table striped>
          <tbody>
            <tr>
              <th>Reviewer</th>
              <th>Leave review to</th>
              <th>Activity name</th>
            </tr>
            {Object.values(pendingReviews).map((item) => (
              <tr>
                <td>{item[2]}</td>
                <td>{item[4]}</td>
                <td>{item[6]}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      }

      <br/>
      <br/>

      {activities.length > 0 && 
        <div>
          <h3>Selected user activities</h3>
          <Table striped>
          <tbody>
            <tr>
              <th>Activity Id</th>
              <th>Owner username</th>
              <th>Activity name</th>
              <th>Number of members</th>
              {/* <th>Number of teams</th> */}
              <th>Open activity</th>
            </tr>
            {Object.values(activities).map((item) => (
              <tr>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
                <td>{item[3]}</td>
                {/* <td>{item[4]}</td> */}
                <td>             
                  <Button variant='info' href={`activity/${item[0]}`}>
                    Open
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
          </Table>
        </div>
      }

      {reviews.length > 0 && 
        <div>
          <h3>Selected user reviews</h3>
          <Table striped>
          <tbody>
            <tr>
              <th>Reviewer</th>
              <th>Reviewed username</th>
              <th>Activity name</th>
              <th>Communication</th>
              <th>Productivity</th>
              <th>Efficiency</th>
              <th>Openness</th>
              <th>Balance</th>
            </tr>
            {Object.values(reviews).map((item) => (
              <tr>
                <td>{item[0]}</td>
                <td>{item[1]}</td>
                <td>{item[2]}</td>
                <td>{item[3]}</td>
                <td>{item[4]}</td>
                <td>{item[5]}</td>
                <td>{item[6]}</td>
                <td>{item[7]}</td>
              </tr>
            ))}
          </tbody>
          </Table>
        </div>
      }
    </div>
  );
}
 