import React, { useState, useEffect } from 'react';
import { useToken } from './TokenContext';
import { updateExistingCustomer, deleteCustomer, checkCustomer, depositMoney } from '../api';
import { RegisterDto, Credentials } from '../types';
import { useNavigate } from 'react-router-dom';

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewCustomerData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleUpdate = async () => {
    try {
      if (username != null){
      newCustomerData.UserName = username;
      newCustomerData.Password = newPassword;
      console.log(newCustomerData);
      const response = await updateExistingCustomer(newCustomerData, token);
      if (response.error) {
        console.error(response.error);
      } else {
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
      const credentials : Credentials = {username, password : passwordConfirmation};
      
      const response = await deleteCustomer(credentials, token);

      if (response.error) {
        console.error(response.error);
      } else {
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
      } else {
        console.log('Money deposited successfully');
      }
    } catch (error) {
      console.error('Unexpected error during money deposit:', error);
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <div>
        <h3>Update Account Data</h3>
        <label>
          Name:
          <input
            type="text"
            name="Name"
            value={newCustomerData.Name}
            onChange={handleChange}
          />
        </label>
        <label>
          New Password:
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </label>
        <button onClick={handleUpdate}>Update Profile</button>
      </div>
      <div>
        <h3>Delete Account</h3>
        <label>
          Password Confirmation:
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
        </label>
        <button onClick={handleDelete}>Delete Account</button>
      </div>
      <div>
        <h3>Deposit Money</h3>
        <label>
          Amount:
          <input
            type="number"
            value={depositAmount}
            onChange={(e) => setDepositAmount(Number(e.target.value))}
          />
        </label>
        <button onClick={handleDeposit}>Deposit Money</button>
      </div>
    </div>
  );
};

export default Profile;