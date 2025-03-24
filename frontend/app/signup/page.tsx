"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const Signup = () => {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch('http://localhost:3001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Network error. Please try again.');
    }
  };
  
  return (
    <div className='main'>
      <h1 className='heading'>Sign up</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {success && <p style={{ color: 'green' }}>{success}</p>}
      
      <form onSubmit={handleSubmit} className='form'>
        <div>
          <label htmlFor="email">Enter Email:</label>
          <input type="email" name="email" required />
        </div>
        <div>
          <label htmlFor="password">Enter Password:</label>
          <input type="password" name="password" required />
        </div>
        <div>
          <label htmlFor="fullName">Enter Fullname:</label>
          <input type="text" name="fullName" required />
        </div>
        <div>
          <input type="submit" value="Signup" />
        </div>
      </form>
    </div>
  );
};

export default Signup;