import './index.css'
import React from 'react';
import DataService from '../../services/service';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Table, Card } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Activity() {

  const [users, setUsers] = useState('');
  const [members, setMembers] = useState('');
  const [teams, setTeams] = useState();  
  const [reviews, setReviews] = useState('');

  const [id, setId] = useState();
  const [ownerId, setOwnerId] = useState();
  const [username, setUsername] = useState('');
  const [activityName, setActivityName] = useState('');
  const [memberNum, setMemberNum] = useState('');
  const [teamNum, setTeamNum] = useState('');

  const [displayTeamMaker, setDisplayTeamMaker] = useState(false);
  const [reviewRequestsSent, setReviewRequestsSent] = useState(false);

  const [errMessage, setErrMessage] = useState('');
  const { activityid } = useParams();

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    getAllUsersNonAdminNonMember();
    getActivity();
    //get teams from local storage    
    //const savedTeamMaker = localStorage.getItem('displayTeamMaker');
    //const savedTeams = localStorage.getItem('teams');
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
      getMembers();
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

  const requestReviews = async () => {
    const jsonTeams = JSON.parse(teams);
    const id = {activityid};

    // check number of members
    for (let i=0; i<jsonTeams.length; i++) {
      if (jsonTeams[i].length === 1) {
        alert('All teams must have more than one member to request reviews');
        // exit function
        return;
      }
    }
    
    // iterate the lists
    for (let i=0; i<jsonTeams.length; i++) {
      
      // iterate the members of each list
      for (let j=0; j<jsonTeams[i].length; j++) {
        
        // keep the current member
        const currMember = jsonTeams[i][j];
        
        // iterate the rest of the members for the current list
        for (let k=0; k<jsonTeams[i].length; k++) {
          if (currMember.id !== jsonTeams[i][k].id) {
            //alert(currMember.username + ' will review ' + jsonTeams[i][k].username);
            DataService.newPendingReviewRequest(currMember.id, jsonTeams[i][k].id, id.activityid)
              .then(response => {
                if(JSON.stringify(response.data.success) === 'false') {
                  alert('Review request failed!');
                }
              }).catch(err => {
                setErrMessage('Server Error: ' + err.response.data);
                //alert(errMessage);
              })
          }  
        }
      }
    }
    alert('Review requests were sent successfully to all members');
    setReviewRequestsSent(true);
  }

  const refreshTeams = async () => {
    setReviewRequestsSent(false);
    checkForTeams();
  }

  // functions for the drag and drop lists
  // using react beautiful dnd
  // -------------------------------------

  const [state, setState] = useState();

  const getMembers = () => {
    const keys = ['id', 'username'];
    const objects = members.map(array => {
      const object = {};
      
      keys.forEach((key, i) => {
        //convert id to string
        if (typeof array[i] === 'number') {
          array[i] = String(array[i]);
        }
        object[key] = array[i];
      });

      return object;
    });
    setState([objects]);

    // store initial team
    setTeams(JSON.stringify([objects]));
    //localStorage.setItem('displayTeamMaker', true);
    //localStorage.setItem('teams', teams);
  }

  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  }

  const onDragEnd = result => {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }
    const sourceId = +source.droppableId;
    const destinationId = +destination.droppableId;

    if (sourceId === destinationId) {
      const items = reorder(state[sourceId], source.index, destination.index);
      const newState = [...state];
      newState[sourceId] = items;
      setState(newState);

      // store reordered teams
      setTeams(JSON.stringify(newState));
      //localStorage.setItem('displayTeamMaker', true);
      //localStorage.setItem('teams', teams);
    } else {
      const r = move(state[sourceId], state[destinationId], source, destination);
      const newState = [...state];
      newState[sourceId] = r[sourceId];
      newState[destinationId] = r[destinationId];

      setState(newState.filter(group => group.length));
      
      // store teams
      setTeams(JSON.stringify(newState.filter(group => group.length)));
      //localStorage.setItem('displayTeamMaker', true);
      //localStorage.setItem('teams', teams);
    }
  }

  const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
  
    destClone.splice(droppableDestination.index, 0, removed);
  
    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
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
            {/* Number of teams: {teamNum} */}
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
            <div className='createTeams'>
            <br/>
            <button
              type="button"
              onClick={() => {
                setState([...state, []]);
              }}
              style={{
                margin: "10px"
              }}
            >
              Add new team
            </button>
            <button 
              variant='info' 
              disabled={reviewRequestsSent ? true : false}
              onClick={requestReviews}
              style={{
                margin: "10px"
              }}
            >
              Request reviews
            </button>
            <button 
              variant='info' 
              onClick={refreshTeams}
              style={{
                margin: "10px"
              }}
            >
              Refresh
            </button>
            <br/>
            <br/>
            <div
              style={{
                display: "flex",
                "justify-content": "space-between",
                width: "75vw",
                margin: "auto",
                marginTop: 24
              }}
            >
            <DragDropContext onDragEnd={onDragEnd}>
                {state.map((el, ind) => (
                  <Droppable key={ind} droppableId={`${ind}`}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        style={{
                          background: snapshot.isDraggingOver
                            ? "lightblue"
                            : "#e5e5e5",
                          padding: 8,
                          width: 250
                        }}                        
                      >
                        {el.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  userSelect: "none",
                                  padding: 16,
                                  margin: "0 0 8px 0",
                                  background: snapshot.isDragging
                                    ? "lightgreen"
                                    : "grey",
      
                                  ...provided.draggableProps.style
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-around"
                                  }}
                                >
                                  {item.username}
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                ))}
              </DragDropContext>
            </div>
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
