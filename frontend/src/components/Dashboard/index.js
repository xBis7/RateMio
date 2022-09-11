import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";
import { Button, Form, ToggleButton, ToggleButtonGroup, Table, Accordion } from 'react-bootstrap';

export default function Dashboard() {

  const [authUser, setAuthUser] = useState({});

  const [activities, setActivities] = useState('');
  const [pendingReviews, setPendingReviews] = useState('');

  const [username, setUsername] = useState('');

  const [activityOwner, setActivityOwner] = useState({});

  const [activityName, setActivityName] = useState('');

  const [id, setId] = useState();
  const [access, setAccess] = useState(3);
  const [errMessage, setErrMessage] = useState('');

  const [leaveReview, setLeaveReview] = useState(false);
  
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

    DataService.newActivity(id, activityName)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          window.location.href = '/dashboard';
        } else {
          alert('Activity creation failed!');
        } 
      }).catch(err => {
        setErrMessage('Server Error: ' + err.response.data);
        alert(errMessage);
      })
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
                      </tr>
                        <tr>
                          <td>{item[3]-1}</td>
                          {/* <td>{item[4]}</td> */}
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