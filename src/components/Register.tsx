import { useState } from 'react';
import { registerNewCustomer } from '../api';
import { ApiResponse, RegisterDto } from '../types';
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

      if (response.data != null) {
        if (!response.data.includes('User with this username already exists')) {
          navigate('/login');
        }
        else {
          alert('Username already exists. Please choose a different username');
        }
      };
    } catch (error) {
      console.error('Unexpected error during registration:', error);
    }
  };

  const handleLoginNavigation = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-1/5 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Registration</h2>
        <div className="mb-2 w-full group">
          <label htmlFor="first_name" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600"> username </label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-10 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-2 w-full group">
          <label htmlFor="first_name" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600"> password </label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-10 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-2 w-full group">
          <label htmlFor="first_name" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600"> name </label>
          <input
            type="text"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-10 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleRegister}
          className="bg-gray-200 text-black px-4 py-2 rounded-md hover:bg-white focus:outline-none focus:ring focus:border-blue-300 mt-4"
        >
          Register
        </button>
        <button
          onClick={handleLoginNavigation}
          className="text-white mt-2 hover:underline focus:outline-none"
        >
          I have an account
        </button>
      </div>
    </div >
  );
};

export default Register;