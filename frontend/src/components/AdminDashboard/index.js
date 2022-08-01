import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";
import { Dropdown, DropdownButton, Button, Table } from 'react-bootstrap';

export default function AdminDashboard() {

  const [users, setUsers] = useState('');

  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    
    DataService.getAllUsers()
      .then(response => {
        setUsers(response.data);
      }).catch(err => {
        setErrMessage('Error: ' + err.response);
        alert(errMessage);
      })
  }

  const deleteUser = async (id) => {
    DataService.deleteUser(id)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          alert('User successfuly deleted!');
          window.location.href = '/admindashboard';
        } else {
          alert('User delete failed!');
          window.location.href = '/home';
        }
      }).catch(err => {
        setErrMessage('Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  const updateAccess = async (id, level) => {
    DataService.updateUserAccess(id, level)
      .then(response => {
        if(JSON.stringify(response.data.success) === 'true') {
          if (level === 2) {
            alert('User has super access!');
          } else {
            alert('User has basic access!');
          }
          window.location.href = '/admindashboard';
        } else { 
          alert('User delete failed!');
          window.location.href = '/home';
        }
      }).catch(err => {
        setErrMessage('Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  return (
    <div className='AdminDashboard'>
      <Table striped>
      <tbody>
        <tr>
          <th>Id</th>
          <th>Username</th>
          <th>Email</th>
          <th>Access Level</th>
          <th></th>
          <th></th>
        </tr>
        {Object.values(users).map((item) => (
          <tr>
            <td>{item[0]}</td>
            <td>{item[1]}</td>
            <td>{item[2]}</td>
            <td>{item[3]}</td>
            <td>
              <Button variant="danger" onClick={() => deleteUser(parseFloat(item[0]))}>
                Delete User
              </Button>
            </td>
            <td>
            <DropdownButton variant='info' id="dropdown-basic-button" title="Update Access">
              <Dropdown.Item onClick={() => updateAccess(parseFloat(item[0]), 2)}>Super user</Dropdown.Item>
              <Dropdown.Item onClick={() => updateAccess(parseFloat(item[0]), 3)}>Basic user</Dropdown.Item>
            </DropdownButton>
            </td>
          </tr>
        ))}
      </tbody>
      </Table>
    </div>
  );
}
 