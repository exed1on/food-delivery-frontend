import React, { useState, useEffect } from 'react';
import { useToken } from './TokenContext';
import { removeFromCart, updateCartItemQuantity, clearCart, getCart, createOrder, checkAdminRightsForFood } from '../api';
import { ApiResponse, Cart, RemoveFromCartDto, AddToCartDto, Order } from '../types';
import { useNavigate, Link } from 'react-router-dom';
import Modal, { Styles } from 'react-modal';

const CartPage = () => {
  const { token, username } = useToken();
  const [cart, setCart] = useState<Cart | null>(null);
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
    fetchCart();
  }, []);

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

  const fetchCart = async () => {
    const cartResponse: ApiResponse<Cart> = await getCart(username, token);
    if (cartResponse.data) {
      setCart(cartResponse.data);
    }
  };

  const handleRemoveFromCart = async (foodName: string) => {
    const removeFromCartDto: RemoveFromCartDto = {
      userName: username,
      foodName: foodName,
    };

    console.log("remove dto in handleRemoveFromCart  " + removeFromCartDto);

    const response: ApiResponse<Cart> = await removeFromCart(removeFromCartDto, token);

    if (response.data) {
      setCart(response.data);
    } else if (response.error) {
      console.error('Failed to remove from cart:', response.error);
    }
    fetchCart();
  };

  const handleUpdateCartItemQuantity = async (foodName: string, quantity: number) => {
    const updateCartItemQuantityDto: AddToCartDto = {
      userName: username,
      foodName: foodName,
      quantity: quantity,
    };

    const response: ApiResponse<Cart> = await updateCartItemQuantity(updateCartItemQuantityDto, token);

    if (response.data) {
      setCart(response.data);
    } else if (response.error) {
      console.error('Failed to update cart item quantity:', response.error);
    }
  };

  const handleClearCart = async () => {
    const response: ApiResponse<string> = await clearCart(username, token);

    if (response.data) {
      setCart(null);
      fetchCart();
    } else if (response.error) {
      fetchCart();
      setModalContent('Cart has been cleared');
      setModalIsOpen(true);
    }
  };

  const handleCreateOrder = async () => {
    try {
      const response: ApiResponse<Order> = await createOrder(username, token);

      if (response.data) {
        setCart(null);
        fetchCart();
      } else if (response.error) {
        setModalContent('Not enough money for this order');
        setModalIsOpen(true);
      }
    } catch (error) {
      console.error('Error during createOrder:', error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-black">
      <Link to="/profile" className="self-end fixed top-4 right-4 z-10">
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-400 rounded-md">
          <div className="profile-button">Profile</div>
        </button>
      </Link>
      <Link to="/login" className="self-end fixed top-4 left-4 z-10">
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-400 rounded-md">
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
        <h2 className="mt-3 text-3xl text-white font-bold mb-4">Cart ({cart?.price}$)</h2>
        {cart && cart.price !== 0 ? (
          <div>
            {cart.orderItems.map((orderItem) => (
              <div key={orderItem.orderItemId} className="flex items-center justify-between bg-white p-4 mb-4 rounded-[20px]">
                <div>
                  <p className="text-xl font-semibold mb-2">{orderItem.food.name}</p>
                  <p>{orderItem.price}$</p>
                </div>
                <div className="flex items-center">
                  <input
                    type="number"
                    min={1}
                    value={orderItem.pieces}
                    onChange={(e) => handleUpdateCartItemQuantity(orderItem.food.name, parseInt(e.target.value, 10))}
                    className="border ml-4 w-[80px] text-black border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring"
                  />
                  <p className="ml-4 mr-4">{orderItem.price * orderItem.pieces}$</p>
                  <button
                    onClick={() => handleRemoveFromCart(orderItem.food.name)}
                    className="bg-gray-200 text-black px-4 py-2 rounded-md hover:border-blue-500 hover:bg-gray-300 focus:outline-none focus:ring focus:border-blue-300 ml-2"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              onClick={handleClearCart}
              className="mr-3 mb-4 bg-white hover:bg-gray-200 text-black text-black px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 mt-2"
            >
              Clear Cart
            </button>
            <button
              onClick={handleCreateOrder}
              className="ml-3 mb-4 bg-white hover:bg-gray-200 text-black text-black px-4 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 mt-2"
            >
              Create Order
            </button>
          </div>
        ) : (
          <p className='text-white'>Your cart is empty.</p>
        )}
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

export default CartPage;