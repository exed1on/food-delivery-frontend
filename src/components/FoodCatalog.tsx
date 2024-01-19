import React, { useState, useEffect } from 'react';
import { listAllFood, addToCart, getCart } from '../api';
import { ApiResponse, Food, Cart, AddToCartDto, RemoveFromCartDto } from '../types';
import { useToken } from './TokenContext';
import { useNavigate } from 'react-router-dom';

const FoodCatalog = () => {
  const navigate = useNavigate();
  const { token, username } = useToken();
  const [foodItems, setFoodItems] = useState<Food[]>([]);
  const [cart, setCart] = useState<Cart[]>([]);

  useEffect(() => {
    fetchFoodItems();
    fetchUserCart();
  }, []);

  const fetchFoodItems = async () => {
    try {
      const response: ApiResponse<Food[]> = await listAllFood();

      if (response.data) {
        setFoodItems(response.data);
      } else if (response.error) {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Failed to fetch food items:', error);
    }
  };

  const fetchUserCart = async () => {
    const cartResponse: ApiResponse<Cart> = await getCart(username, token);

    if (cartResponse.data) {
      setCart([cartResponse.data]);
    } else if (cartResponse.error) {
      console.error('Failed to fetch user cart:', cartResponse.error);
    }
  };

  const addFoodToCart = async (foodItem: Food, addQuantity : number) => {
    try {
      const addToCartDto: AddToCartDto = {
        userName: username,
        foodName: foodItem.name,
        quantity: addQuantity,
    };

    const inputBox = document.getElementById(`quantity-${foodItem.foodId}`) as HTMLInputElement;
    if (inputBox) {
      inputBox.value = '1';
    }


      const response: ApiResponse<Cart> = await addToCart(addToCartDto, token);

      if (response.data) {
        setCart([response.data]);
      } else if (response.error) {
        console.error('Failed to add food item to the cart:', response.error);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during addToCart:', error);
      navigate('/login');
    }
  };

  return (
    <div>
      <h2>Food Catalog</h2>
      <div>
        {foodItems.map((foodItem) => (
          <div key={foodItem.foodId}>
            <h3>{foodItem.name}</h3>
            <p>Description: {foodItem.description}</p>
            <p>Calorie: {foodItem.calorie}</p>
            <p>Price: {foodItem.price}</p>
            <label>
              Quantity:
              <input type="number" defaultValue={1} min={1} id={`quantity-${foodItem.foodId}`} />
            </label>
            <button onClick={() => addFoodToCart(foodItem, parseInt((document.getElementById(`quantity-${foodItem.foodId}`) as HTMLInputElement).value, 10))}>
              Add to Cart
            </button>
          </div>
        ))}
      </div>
      <h3>Shopping Cart</h3>
      <ul>
  {cart.map((cartItem) => (
    <li key={cartItem.cartId}>
      <h4>Cart ID: {cartItem.cartId}</h4>
      <p>Total Price: {cartItem.price}</p>
      <ul>
        {cartItem.orderItems.map((orderItem) => (
          <li key={orderItem.orderItemId}>
            <p>Food: {orderItem.food.name}</p>
            <p>Quantity: {orderItem.pieces}</p>
            <p>Price: {orderItem.price}</p>
          </li>
        ))}
      </ul>
    </li>
  ))}
</ul>
    </div>
  );
};

export default FoodCatalog;