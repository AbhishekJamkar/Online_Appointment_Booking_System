import React, { useState } from 'react';
import '../styles/Register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    reEnterPassword: '',
    fullName: '',
    address: '',
    contact: '',
    isProvider: false,
  });

  const [loading, setLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState('');
  const [isProvider, setIsProvider] = useState(false);

  const { email, password, reEnterPassword, fullName, address, contact } = formData;

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    setFormData({ ...formData, [name]: newValue });
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Check if password and re-enter password match and password is strong
      if (password !== reEnterPassword || passwordStrength !== 'strong') {
        setRegistrationError('Please make sure the passwords match and meet the strength criteria.');
        return;
      }

      const response = await fetch('http://localhost:8080/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setRegistrationError('');
        setRegistrationSuccess(true);
        setFormData({
          email: '',
          password: '',
          reEnterPassword: '',
          fullName: '',
          address: '',
          contact: '',
          isProvider: false,
        });
      } else {
        setRegistrationError('Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Registration failed:', error);
      setRegistrationError('Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const checkPasswordStrength = (value) => {
    const hasUppercase = /[A-Z]/.test(value);
    const hasLowercase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(value);

    let strength = '';
    if (value.length < 8 || !hasUppercase || !hasLowercase || !hasNumber || !hasSpecialChar) {
      strength = 'weak';
    } else {
      strength = 'strong';
    }
    setPasswordStrength(strength);
  };

  const handleIsProviderChange = (e) => {
    const isChecked = e.target.checked;
    console.log('isChecked:', isChecked);
    setIsProvider(isChecked);
    setFormData({ ...formData, isProvider: isChecked });
  };
  

  return (
    <div className="register-container">
      <h2>Register</h2>
      {registrationSuccess && <p className="success-message" style={{ color: 'green' }}>Registration successful. You can now login.</p>}
      {registrationError && <p className="error-message" style={{ color: 'red' }}>{registrationError}</p>}
      <form onSubmit={onSubmit} className="register-form">
        <input type="email" name="email" value={email} onChange={onChange} placeholder="Email" required />
        <input type="password" name="password" value={password} onChange={onChange} placeholder="Password" required />
        {password && <p>Password strength: {passwordStrength}</p>}
        {password && passwordStrength === 'weak' && <p>Password must contain at least 8 characters, including uppercase letters, lowercase letters, numbers, and special characters.</p>}
        <input type="password" name="reEnterPassword" value={reEnterPassword} onChange={onChange} placeholder="Re-enter Password" required />
        <input type="text" name="fullName" value={fullName} onChange={onChange} placeholder="Full Name" required />
        <input type="text" name="address" value={address} onChange={onChange} placeholder="Address" required />
        <input type="text" name="contact" value={contact} onChange={onChange} placeholder="Contact" required />
        <label>
          <input type="checkbox" name="isProvider" checked={isProvider} onChange={handleIsProviderChange} />
          Register as a provider
        </label>
        <button type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
