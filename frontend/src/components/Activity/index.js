import './index.css'
import React from 'react';
import DataService from '../../services/service';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Table, Card } from 'react-bootstrap';

export default function Activity() {

  const [users, setUsers] = useState('');
  const [members, setMembers] = useState('');

  const [reviews, setReviews] = useState('');

  const [id, setId] = useState();
  const [ownerId, setOwnerId] = useState();
  const [username, setUsername] = useState('');
  const [activityName, setActivityName] = useState('');
  const [memberNum, setMemberNum] = useState('');
  const [teamNum, setTeamNum] = useState('');

  const [errMessage, setErrMessage] = useState('');
  const { activityid } = useParams();

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    if (user) {
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
        setId(response.data[0][0]);
        setOwnerId(response.data[0][1]);
        setUsername(response.data[0][2]);
        setActivityName(response.data[0][3]);
        setMemberNum(response.data[0][4]);
        setTeamNum(response.data[0][5]);

        const actId = response.data[0][0];
        const userId = response.data[0][1];

        getAllActivityUsers(userId, actId);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const getAllActivityUsers = async (ownerId, id) => {

    DataService.getAllActivityUsers(ownerId, id)
      .then(response => {
        setMembers(response.data);
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
        <h1>Activity Preview</h1>
        
        <br/>

        <Card>
        <Card.Header as="h5">Owner: {username}</Card.Header>
        <Card.Body>
          <Card.Title>Name: {activityName}</Card.Title>
          <Card.Text>
            Number of members: {memberNum}
            <br/>
            Number of teams: {teamNum}
          </Card.Text>
          
          {memberNum === 1 && 
            <p>This team has no other members than the owner.</p>
          }

          {memberNum > 1 && 
            <Table striped>
              <tbody>
                <tr>
                  <th>Id</th>
                  <th>Username</th>
                  <th>Remove User</th>
                  <th>Add to team</th>
                  <th></th>
                  <th></th>
                </tr>
                {Object.values(members).map((item) => (
                  <tr>
                    <td>{item[0]}</td>
                    <td>{item[1]}</td>
                    <td>
                      <Button variant='warning' onClick={() => addUserToActivity()}>
                        Remove
                      </Button>
                    </td>
                    <td>
                      <Button variant='info' onClick={() => addUserToActivity()}>
                        Team
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          }
        
        </Card.Body>
        </Card>

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
