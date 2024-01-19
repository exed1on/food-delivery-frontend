import React, { useState } from 'react';
import { generateToken, registerNewCustomer } from '../api';
import { ApiResponse, Credentials, RegisterDto } from '../types';
import { useToken } from './TokenContext';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async () => {
    try {
      const newUser: RegisterDto = {
        Name: name,
        UserName: username,
        Password: password,

      };
      console.log(newUser);
      const response: ApiResponse<string> = await registerNewCustomer(newUser);

      console.log('Register response:', response);

      if (response.data) {
        navigate('/login');
      };

    } catch (error) {
      console.error('Unexpected error during registration:', error);
    }
  };

  return (
    <div>
      <h2>Registeration</h2>
      <label>
        username:
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        password:
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <label>
        name:
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
};

export default Register;