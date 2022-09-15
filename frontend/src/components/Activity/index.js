import './index.css'
import React from 'react';
import DataService from '../../services/service';
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Button, Table, Card, Tooltip, OverlayTrigger, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function Activity() {

  const [users, setUsers] = useState('');
  const [members, setMembers] = useState('');
  const [teams, setTeams] = useState();  
  const [newTeams, setNewTeams] = useState('');
  const [reviews, setReviews] = useState('');
  const [pendingReviews, setPendingReviews] = useState('');

  const [ownerId, setOwnerId] = useState();
  const [username, setUsername] = useState('');
  const [activityName, setActivityName] = useState('');
  const [memberNum, setMemberNum] = useState('');

  const [displayTeamMaker, setDisplayTeamMaker] = useState(false);
  const [reviewRequestsSent, setReviewRequestsSent] = useState(false);
  
  const [leaveReview, setLeaveReview] = useState(false);
  const [currReviewerId, setCurrReviewerId] = useState();
  const [currReviewedId, setCurrReviewedId] = useState();
  
  // review buttons values
  const [quality, setQuality] = useState(3);
  const [collaboration, setCollaboration] = useState(3);
  const [preference, setPreference] = useState('neutral');

  // review buttons are checked
  const [qualityChecked, setQualityChecked] = useState(false);
  const [collaborationChecked, setCollaborationChecked] = useState(false);
  const [preferenceChecked, setPreferenceChecked] = useState(false);

  const [errMessage, setErrMessage] = useState('');
  const { activityid } = useParams();

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    getAllUsersNonAdminNonMember();
    getActivity();
    getActivityReviews();
    getActivityPendingReviews();
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
        setOwnerId(response.data[0][1]);
        setUsername(response.data[0][2]);
        setActivityName(response.data[0][3]);
        setMemberNum(response.data[0][4]);

        const actId = response.data[0][0];
        const userId = response.data[0][1];

        getAllActivityUsers(userId, actId);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const getActivityPendingReviews = async () => {

    const id = {activityid};

    DataService.getActivityPendingReviews(id.activityid)
      .then(response => {
        setPendingReviews(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response);
        alert(errMessage);
      })
  }

  const getActivityReviews = async () => {

    const id = {activityid};
    
    DataService.getActivityReviews(id.activityid)
      .then(response => {
        setReviews(response.data);
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

  const getTeamSuggestions = async () => {

    // 0 reviewid 
    // 1 reviewer userid
    // 2 reviewer username
    // 3 reviewed userid
    // 4 reviewed username
    // 5 activityName
    // 6 quality
    // 7 collaboration
    // 8 preference

    var object = {};
    object["userGlobalScores"] = [];
    object["userPairwiseScore"] = [];
    object["userCollaborationIntentions"] = [];

    for (var i=0; i<reviews.length; i++) {

      var qualityVal = (reviews[i][7] + reviews[i][8])/2;
      var collaborationVal = (reviews[i][6] + reviews[i][9] + reviews[i][10])/3;

      var avgScore = (qualityVal + collaborationVal)/2;
      var intentionVal;

      //totalQuality - totalCollab based on userid
      var totalQuality = 4;
      var totalCollab = 3;

      if (avgScore < 2.5) {
        intentionVal = "dwant";
      } else if (avgScore > 3) {
        intentionVal = "want";
      } else {
        intentionVal = "idc";
      }
        
      object["userGlobalScores"].push(
        {
          "userId": reviews[i][2],
          "score": {
            "quality": totalQuality,
            "collaboration": totalCollab 
          }
        });

      object["userPairwiseScore"].push(
        {
          "gradingUser": reviews[i][2],
          "scoresGiven": [
            {
              "userId": reviews[i][4],
              "score": {
                "quality": qualityVal,
                "collaboration": collaborationVal
              }
            }
          ]  
        });
   
      object["userCollaborationIntentions"].push(
        {
          "gradingUser": reviews[i][2],
          "intentions": [
            {
              "userId": reviews[i][4],
              "intention": intentionVal
            }
          ]
        });
    } 

    var jsonReviews = JSON.stringify(object);
    //alert(jsonReviews);

    const id = {activityid};

    DataService.getTeamSuggestions(id.activityid)
    .then(response => {
      //alert(JSON.stringify(response.data));
      setNewTeams(response.data);
    }).catch(err => {
      setErrMessage('Server Error: ' + err.response.data);
      alert(errMessage);
    })

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

  const showReviewSection = (reviewerId, reviewedId) => {
    setCurrReviewerId(reviewerId);
    setCurrReviewedId(reviewedId);
    setLeaveReview(true);
  }

  const newReview = () => {

    const id = {activityid};

    DataService.newReview(currReviewerId, currReviewedId, id.activityid, 
                          quality, collaboration, preference)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('Review was submitted successfully!');
          window.location.reload();
        } else {
          alert('Review submission failed!');
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
      if (jsonTeams[i].length !== 2) {
        alert('All teams must have two members to request reviews');
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
    window.location.reload();
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
              {pendingReviews.length === 0 && 
                <Button variant='info' onClick={checkForTeams}
                style={{
                  margin: "10px"
                }}>
                  Create teams
                </Button>
              }

              {pendingReviews.length > 0 && 
                <Button variant='info' onClick={checkForTeams}
                style={{
                  margin: "10px"
                }}>
                  Create new teams
                </Button>
              }

              {(pendingReviews.length === 0 && reviews.length > 0) &&
                <OverlayTrigger
                  key={'right'}
                  placement={'right'}
                  overlay={
                    <Tooltip id={`tooltip-${'right'}`}>
                      Previous round of reviews finished
                    </Tooltip>
                  }
                >
                  <Button variant='info' onClick={getTeamSuggestions}
                    style={{
                      margin: "10px"
                    }}>
                    Get team suggestions
                  </Button>
                </OverlayTrigger>
              }
            </div>
          } 
          {(displayTeamMaker === true)&& 
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

        {(reviewRequestsSent === true || pendingReviews.length > 0)&&
          <div className="pendingReviews">
            <br/>
            <h3>Pending reviews</h3>
            <br/>
            <Table striped>
              <tbody>
                <tr>
                  <th>Reviewer</th>
                  <th>Leave review to</th>
                  <th>Submit a review</th>
                </tr>
                {Object.values(pendingReviews).map((item) => (
                  <tr>
                    <td>{item[2]}</td>
                    <td>{item[4]}</td>
                    <td>
                      <Button variant='info' onClick={() => showReviewSection(item[1], item[3])}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        }

        {newTeams.length > 0 && 
          <div className="newTeams">
            <br/>
            <h3>New team suggestions</h3>
            <br/>
            <Table striped>
              <tbody>
                <tr>
                  <th>Team number</th>
                  <th>Member1</th>
                  <th>Member2</th>
                </tr>
                {Object.values(newTeams).map((item, index) => (
                  <tr>
                    <td>{index+1}</td>
                    <td>{item.username1}</td>
                    <td>{item.username2}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        }


        {(reviewRequestsSent === true || reviews.length > 0)&&
          <div className="submittedReviews">
            <br/>
            <h3>Submitted reviews</h3>
            <br/>
            <Table striped>
              <tbody>
                <tr>
                  <th>Reviewer</th>
                  <th>Left review to</th>
                  <th>Quality</th>
                  <th>Collaboration</th>
                  <th>Preference</th>
                </tr>
                {Object.values(reviews).map((item) => (
                  <tr>
                    <td>{item[2]}</td>
                    <td>{item[4]}</td>
                    <td>{item[6]}</td>
                    <td>{item[7]}</td>
                    <td>{item[8]}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
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

      {leaveReview === true && 
        <div className="review">
          <p>
            Please rate the following statements on a scale of 1 to 5
            <br/> 
            and declare your future preference.
          </p>
          <br/>
          <p>Quality of the partnership.</p>

          <ToggleButtonGroup className="quality" type="radio" name="group1">
            <ToggleButton 
              id="quality1"
              variant="outline-secondary"
              checked={qualityChecked}
              value={1}
              onChange={(e) => {
                setQualityChecked(e.currentTarget.checked); 
                setQuality(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              1
            </ToggleButton>
              
            <ToggleButton 
              id="quality2"
              variant="outline-secondary"
              checked={qualityChecked}
              value={2}
              onChange={(e) => {
                setQualityChecked(e.currentTarget.checked); 
                setQuality(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              2
            </ToggleButton>
              
            <ToggleButton 
              id="quality3"
              variant="outline-secondary"
              checked={qualityChecked}
              value={3}
              onChange={(e) => {
                setQualityChecked(e.currentTarget.checked); 
                setQuality(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              3
            </ToggleButton>
              
            <ToggleButton 
              id="quality4"
              variant="outline-secondary"
              checked={qualityChecked}
              value={4}
              onChange={(e) => {
                setQualityChecked(e.currentTarget.checked); 
                setQuality(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              4
            </ToggleButton>
              
            <ToggleButton
              id="quality5"
              variant="outline-secondary"
              checked={qualityChecked}
              value={5}
              onChange={(e) => {
                setQualityChecked(e.currentTarget.checked); 
                setQuality(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              5
            </ToggleButton>
          </ToggleButtonGroup>
          <br/>
          <br/>
          <p>Collaboration of your teammate.</p>
           
          <ToggleButtonGroup className="collaboration" type="radio" name="group2">
            <ToggleButton 
              id="collaboration1"
              variant="outline-secondary"
              checked={collaborationChecked}
              value={1}
              onChange={(e) => {
                setCollaborationChecked(e.currentTarget.checked); 
                setCollaboration(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              1
            </ToggleButton>
            
            <ToggleButton 
              id="collaboration2"
              variant="outline-secondary"
              checked={collaborationChecked}
              value={2}
              onChange={(e) => {
                setCollaborationChecked(e.currentTarget.checked); 
                setCollaboration(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              2
            </ToggleButton>
              
            <ToggleButton 
              id="collaboration3"
              variant="outline-secondary"
              checked={collaborationChecked}
              value={3}
              onChange={(e) => {
                setCollaborationChecked(e.currentTarget.checked); 
                setCollaboration(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              3
            </ToggleButton>
              
            <ToggleButton 
              id="collaboration4"
              variant="outline-secondary"
              checked={collaborationChecked}
              value={4}
              onChange={(e) => {
                setCollaborationChecked(e.currentTarget.checked); 
                setCollaboration(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              4
            </ToggleButton>
              
            <ToggleButton
              id="collaboration5"
              variant="outline-secondary"
              checked={collaborationChecked}
              value={5}
              onChange={(e) => {
                setCollaborationChecked(e.currentTarget.checked); 
                setCollaboration(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              5
            </ToggleButton>
          </ToggleButtonGroup>
            
          <br/>
          <br/>
          <p>Preference regarding future collaboration.</p>
           
          <ToggleButtonGroup className="preference" type="radio" name="group3">
            <ToggleButton 
              id="preferenceY"
              variant="outline-secondary"
              checked={preferenceChecked}
              value={'yes'}
              onChange={(e) => {
                setPreferenceChecked(e.currentTarget.checked); 
                setPreference(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              yes
            </ToggleButton>
              
            <ToggleButton 
              id="preferenceN"
              variant="outline-secondary"
              checked={preferenceChecked}
              value={'no'}
              onChange={(e) => {
                setPreferenceChecked(e.currentTarget.checked); 
                setPreference(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              no
            </ToggleButton>
              
            <ToggleButton 
              id="preferenceNeut"
              variant="outline-secondary"
              checked={preferenceChecked}
              value={'neutral'}
              onChange={(e) => {
                setPreferenceChecked(e.currentTarget.checked); 
                setPreference(e.currentTarget.value);
              }}
              style={{
                margin: "5px"
              }}
              >
              neutral
            </ToggleButton>
          </ToggleButtonGroup>
            
          <br/>
          <br/>
          <Button variant="primary" onClick={newReview}>Submit Review</Button>

        </div>
        }
      </section>
    </div>
  );
}
