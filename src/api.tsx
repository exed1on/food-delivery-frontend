import { ApiResponse } from './types';
import { Credentials } from './types';
import { useToken } from './components/TokenContext';
import { FoodDto, Food, AddToCartDto, Cart, RemoveFromCartDto, RegisterDto, Customer, CustomerDto } from './types'

const API_BASE_URL = 'https://localhost:7144/api';

export const generateToken = async (user: Credentials, setToken: (token: string | null, username: string | null) => void): Promise<ApiResponse<string>> => {
    try {
        console.log('User:', user);

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(user),
        });

        console.log('Response:', response);

        if (!response.ok) {
            console.error('Failed to generate token. Response not okay.');
            return { error: 'Unauthorized' };
        }

        const data = await response.text();
        console.log('Token:', data);

        setToken(data, user.username);

        return { data };
    } catch (error) {
        console.error('Error during token generation:', error);
        return { error: 'Failed to generate token' };
    }
};
export const listAllFood = async (): Promise<ApiResponse<Food[]>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Food/listAllFood`);
        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to fetch food list' };
    }
};

export const addFood = async (newFood: FoodDto, token: string | null): Promise<ApiResponse<Food>> => {
    try {
        if (!token) {
            return { error: 'Token is missing' };
        }

        const response = await fetch(`${API_BASE_URL}/Food/addFood`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newFood),
        });
        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to add food' };
    }
};

export const updateFood = async (updatedFood: FoodDto): Promise<ApiResponse<Food>> => {
    try {
        const { token } = useToken();
        const response = await fetch(`${API_BASE_URL}/Food/updateFood`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include your JWT token here
            },
            body: JSON.stringify(updatedFood),
        });
        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to update food' };
    }
};

export const deleteFood = async (foodIdToDelete: number): Promise<ApiResponse<string>> => {
    try {
        const { token } = useToken();
        const response = await fetch(`${API_BASE_URL}/Food/deleteFood/${foodIdToDelete}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to delete food' };
    }
};

export const checkFood = async (foodName: string): Promise<ApiResponse<void>> => {
    try {
        const { token } = useToken();
        const response = await fetch(`${API_BASE_URL}/Food/${foodName}`, {
            method: 'HEAD',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (response.ok) {
            return { data: undefined };
        } else {
            return { error: 'Food not found' };
        }
    } catch (error) {
        return { error: 'Failed to check food' };
    }
};
export const addToCart = async (addToCartDto: AddToCartDto, token: string | null): Promise<ApiResponse<Cart>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Cart/addToCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(addToCartDto),
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to add to cart' };
    }
};

export const getCart = async (userName: string | null, token: string | null): Promise<ApiResponse<Cart>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Cart/getCart/${userName}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to get cart' };
    }
};

export const removeFromCart = async (removeFromCartDto: RemoveFromCartDto): Promise<ApiResponse<Cart>> => {
    try {
        const { token } = useToken();

        const response = await fetch(`${API_BASE_URL}/Cart/removeFromCart`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(removeFromCartDto),
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to remove from cart' };
    }
};

export const updateCartItemQuantity = async (updateCartItemQuantityDto: AddToCartDto): Promise<ApiResponse<Cart>> => {
    try {
        const { token } = useToken();

        const response = await fetch(`${API_BASE_URL}/Cart/updateCartItemQuantity`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(updateCartItemQuantityDto),
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to update cart item quantity' };
    }
};

export const clearCart = async (userName: string): Promise<ApiResponse<string>> => {
    try {
        const { token } = useToken();

        const response = await fetch(`${API_BASE_URL}/Cart/clearCart/${userName}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to clear cart' };
    }
};
export const registerNewCustomer = async (newCustomer: RegisterDto): Promise<ApiResponse<string>> => {
    try {
        console.log(newCustomer);
        const response = await fetch(`${API_BASE_URL}/Customer/register/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newCustomer),
        });
        console.log(newCustomer);
        const data = await response.text();
        console.log(data);
        return {data};
    } catch (error) {
        return { error: 'Failed to register new customer' };
    }
};

export const updateExistingCustomer = async (newCustomer: RegisterDto, token: string | null): Promise<ApiResponse<Customer>> => {
    try {
        console.log(newCustomer);
        const response = await fetch(`${API_BASE_URL}/Customer/update/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newCustomer),
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to update existing customer' };
    }
};

export const deleteCustomer = async (creds: Credentials, token: string | null): Promise<ApiResponse<Customer>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Customer/delete/`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(creds),
        });

        const data = await response.json();
        return { data };
    } catch (error) {
        return { error: 'Failed to delete customer' };
    }
};

export const checkCustomer = async (userName: string, token: string | null): Promise<ApiResponse<void>> => {
    try {
        const response = await fetch(`${API_BASE_URL}/Customer/${userName}`, {
            method: 'HEAD',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return { data: undefined };
    } catch (error) {
        return { error: 'Failed to check customer' };
    }
};

export const depositMoney = async (userName: string | null, amount: number, token: string | null): Promise<ApiResponse<CustomerDto>> => {
    try {
        if (amount <= 0) {
            return { error: 'Invalid deposit request.' };
        }

        const queryString = `userName=${encodeURIComponent(userName || '')}&amount=${encodeURIComponent(amount.toString())}`;

        const response = await fetch(`${API_BASE_URL}/Customer/deposit?${queryString}`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();
        console.log(data);
        return { data };
    } catch (error) {
        return { error: 'Failed to deposit money' };
    }
};