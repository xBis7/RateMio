import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";
import { Button, Form, ToggleButton, ToggleButtonGroup, Table, Accordion, Modal, Dropdown } from 'react-bootstrap';

export default function Dashboard() {

  const [authUser, setAuthUser] = useState({});

  const [activities, setActivities] = useState('');
  const [pendingReviews, setPendingReviews] = useState('');

  const [username, setUsername] = useState('');

  const [activityOwner, setActivityOwner] = useState({});

  const [activityName, setActivityName] = useState('');
  const [currActivityName, setCurrActivityName] = useState('');
  const [currActivityId, setCurrActivityId] = useState();
  const [tmpNewActivityId, setTmpNewActivityId] = useState(0);
  const [members, setMembers] = useState('');

  const [id, setId] = useState();
  const [access, setAccess] = useState(3);
  const [errMessage, setErrMessage] = useState('');

  const [leaveReview, setLeaveReview] = useState(false);

  const [showNewActivityModal, setShowNewActivityModal] = useState(false);
  
  const [usersLoaded, setUsersLoaded] = useState(false);

  // review buttons values
  const [quality, setQuality] = useState(3);
  const [collaboration, setCollaboration] = useState(3);
  const [preference, setPreference] = useState('neutral');

  // review buttons are checked
  const [qualityChecked, setQualityChecked] = useState(false);
  const [collaborationChecked, setCollaborationChecked] = useState(false);
  const [preferenceChecked, setPreferenceChecked] = useState(false);

  const [reviewedId, setReviewedId] = useState();
  const [activityId, setActivityId] = useState();

  /**
   * activities
   * 0 -> activityid
   * 1 -> owner username
   * 2 -> activityname
   * 3 -> membernum
   * 4 -> teamnum
   */

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    if (user) {
      setAuthUser(JSON.stringify(user));
      setId(user.userId);
      setUsername(user.username);
      setAccess(user.accessLevel);
      getAllUserActivities(user.userId);
      getAllReviewerPendingReviews(user.userId);
    }
  }, []);

  // Every time we have a new activity, refresh the member number
  useEffect(() => {
    if (tmpNewActivityId !== 0) {
      refreshActivityMembers(tmpNewActivityId, members.length);
      window.location.reload();
    }
  }, [tmpNewActivityId]);

  useEffect(() => {
    loadActivityMembers();
  }, [currActivityName]);

  const getAllUserActivities = (currId) => {
    
    DataService.getAllUserActivities(currId)
      .then(response => {
        setActivities(response.data);
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const getAllReviewerPendingReviews = (reviewerId) => {

    DataService.getAllReviewerPendingReviews(reviewerId)
      .then(response => {
        setPendingReviews(response.data);
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
      // Create new activity
      if (activityName.length === 0) {
        alert('Please provide an activity name to proceed.');
      } else {
        DataService.newActivity(id, activityName)
        .then(response => {
          const newActivityId = response.data.activity.activityid;
          setTmpNewActivityId(newActivityId);
          addMembersToNewActivity(newActivityId);
          window.location.href = '/dashboard';
        }).catch(err => {
          setErrMessage('Server Error: ' + err.response.data);
          alert(errMessage);
        })
      }
  }

  // Executes every time we load users from an activity
  // before the new activity gets created 
  const loadActivityMembers = () => {
    if (currActivityName.length > 0) {
      DataService.getAllActivityUsers(id, currActivityId)
        .then(response => {
          setMembers(response.data);
        }).catch(err => {
          setErrMessage('Server Error: ' + err.response);
          alert(errMessage);
        })
    }
  }

  const addMembersToNewActivity = (newActivityId) => {
    for (var i=0; i< members.length; i++) {
      const memberId = members[i][0];
      DataService.addActivityMember(memberId, newActivityId)
        .then(response => {
          if(JSON.stringify(response.data.success) === 'true') {
            window.location.reload();
          } else {
            alert('User addition failed!');
          } 
        }).catch(err => {
          setErrMessage('Server Error: ' + err.response.data);
          alert(errMessage);
        });
    }
  }

  const refreshActivityMembers = (activityId, memberNum) => {
    DataService.refreshActivityMemberNum(activityId, memberNum)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          window.location.reload();
        } else {
          alert('User addition to activity members failed!');
        }
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      });
  }

  const refreshActivityMembersFromDB = (activityId) => {
    DataService.refreshActivityMemberNumFromDB(activityId)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          window.location.reload();
        } else {
          alert('Refreshing member number from DB failed!');
        }
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      });
  }

  const showReviewSection = (reviewedUserId, activId) => {
    setReviewedId(reviewedUserId);
    setActivityId(activId);
    setLeaveReview(true);
  }

  const newReview = () => {

    DataService.newReview(id, reviewedId, activityId, 
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

  const showModal = () => {
    setShowNewActivityModal(true);
  }

  const closeModal = () => {
    setShowNewActivityModal(false);
    setUsersLoaded(false);
  }

  const loadUsers = (activityid) => {
    setUsersLoaded(true); 
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
          <Form className='newActivityForm'>
            <h3>Create a new Activity</h3>
            <br/>
            <Form.Group className="mb-3">
              <p>
                You can create an empty activity with no users 
                or add users from an existing activity.
              </p>
            </Form.Group>
            <Button 
              variant="primary" 
              onClick={showModal}
            >
              New Activity
            </Button>
          </Form>
          </div>  
        }

        <Modal
          show={showNewActivityModal}
          onHide={closeModal}
          backdrop="static"
          keyboard={false}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>New Activity</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Activity Name</Form.Label>
                <Form.Control
                  autoComplete="off"
                  value={activityName}
                  onChange={(e) => setActivityName(e.target.value)}
                  autoFocus  
                  type="text" 
                  placeholder="Enter activity name" 
                />
                <br/>
                <Form.Label>Load Users From Activity</Form.Label>
                <br/>
                
                {activities.length > 0 &&
                  <Table striped>
                  <tbody align='center'>
                    <tr>
                      <th>Activity Name</th>
                      <th>Load Users</th>
                    </tr>
                    {Object.values(activities).map((item) => (
                      <tr>
                        <td>{item[2]}</td>
                        <td>
                          <Button 
                            variant="secondary"
                            disabled={usersLoaded ? true : false}
                            onClick={() => {
                              setCurrActivityId(item[0]);
                              setCurrActivityName(item[2]);
                              loadUsers();
                            }}
                          >
                            Load
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  </Table>
                }

                {activities.length === 0 && 
                  <p>
                    This user has no activities yet.
                  </p>
                }

                {usersLoaded === false && 
                  <Form.Text muted>
                  If no activity is selected, 
                  then an empty activity with no users will be created.
                  </Form.Text>
                }

                {usersLoaded === true &&
                  <p>Users loaded from activity {currActivityName}</p>
                }
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="success"
              onClick={() => {
                newActivity();
              }}
            >
              Create
            </Button>
            <Button 
              variant="secondary" 
              onClick={closeModal}
            >
              Cancel              
            </Button>
          </Modal.Footer>
        </Modal>
      
        <br/>
        <br/>
        {access === 2 && 
        <div>
        <h3>Activities owned by {username}</h3>
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
                        {/* <th>Number of teams</th> */}
                        <th>Refresh numbers</th>
                      </tr>
                        <tr>
                          <td>{item[3]-1}</td>
                          {/* <td>{item[4]}</td> */}
                          <td>
                            <Button 
                              variant='secondary' 
                              onClick={() => refreshActivityMembersFromDB(item[0])}
                            >
                              Refresh
                            </Button>
                          </td>
                        </tr>
                    </tbody>
                  </Table>
                  <Button className='openActButton' variant="primary" href={`activity/${item[0]}`}>Open Activity</Button>
                  <Button className='deleteActButton' variant="danger" onClick={() => deleteActivity(parseFloat(item[0]))}>Delete Activity</Button>
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        ))}
        </div>
        }

        <br/>
        <br/>
        
        <div className='pendingReviews'>
          <br/>
          <h3>Pending Reviews</h3>
          <br/>
          
          {pendingReviews.length > 0 &&
          <div>
          {Object.values(pendingReviews).map((item) => (
            <Table striped>
              <tbody>
                <tr>
                  <th>Leave review to</th>
                  <th>Activity name</th>
                  <th></th>
                </tr>
                <tr>
                  <td>{item[2]}</td>
                  <td>{item[3]}</td>
                  <td>
                    <Button variant='info' onClick={() => showReviewSection(parseFloat(item[1]), 
                                                                            parseFloat(item[4]))}>
                        Review
                    </Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          ))}
          </div>
          }

          {pendingReviews.length === 0 && 
          <div>
            <p>There are no pending review requests</p>
          </div>
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

        </div>
        
      </section>
    </div>
  );
}