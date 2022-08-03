import './index.css'
import React from 'react';
import { useState, useEffect } from "react";

export default function UnAuthAdmin() {

  const [username, setUsername] = useState('');

  const [access, setAccess] = useState(3);

  useEffect(() => {
    const loggedUser = localStorage.getItem('authUser');
    const user = JSON.parse(loggedUser);
    if (user) {
      setUsername(user.username);
      setAccess(user.accessLevel);
    }
  }, []);


  return (
    <div className='Login'>
      <section>
        <h1>Unauthorized access</h1>
        <br/>
        <p>You don't have admin access, please logout and login with an admin account to access this page.</p>
        <br/>
        <br/>
        <h3>Info: </h3>
        {access === 2 && <p>User {username} has super user access</p>}
        {access === 3 && <p>User {username} has basic access</p>}
      </section>
    </div>
  );
}