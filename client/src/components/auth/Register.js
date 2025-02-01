import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
      email: '',
      password: '',
      confirmPassword: ''
    });
    const [error, setError] = useState('');
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }
  
      try {
        const response = await fetch('http://localhost:5000/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          })
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.msg || 'Registration failed');
        }
  
        navigate('/login');
      } catch (err) {
        setError(err.message);
      }
    };
  
    return (
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <input
              type="email"
              className="auth-input"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
            <input
              type="password"
              className="auth-input"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
            <input
              type="password"
              className="auth-input"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required
            />
            <button type="submit" className="auth-button">
              Sign Up
            </button>
          </form>
          <Link to="/login" className="auth-link">
            Already have an account? Log in
          </Link>
        </div>
      </div>
    );
  };

  export default Register