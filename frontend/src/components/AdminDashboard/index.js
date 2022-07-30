import './index.css'
import DataService from '../../services/service';
import React from 'react';
import { useState, useEffect } from "react";

export default function AdminDashboard() {


  const [users, setUsers] = useState('');

  const [user, setUser] = useState({
    id: "",
    username: "",
    email: "",
    accessLevel: ""
  });

  const [errMessage, setErrMessage] = useState('');

  useEffect(() => {
    getAllUsers();
  }, []);

  const getAllUsers = async () => {
    
    DataService.getAllUsers()
      .then(response => {
        alert(JSON.stringify(response.data));
        setUsers(JSON.stringify(response.data));
        //window.location.href = '/dashboard';
      }).catch(err => {
        setErrMessage('Error: ' + err.response.data);
        alert(errMessage);
      })
  }

  return (
    <div className='AdminDashboard'>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.username}</li>
        ))}
      </ul>
    </div>
  );
}
 