import './index.css'
import React from 'react';
import DataService from '../../services/service';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Table } from 'react-bootstrap';

export default function Activity() {

  const [users, setUsers] = useState('');

  const [activity, setActivity] = useState('');
  const [reviews, setReviews] = useState('');

  const [authUser, setAuthUser] = useState({});

  const [errMessage, setErrMessage] = useState('');

  const { activityid } = useParams();

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    if (user) {
      setAuthUser(JSON.stringify(user));
      getAllUsersNonAdmin(user.userId);
    }
    getActivity();
  }, []);

  const getAllUsersNonAdmin = async (currId) => {
    
    DataService.getAllUsersNonAdmin(currId)
      .then(response => {
        setUsers(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const getActivity = async () => {

    const id = {activityid};

    DataService.getActivity(id.activityid)
      .then(response => {
        alert(JSON.stringify(response.data));
        setActivity(JSON.stringify(response.data));
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const addUserToActivity = async () => {
    alert('made it');
  }

  return (
    <div className='Activity'>
      <section>
          <div>
          <h3>Info: </h3>
          <p>activity id: {activity.activityid}</p>
          </div> 

      <br/>
      <br/>
      <h3>Add users to this activity</h3>

      {users.length === 0 &&
        <p>There are no registered users.</p>
      }


      {users.length > 0 &&
        <Table striped>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Add User</th>
            <th></th>
            <th></th>
          </tr>
          {Object.values(users).map((item) => (
            <tr>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
              <td>
                <Button variant='info' onClick={() => addUserToActivity()}>
                  Add
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
      } 
      </section>
    </div>
  );
}
