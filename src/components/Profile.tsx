import React, { useState, useEffect } from 'react';
import { useToken } from './TokenContext';
import { updateExistingCustomer, deleteCustomer, depositMoney, checkAdminRightsForFood } from '../api';
import { RegisterDto, Credentials } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import Modal, { Styles } from 'react-modal';

const Profile = () => {
  const { token, username } = useToken();
  const navigate = useNavigate();
  const [newCustomerData, setNewCustomerData] = useState<RegisterDto>({
    Name: '',
    UserName: '',
    Password: '',
  });
  const [depositAmount, setDepositAmount] = useState<number>(0);
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
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
    checkRights();
  }, [token]);

  const checkRights = async () => {
    try {
      await checkAdminRightsForFood(token);
      setIsAdmin(true);
      console.log("user is admin");
    } catch (error) {
      setIsAdmin(false);
      console.log("user is NOT admin");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomerData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (username != null) {
        newCustomerData.UserName = username;
        newCustomerData.Password = newPassword;
        console.log(newCustomerData);
        const response = await updateExistingCustomer(newCustomerData, token);
        if (response.error) {
          console.error(response.error);
        } else {
          setModalContent('Profile was updated successfully');
          setModalIsOpen(true);
          console.log('Profile updated successfully');
        }
      }
    }
    catch (error) {
      console.error('Unexpected error during profile update:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const credentials: Credentials = { username, password: passwordConfirmation };
      console.log("creds: " + credentials);
      const response = await deleteCustomer(credentials, token);

      if (response.error) {
        console.error(response.error);
        setModalContent('Wrong password');
        setModalIsOpen(true);
      } else {
        setModalContent('Account deleted successfully');
        setModalIsOpen(true);
        console.log('Account deleted successfully');
        navigate('/login');
      }
    } catch (error) {
      console.error('Unexpected error during account deletion:', error);
    }
  };

  const handleDeposit = async () => {
    try {
      const response = await depositMoney(username, depositAmount, token);

      if (response.error) {
        console.error(response.error);
        if (response instanceof Response && response.status === 401) {
          navigate('/login');
        }
      } else {
        setModalContent('Money deposited successfully');
        setModalIsOpen(true);
        console.log('Money deposited successfully');
      }
    } catch (error) {
      console.error('Unexpected error during money deposit:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <Link to="/cart" className="self-end fixed top-4 right-4 z-10">
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-200 rounded-md">
          <div className="profile-button">Cart</div>
        </button>
      </Link>
      <Link to="/login" className="self-end fixed top-4 left-4 z-10">
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-200 rounded-md">
          <div className="profile-button">Log out</div>
        </button>
      </Link>
      <Link to="/food-catalog" className="self-end fixed top-[70px] left-4 z-10">
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-200 rounded-md">
          <div className="profile-button">Catalog</div>
        </button>
      </Link>
      {isAdmin && (
        <Link to="/food-management" className="self-end fixed left-4 z-10 top-1/2">
          <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-200 rounded-md">
            <div className="profile-button">Food Management</div>
          </button>
        </Link>
      )}
      <div className="flex flex-col items-center">
        <h2 className="text-3xl font-bold mb-4">Profile</h2>
        <div className="mb-2">
          <h3 className="text-xl font-bold mb-2">Update Account Data</h3>
          <div className="mb-2 w-full group">
            <label htmlFor="update_name" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
              Name
            </label>
            <input
              type="text"
              name="Name"
              value={newCustomerData.Name}
              onChange={handleChange}
              className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div className="mb-2 w-full group">
            <label htmlFor="new_password" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button onClick={handleUpdate} className="mt-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-white">
            Update Profile
          </button>
        </div>

        <div className="mb-2 w-full group">
          <h3 className="text-xl font-bold mb-2">Delete Account</h3>

          <label htmlFor="password_confirmation" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
            Password Confirmation
          </label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />

          <button onClick={handleDelete} className="mt-4 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-white">
            Delete Account
          </button>
        </div>

        <div className={"mb-2 w-full group"}>
          <h3 className="text-xl font-bold mb-2">Deposit Money</h3>

          <label
            htmlFor="deposit_amount"
            className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600"
          >
            Amount
          </label>
          <input
            type="number"
            onChange={(e) => setDepositAmount(Number(e.target.value))}
            className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          />

          <button
            onClick={handleDeposit}
            className="mt-4 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-white"
          >
            Deposit Money
          </button>
        </div>
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

export default Profile;