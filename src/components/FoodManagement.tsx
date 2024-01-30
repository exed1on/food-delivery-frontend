import React, { useState } from 'react';
import { useToken } from './TokenContext';
import { addFood, updateFood, deleteFood } from '../api';
import { FoodDto } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import Modal, { Styles } from 'react-modal';

const FoodManagement = () => {
    const { token, username } = useToken();
    const navigate = useNavigate();
    const [newFoodData, setNewFoodData] = useState<FoodDto>({
        name: '',
        calorie: 0,
        description: '',
        price: 0,
    });
    const [updateFoodData, setUpdateFoodData] = useState<FoodDto>({
        name: '',
        calorie: 0,
        description: '',
        price: 0,
    });

    const [deletingFoodName, setDeletingFoodName] = useState<string>('');
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

    const handleAddChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewFoodData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUpdateFoodData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleDeleteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setDeletingFoodName(value);
    };

    const handleAddFood = async () => {
        try {
            console.log(newFoodData);
            const response = await addFood(newFoodData, token);
            if (response.error) {
                console.error(response.error);
            } else {
                setModalContent('Food has been added');
                setModalIsOpen(true);
                console.log('Food added successfully');
            }
        } catch (error) {
            console.error('Unexpected error during food addition:', error);
        }
    };

    const handleUpdateFood = async () => {
        try {
            console.log(updateFoodData);
            const response = await updateFood(updateFoodData, token);
            if (response.error) {
                console.error(response.error);
            } else {
                setModalContent('Food has been updated');
                setModalIsOpen(true);
                console.log('Food updated successfully');
            }
        } catch (error) {
            console.error('Unexpected error during food update:', error);
        }
    };

    const handleDeleteFood = async () => {
        try {
            console.log(deletingFoodName)
            const response = await deleteFood(deletingFoodName, token);
            if (response.error) {
                console.error(response.error);
            } else {
                setModalContent('Food has been cleared');
                setModalIsOpen(true);
                console.log('Food deleted successfully');
            }
        } catch (error) {
            console.error('Unexpected error during food deletion:', error);
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
            <Link to="/food-catalog" className="self-end fixed top-[70px] right-4 z-10">
                <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-200 rounded-md">
                    <div className="profile-button">Catalog</div>
                </button>
            </Link>
            <Link to="/profile" className="self-end fixed top-[127px] right-4 z-10">
                <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-400 rounded-md">
                    <div className="profile-button">Profile</div>
                </button>
            </Link>
            <div className="flex flex-col items-center mt-4">
                <h2 className="text-3xl font-bold mb-4">Food Management</h2>

                {/* Add Food Section */}
                <h3 className="font-bold mt-4 text-2xl">Add Food</h3>
                <div className="mb-2 w-full group">

                    <label htmlFor="food_name" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Food Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={newFoodData.name}
                        onChange={handleAddChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-2 w-full group">
                    <label htmlFor="food_description" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={newFoodData.description}
                        onChange={handleAddChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-2 w-full group">
                    <label htmlFor="food_calorie" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Calorie
                    </label>
                    <input
                        type="number"
                        name="calorie"
                        value={newFoodData.calorie}
                        onChange={handleAddChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-2 w-full group">
                    <label htmlFor="food_price" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={newFoodData.price}
                        onChange={handleAddChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button onClick={handleAddFood} className="mt-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-white">
                    Add Food
                </button>

                {/* Update Food Section */}
                <h3 className="font-bold mt-4 text-2xl">Update Food</h3>
                <div className="mb-2 w-full group">

                    <label htmlFor="food_name" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Food Name
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={updateFoodData.name}
                        onChange={handleUpdateChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-2 w-full group">
                    <label htmlFor="food_description" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Description
                    </label>
                    <input
                        type="text"
                        name="description"
                        value={updateFoodData.description}
                        onChange={handleUpdateChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-2 w-full group">
                    <label htmlFor="food_calorie" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Calorie
                    </label>
                    <input
                        type="number"
                        name="calorie"
                        value={updateFoodData.calorie}
                        onChange={handleUpdateChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div className="mb-2 w-full group">
                    <label htmlFor="food_price" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Price
                    </label>
                    <input
                        type="number"
                        name="price"
                        value={updateFoodData.price}
                        onChange={handleUpdateChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button onClick={handleUpdateFood} className="mt-2 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-white">
                    Update food
                </button>

                {/* Delete Food Section */}
                <div className="mb-2 w-full group">
                    <label htmlFor="food_id_to_delete" className="font-mono uppercase font-bold text-[12px] text-gray-900 text-black-300 bg-white relative px-1 top-2 left-3 w-auto group-focus-within:text-blue-600">
                        Food name to Delete
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={deletingFoodName}
                        onChange={handleDeleteChange}
                        className="h-11 text-[18px] bg-black-50 border py-55-rem border-gray-300 text-white-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <button onClick={handleDeleteFood} className="mt-2 mb-4 bg-white text-black px-4 py-2 rounded-md hover:bg-gray-100 focus:outline-none focus:ring focus:border-white">
                    Delete Food
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

export default FoodManagement;