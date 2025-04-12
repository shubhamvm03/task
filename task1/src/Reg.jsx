import React, { useState } from 'react';

export default function Registration() {
  const [formData, setFormData] = useState({
    name: '',
    password: '',
    email: '',
    profilePhoto: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'profilePhoto' ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('password', formData.password);
    data.append('email', formData.email);
    data.append('profilePhoto', formData.profilePhoto);

    // Send this form data to your backend using fetch/axios
    console.log('Submitted:', formData);
  };

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
