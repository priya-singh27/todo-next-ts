"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from './login.module.css';
import Image from 'next/image';
import loginImage from './login.png'


const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://localhost:3001/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email, 
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      
      router.push('/todo');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container} id='body'>
      <div className={styles.loginCard}>
        <div className={styles.leftSection}>
          <h2 className={styles.title}>Sign In</h2>
          
          {error && <div className={styles.errorMessage}>{error}</div>}
          
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <i className="user-icon"></i>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter Email"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.inputGroup}>
              <div className={styles.inputIcon}>
                <i className="lock-icon"></i>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter Password"
                required
                className={styles.input}
              />
            </div>

            <div className={styles.optionsGroup}>
              <div className={styles.rememberMe}>
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.checkbox}
                />
                <label htmlFor="rememberMe" className={styles.rememberLabel}>
                  Remember Me
                </label>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className={styles.loginButton}
            >
              {loading ? 'Loading...' : 'Login'}
            </button>
          </form>

          <div className={styles.socialLogin}>
            <p className={styles.orLoginWith}>Or, login with</p>
            <div className={styles.socialIcons}>
              <button className={styles.socialIcon}>
                <i className="facebook-icon"></i>
              </button>
              <button className={styles.socialIcon}>
                <i className="google-icon"></i>
              </button>
              <button className={styles.socialIcon}>
                <i className="twitter-icon"></i>
              </button>
            </div>
          </div>

          <div className={styles.createAccount}>
            Don't have an account? <Link href="/signup">Create one</Link>
          </div>
        </div>

        <div className={styles.rightSection}>
          <Image 
            src={loginImage} 
            alt="Login Illustration" 
            width={300} 
            height={400}
            priority
          />
        </div>
      </div>
    </div>
  );
};

export default Login;