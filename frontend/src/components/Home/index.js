import './index.css'
import React from 'react';
import { useState, useEffect } from 'react';


export default function Home() {

  return (
    <div className='Home'>
      <h3>Platform for managing collaboration preferences and ratings</h3>
      <p>RateMio is where teams come to level up their performance. </p> 
      <p>Helping teams group and organize for maximum productivity and wellbeing.</p>
      <br/>
      <h3>Usage Instructions</h3>

      <ul>
      <li>Register, if you don't have an account</li>
      <li>Login</li>
      <li>Create a request for activity leader privileges</li>
      <li>Create an activity</li>
      <li>Add people to your activity</li>
      <li>Split your activity members into groups</li>
      <li>Request a review from all your members</li>
      <li>Get new suggested groups</li>
      </ul>
      
    </div>
  );
}