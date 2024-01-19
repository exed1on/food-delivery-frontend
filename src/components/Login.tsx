import React, { useState } from 'react';
import { generateToken } from '../api';
import { ApiResponse, Credentials } from '../types';
import { useToken } from './TokenContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setToken } = useToken();
  const handleLogin = async () => {
    try {
      const user: Credentials = {
        username,
        password,
      };

      console.log('Attempting login with user:', user);

      const response: ApiResponse<string> = await generateToken(user, setToken);

      console.log('Login response:', response);

      if (response.data) {
        navigate('/food-catalog');
      } else if (response.error) {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;