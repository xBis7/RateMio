import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";
import { Button, Form, ButtonGroup, ToggleButton, ToggleButtonGroup, Table, Accordion } from 'react-bootstrap';

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
  const [communication, setCommunication] = useState(3);
  const [productivity, setProductivity] = useState(3);
  const [efficiency, setEfficiency] = useState(3);
  const [openness, setOpenness] = useState(3);
  const [balance, setBalance] = useState(3);

  // review buttons are checked
  const [communicationChecked, setCommunicationChecked] = useState(false);
  const [productivityChecked, setProductivityChecked] = useState(false);
  const [efficiencyChecked, setEfficiencyChecked] = useState(false);
  const [opennessChecked, setOpennessChecked] = useState(false);
  const [balanceChecked, setBalanceChecked] = useState(false);

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
                          communication, productivity, efficiency,
                          openness, balance)
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

        {access === 3 &&
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
              Please rate the following statements on a scale of 1 to 5.
              <br/>
              1 - Strongly Disagree
              <br/>
              2 - Somewhat Disagree
              <br/>
              3 - Neither Agree Nor Disagree
              <br/>
              4 - Somewhat Agree
              <br/>
              5 - Strongly Agree
            </p>
            <br/>
            <p>There was great communication during our collaboration.</p>

            <ToggleButtonGroup className="communication" type="radio" name="group1">
              <ToggleButton 
                id="communication1"
                variant="outline-secondary"
                checked={communicationChecked}
                value={1}
                onChange={(e) => {
                  setCommunicationChecked(e.currentTarget.checked); 
                  setCommunication(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                1
              </ToggleButton>
              
              <ToggleButton 
                id="communication2"
                variant="outline-secondary"
                checked={communicationChecked}
                value={2}
                onChange={(e) => {
                  setCommunicationChecked(e.currentTarget.checked); 
                  setCommunication(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                2
              </ToggleButton>
              
              <ToggleButton 
                id="communication3"
                variant="outline-secondary"
                checked={communicationChecked}
                value={3}
                onChange={(e) => {
                  setCommunicationChecked(e.currentTarget.checked); 
                  setCommunication(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                3
              </ToggleButton>
              
              <ToggleButton 
                id="communication4"
                variant="outline-secondary"
                checked={communicationChecked}
                value={4}
                onChange={(e) => {
                  setCommunicationChecked(e.currentTarget.checked); 
                  setCommunication(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                4
              </ToggleButton>
              
              <ToggleButton
                id="communication5"
                variant="outline-secondary"
                checked={communicationChecked}
                value={5}
                onChange={(e) => {
                  setCommunicationChecked(e.currentTarget.checked); 
                  setCommunication(e.currentTarget.value);
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
            <p>Our collaboration was very productive.</p>
            
            <ToggleButtonGroup className="productivity" type="radio" name="group2">
              <ToggleButton 
                id="productivity1"
                variant="outline-secondary"
                checked={productivityChecked}
                value={1}
                onChange={(e) => {
                  setProductivityChecked(e.currentTarget.checked); 
                  setProductivity(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                1
              </ToggleButton>
              
              <ToggleButton 
                id="productivity2"
                variant="outline-secondary"
                checked={productivityChecked}
                value={2}
                onChange={(e) => {
                  setProductivityChecked(e.currentTarget.checked); 
                  setProductivity(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                2
              </ToggleButton>
              
              <ToggleButton 
                id="productivity3"
                variant="outline-secondary"
                checked={productivityChecked}
                value={3}
                onChange={(e) => {
                  setProductivityChecked(e.currentTarget.checked); 
                  setProductivity(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                3
              </ToggleButton>
              
              <ToggleButton 
                id="productivity4"
                variant="outline-secondary"
                checked={productivityChecked}
                value={4}
                onChange={(e) => {
                  setProductivityChecked(e.currentTarget.checked); 
                  setProductivity(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                4
              </ToggleButton>
              
              <ToggleButton
                id="productivity5"
                variant="outline-secondary"
                checked={productivityChecked}
                value={5}
                onChange={(e) => {
                  setProductivityChecked(e.currentTarget.checked); 
                  setProductivity(e.currentTarget.value);
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
            <p>There was efficiency in achieving the desired outcome.</p>
            
            <ToggleButtonGroup className="efficiency" type="radio" name="group3">
              <ToggleButton 
                id="efficiency1"
                variant="outline-secondary"
                checked={efficiencyChecked}
                value={1}
                onChange={(e) => {
                  setEfficiencyChecked(e.currentTarget.checked); 
                  setEfficiency(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                1
              </ToggleButton>
              
              <ToggleButton 
                id="efficiency2"
                variant="outline-secondary"
                checked={efficiencyChecked}
                value={2}
                onChange={(e) => {
                  setEfficiencyChecked(e.currentTarget.checked); 
                  setEfficiency(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                2
              </ToggleButton>
              
              <ToggleButton 
                id="efficiency3"
                variant="outline-secondary"
                checked={efficiencyChecked}
                value={3}
                onChange={(e) => {
                  setEfficiencyChecked(e.currentTarget.checked); 
                  setEfficiency(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                3
              </ToggleButton>
              
              <ToggleButton 
                id="efficiency4"
                variant="outline-secondary"
                checked={efficiencyChecked}
                value={4}
                onChange={(e) => {
                  setEfficiencyChecked(e.currentTarget.checked); 
                  setEfficiency(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                4
              </ToggleButton>
              
              <ToggleButton
                id="efficiency5"
                variant="outline-secondary"
                checked={efficiencyChecked}
                value={5}
                onChange={(e) => {
                  setEfficiencyChecked(e.currentTarget.checked); 
                  setEfficiency(e.currentTarget.value);
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
            <p>There was an openness to new ideas or concerns.</p>
            
            <ToggleButtonGroup className="openness" type="radio" name="group4">
              <ToggleButton 
                id="openness1"
                variant="outline-secondary"
                checked={opennessChecked}
                value={1}
                onChange={(e) => {
                  setOpennessChecked(e.currentTarget.checked); 
                  setOpenness(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                1
              </ToggleButton>
              
              <ToggleButton 
                id="openness2"
                variant="outline-secondary"
                checked={opennessChecked}
                value={2}
                onChange={(e) => {
                  setOpennessChecked(e.currentTarget.checked); 
                  setOpenness(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                2
              </ToggleButton>
              
              <ToggleButton 
                id="openness3"
                variant="outline-secondary"
                checked={opennessChecked}
                value={3}
                onChange={(e) => {
                  setOpennessChecked(e.currentTarget.checked); 
                  setOpenness(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                3
              </ToggleButton>
              
              <ToggleButton 
                id="openness4"
                variant="outline-secondary"
                checked={opennessChecked}
                value={4}
                onChange={(e) => {
                  setOpennessChecked(e.currentTarget.checked); 
                  setOpenness(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                4
              </ToggleButton>
              
              <ToggleButton
                id="openness5"
                variant="outline-secondary"
                checked={opennessChecked}
                value={5}
                onChange={(e) => {
                  setOpennessChecked(e.currentTarget.checked); 
                  setOpenness(e.currentTarget.value);
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
            <p>There was balance between our levels of expertise.</p>
          
            <ToggleButtonGroup className="balance" type="radio" name="group5">
              <ToggleButton 
                id="balance1"
                variant="outline-secondary"
                checked={balanceChecked}
                value={1}
                onChange={(e) => {
                  setBalanceChecked(e.currentTarget.checked); 
                  setBalance(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                1
              </ToggleButton>
              
              <ToggleButton 
                id="balance2"
                variant="outline-secondary"
                checked={balanceChecked}
                value={2}
                onChange={(e) => {
                  setBalanceChecked(e.currentTarget.checked); 
                  setBalance(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                2
              </ToggleButton>
              
              <ToggleButton 
                id="balance3"
                variant="outline-secondary"
                checked={balanceChecked}
                value={3}
                onChange={(e) => {
                  setBalanceChecked(e.currentTarget.checked); 
                  setBalance(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                3
              </ToggleButton>
              
              <ToggleButton 
                id="balance4"
                variant="outline-secondary"
                checked={balanceChecked}
                value={4}
                onChange={(e) => {
                  setBalanceChecked(e.currentTarget.checked); 
                  setBalance(e.currentTarget.value);
                }}
                style={{
                  margin: "5px"
                }}
                >
                4
              </ToggleButton>
              
              <ToggleButton
                id="balance5"
                variant="outline-secondary"
                checked={balanceChecked}
                value={5}
                onChange={(e) => {
                  setBalanceChecked(e.currentTarget.checked); 
                  setBalance(e.currentTarget.value);
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
            <Button variant="primary" onClick={newReview}>Submit Review</Button>

          </div>
          }

        </div>
        }
        
      </section>
    </div>
  );
}