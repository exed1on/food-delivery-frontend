import { useState, useEffect } from 'react';
import { generateToken } from '../api';
import { ApiResponse, Credentials } from '../types';
import { useToken } from './TokenContext';
import { useNavigate } from 'react-router-dom';
import Modal, { Styles } from 'react-modal';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const { setToken } = useToken();

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');

  const customModalStyles: Styles = {
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      zIndex: 1000,
    },
    content: {
      width: '500px',
      height: '115px',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px',
      border: 'none',
      borderRadius: '10px',
      boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.3)',
    },
  } as Styles;

  useEffect(() => {
    setToken(null, null);
  }, [setToken]);

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
        setModalContent('Wrong credentials');
        setModalIsOpen(true);
        console.error(response.error);
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
    }
  };

  const handleRegisterNavigation = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <div className="w-1/5 flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Login</h2>
        <div className="mb-2 w-full group">
          <label htmlFor="first_name" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600"> username </label>
          <input
            type="text"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div className="mb-2 w-full group">
          <label htmlFor="first_name" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600"> password </label>
          <input
            type="password"
            placeholder="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <button
          onClick={handleLogin}
          className="mt-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-white"
        >
          Login
        </button>
        <button
          onClick={handleRegisterNavigation}
          className="text-white mt-2 hover:underline focus:outline-none"
        >
          Create Account
        </button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        contentLabel="Custom Modal"
        style={customModalStyles}
      >
        <div>
          <p className="text-center flex text-[24px] mb-4">{modalContent}</p>
          <button onClick={() => setModalIsOpen(false)}></button>
        </div>
      </Modal>
    </div>
  );
};

export default Login;