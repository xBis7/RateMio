import './index.css'
import React from 'react';
import { useState, useEffect } from 'react';


export default function Home() {

  const [authUser, setAuthUser] = useState();

  useEffect(() => {
    const authUser = localStorage.getItem('authUser');
    if (authUser) {
      const foundUser = authUser;
      setAuthUser(foundUser);
    }
  }, []);

  return (
    <div className='Home'>
      <p>Welcome to Home</p>
    </div>
  );
}