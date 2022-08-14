import './index.css'
import React from 'react';
import DataService from '../../services/service';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Table, Card, Tab, Row, Col, ListGroup, Form } from 'react-bootstrap';

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

  const [teams, setTeams] = useState();
  const [teamName, setTeamName] = useState('');

  const [displayTeamMaker, setDisplayTeamMaker] = useState(false);

  const [errMessage, setErrMessage] = useState('');
  const { activityid } = useParams();

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    getAllUsersNonAdminNonMember();
    getActivity();
  }, []);

  const getAllUsersNonAdminNonMember = async () => {
    
    const id = {activityid};

    DataService.getAllUsersNonAdminNonMember(id.activityid)
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
          window.location.reload();
        } else {
          alert('User addition failed!');
        } 
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const checkForTeams = async () => {
    if(members.length >= 4) {
      setDisplayTeamMaker(true);
    } else {
      alert('Activity members must be at least 4 to create teams');
    }
  }

  const removeActivityMember = async (userid) => {

    const id = {activityid};

    DataService.removeActivityMember(userid, id.activityid)
    .then(response => {
      if(JSON.stringify(response.data.success) === 'true') {
        window.location.reload();
      } else {
        alert('Member remove failed!');
      } 
    }).catch(err => {
      setErrMessage('Server Error: ' + err.response.data);
      alert(errMessage);
    })
  }

  const newTeam = () => {
    
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
            Number of members: {memberNum-1}
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
                        <Button variant='warning' onClick={() => removeActivityMember(parseFloat(item[0]))}>
                          Remove
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <Button variant='info' onClick={checkForTeams}>
                Create teams
              </Button>
            </div>
          } 

          {displayTeamMaker === true && 
            <div>
              <br/>
              <p>Halo let's create some teams</p>
              <br/>
              <Form onSubmit={newTeam} className='newTeamForm'>
                <h3>Create a new team</h3>
                <br/>
                <br/>
                <Form.Group className="mb-3">
                  <Form.Label>Team name</Form.Label>
                  <Form.Control
                    autoComplete="off"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    required  
                    type="text" 
                    placeholder="Enter team name" 
                  />
                </Form.Group>
                <Button variant="primary" type="submit">
                  New Team
                </Button>
              </Form>

              <Tab.Container id="list-group-tabs-example" defaultActiveKey="#link1">
              <Row>
                <Col sm={4}>
                  <ListGroup>
                    <ListGroup.Item action href="#link1">
                      Link 1
                    </ListGroup.Item>
                    <ListGroup.Item action href="#link2">
                      Link 2
                    </ListGroup.Item>
                  </ListGroup>
                </Col>
                <Col sm={8}>
                  <Tab.Content>
                    <Tab.Pane eventKey="#link1">
                    <p>Sonnet1</p>
                    </Tab.Pane>
                    <Tab.Pane eventKey="#link2">
                    <p>Sonnet2</p>
                    </Tab.Pane>
                  </Tab.Content>
                </Col>
              </Row>
            </Tab.Container>
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
