import { useState, useEffect, ChangeEvent  } from 'react';
import { listAllFood, addToCart, getCart, getCustomerBalance , checkAdminRightsForFood} from '../api';
import { ApiResponse, Food, Cart, AddToCartDto } from '../types';
import { useToken } from './TokenContext';
import { useNavigate, Link } from 'react-router-dom';

const FoodCatalog = () => {
  const navigate = useNavigate();
  const { token, username } = useToken();
  const [foodItems, setFoodItems] = useState<Food[]>([]);
  const [cart, setCart] = useState<Cart[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    fetchFoodItems();
    fetchUserCart();
    fetchBalance();
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

  const fetchBalance = async () => {
    try {
      const response: ApiResponse<number> = await getCustomerBalance(username, token);

      if (response.data) {
        setBalance(response.data);
      } else if (response.error) {
        console.error(response.error);
      }
    } catch (error) {
      console.error('Failed to fetch food items:', error);
    }
  };

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
    }
  };
  const addFoodToCart = async (foodItem: Food, addQuantity: number) => {
    try {
      const addingToCartDto: AddToCartDto = {
        userName: username,
        foodName: foodItem.name,
        quantity: addQuantity,
      };

      console.log(addingToCartDto);
      const inputBox = document.getElementById(`quantity-${foodItem.foodId}`) as HTMLInputElement;
      if (inputBox) {
        inputBox.value = '1';
      }

      const response: ApiResponse<Cart> = await addToCart(addingToCartDto, token);

      if (response.data) {
        fetchUserCart();
      } else if (response.error) {
        console.error('Failed to add food item to the cart:', response.error);
        navigate('/login');
      }
    } catch (error) {
      console.error('Error during addToCart:', error);
      navigate('/login');
    }
  };

  const handleCartNavigation = () => {
    navigate('/cart');
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.currentTarget.value;
    const numericValue = inputValue.replace(/\D/g, '');

    e.currentTarget.value = numericValue;
  };

  const handleCartPrice = () => {
    const cartPrice = cart.map((cartItem) => cartItem.price);
    return cartPrice;
  }

  return (
    <div className="foodCatalog relative flex flex-col items-center  p-4 bg-gray-900 text-white">
      <Link to="/profile" className="self-end fixed top-4 right-4 z-10">
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md">
          <div className="profile-button">Profile</div>
        </button>
      </Link>
      <Link to="/cart" className="self-end fixed top-[70px] right-4 z-10">
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 rounded-md">
          <div className="profile-button">Cart</div>
        </button>
      </Link>
      <Link to="/login" className="self-end fixed top-4 left-4 z-10">
        <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-400 rounded-md">
          <div className="profile-button">Log out</div>
        </button>
      </Link>
      {isAdmin && (
        <Link to="/food-management" className="self-end fixed left-4 z-10 top-1/2">
          <button className="bg-white hover:bg-gray-200 text-black px-4 py-2 border border-gray-200 rounded-md">
            <div className="profile-button">Food Management</div>
          </button>
        </Link>
      )}
      <h2 className="text-3xl font-bold mb-4">Food Catalog</h2>
      {foodItems.map((foodItem) => (
        <div key={foodItem.foodId} className="w-2/5 mb-4 p-4 border bg-gray-300 border-gray-400 rounded-[25px] bg-white text-black">
          <h3 className="mb-2 text-xl font-semibold flex flex-col items-center">{foodItem.name}</h3>
          <p className="mb-2">{foodItem.description}</p>
          <p className="mb-2">Calorie: {foodItem.calorie}</p>
          <p>{foodItem.price}$</p>
          <label className="block mt-2">
            Quantity:
            <input
              type="number"
              pattern="\d*" onInput={handleInput}
              defaultValue={1}
              min={1}
              id={`quantity-${foodItem.foodId}`}
              className="h-8 w-32 border mb-2 border-gray-700 px-3 py-2 rounded-md focus:outline-none focus:ring focus:border-blue-300 ml-2 text-black"
            />
          </label>
          <button
            onClick={() => addFoodToCart(foodItem, parseInt((document.getElementById(`quantity-${foodItem.foodId}`) as HTMLInputElement).value, 10))}
            className="bg-gray-200 text-black px-4 py-2 rounded-md mt-2 hover:bg-gray-400 focus:outline-none focus:ring focus:border-green-300"
          >
            Add to Cart
          </button>
        </div>
      ))}
      <div className="mr-12 w-1/5 fixed bottom-0 right-0 p-4 bg-gray-200 border border-gray-300 rounded-md text-black max-h-96 overflow-y-auto">
        <button
          onClick={handleCartNavigation}
          className="text-2xl text-gray-900 hover:text-black font-bold mb-4 mr-7"
        >
          Shopping Cart
        </button>
        <ul>
          {cart.map((cartItem) => (
            <li key={cartItem.cartId} className="mb-4">
              <ul>
                {cartItem.orderItems.map((orderItem) => (
                  <li key={orderItem.orderItemId} className="mb-2">
                    <p className="font-semibold">{orderItem.food.name}</p>
                    <p>Quantity: {orderItem.pieces}</p>
                    <p>{orderItem.price} $</p>
                  </li>
                ))}
              </ul>
              <b>
                <p className="text-lg font-bold">Total Price: {handleCartPrice()} $</p>
              </b>
            </li>
          ))}
        </ul>
      </div>
      <div className="ml-12 w-1/5 fixed bottom-0 left-0 p-4 bg-gray-200 border border-gray-300 rounded-md text-black max-h-96 overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4">Customer Balance</h2>
      {balance !== null ? (
        <p className="text-lg font-bold">Balance: {balance} $</p>
      ) : (
        <p className="text-lg font-bold">Balance: 0 $</p>
      )}
    </div>
    </div>
  );
};

export default FoodCatalog;