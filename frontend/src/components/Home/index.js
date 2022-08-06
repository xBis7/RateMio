import './index.css'
import React from 'react';
import { useState, useEffect } from 'react';


export default function Home() {

  return (
    <div className='Home'>
      <h3>Platform for managing collaboration preferences and ratings</h3>
      <p>RateMio is where teams come to maximize their performance. </p> 
      <p>Helping teams find the best combinations of teammates for maximum productivity and wellbeing.</p>
      <br/>
      <h3>Usage Instructions</h3>

      <ul>
      <li>Register, if you don't have an account</li>
      <li>Login</li>
      <li>Create a request for team leader privileges</li>
      <li>Create a team</li>
      <li>Invite people to your team</li>
      <li>(Optional) Split your team into groups</li>
      <li>Request a review from all your team members</li>
      <li>Create groups</li>
      </ul>
      
    </div>
  );
}