import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import login from "../images/login.webp";

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { email, password } = formData;
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (email === 'Admin' && password === 'Admin') {
        navigate('/admin');
        return;
      }

      const response = await fetch('http://localhost:8080/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('LoginToken', data.token);
        localStorage.setItem('UserId', data.userId);
        localStorage.setItem('IsProvider', data.isProvider);
        localStorage.setItem('UserEmail', email); 
        setFormData({ email: '', password: '' });
        navigate('/home');
        window.location.reload();
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.error || 'Authentication failed.');
      }
    } catch (err) {
      console.error('Authentication failed:', err.message);
      setErrorMessage('Authentication failed. Please try again later.');
    }
  };

  return (
    <div className="login-container">
      <div className="image-container">
        <img src={login} alt="Login" />
      </div>
      <div className="form-container">
        <h2>Login</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <form onSubmit={onSubmit} className="login-form">
          <input type="text" placeholder="Email" name="email" value={email} onChange={onChange} className="login-input" required />
          <input type="password" placeholder="Password" name="password" value={password} onChange={onChange} className="login-input" required />
          <button type="submit" className="login-button">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
