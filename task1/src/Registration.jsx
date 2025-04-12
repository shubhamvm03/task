import React, { useState } from 'react';
import Login from './Login'; // import Login component

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    profilePhoto: null,
  });

  const [showLogin, setShowLogin] = useState(false); // toggler after registration

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'profilePhoto' ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('password', formData.password);
    data.append('email', formData.email);
    data.append('profilePhoto', formData.profilePhoto);

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        alert('✅ ' + result.message);
        setFormData({
          name: '',
          password: '',
          email: '',
          profilePhoto: null,
        });
        setShowLogin(true); // trigger login component
      } else {
        alert('❌ ' + result.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Something went wrong!');
    }
  };

  if (showLogin) {
    return (
      <div style={{ maxWidth: '400px', margin: 'auto' }}>
        <h2>Registration Successful!</h2>
        <button onClick={() => setShowLogin(false)}>⬅️ Go Back</button>
        <Login />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h2>Registration Form</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>Name:</label><br />
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>
        <div>
          <label>Password:</label><br />
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label>Email:</label><br />
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label>Profile Photo:</label><br />
          <input type="file" name="profilePhoto" accept="image/*" onChange={handleChange} required />
        </div>
        <br />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
