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
      getAllUsersNonAdminNonMember(user.userId);
    }
    getActivity();
  }, []);

  const getAllUsersNonAdminNonMember = async (currId) => {
    
    DataService.getAllUsersNonAdminNonMember(currId)
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

  const addActivityMember = async (userid) => {

    const id = {activityid};

    DataService.addActivityMember(userid, id.activityid)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('User added successfuly!');
        } else {
          alert('User addition failed!');
        } 
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
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
            <div>
              <Table striped>
                <tbody>
                  <tr>
                    <th>Id</th>
                    <th>Username</th>
                    <th>Remove User</th>
                  </tr>
                  {Object.values(members).map((item) => (
                    <tr>
                      <td>{item[0]}</td>
                      <td>{item[1]}</td>
                      <td>
                        <Button variant='warning' onClick={() => addActivityMember()}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button variant='info' onClick={() => addActivityMember()}>
                Start Activity              
              </Button>
            </div>
          }
        
        </Card.Body>
        </Card>

      <br/>
      <br/>
      <h3>Add users to this activity</h3>

      {users.length === 0 &&
        <p>There are no available users.</p>
      }


      {users.length > 0 &&
        <Table striped>
        <tbody>
          <tr>
            <th>Id</th>
            <th>Username</th>
            <th>Add User</th>
          </tr>
          {Object.values(users).map((item) => (
            <tr>
              <td>{item[0]}</td>
              <td>{item[1]}</td>
              <td>
                <Button variant='info' onClick={() => addActivityMember(parseFloat(item[0]))}>
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
