"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './signup.module.css';
import Image from 'next/image';
import signupImage from './signup.png'

interface FormData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [agreeTerms, setAgreeTerms] = useState<boolean>(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAgreeTerms(e.target.checked);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!agreeTerms) {
      setError('You must agree to all terms');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: `${formData.firstName} ${formData.lastName}`,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      router.push('/login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    
    <div className={styles.container} id='body'>
      <div className={styles.signupCard}>
        <div className={styles.leftSection}>
          <Image 
            src={signupImage}
            alt="Sign Up Illustration" 
            width={300} 
            height={400}
            priority
          />
        </div>

        <div className={styles.rightSection}>
          <h2 className={styles.title}>Sign Up</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <em className="bolt-icon"></em>
              </div>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="Enter First Name"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <em className="bolt-icon"></em>
              </div>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Enter Last Name"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <em className="user-icon"></em>
              </div>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter Username"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <em className="email-icon"></em>
              </div>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <em className="lock-icon"></em>
              </div>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter Password"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <em className="lock-icon"></em>
              </div>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.termsGroup}>
              <input
                type="checkbox"
                id="agreeTerms"
                checked={agreeTerms}
                onChange={handleCheckboxChange}
                className={styles.checkbox}
              />
              <label htmlFor="agreeTerms" className={styles.termsLabel}>
                I agree to all terms
              </label>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={styles.signupButton}
            >
              {loading ? 'Loading...' : 'Sign Up'}
            </button>
          </form>

          <div className={styles.loginLink}>
            Already have an account? <Link href="/login">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
    
  );
};

export default SignUp;