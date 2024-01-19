export interface ApiResponse<T = any> {
    data?: T;
    error?: string;
}

export interface Credentials {
    username: string;
    password: string;
}

export interface FoodDto {
    name: string;
    calorie: number;
    description: string;
    price: number;
}

export interface Food {
    foodId: number;
    name: string;
    calorie: number;
    description: string;
    price: number;
}
export interface Cart {
    cartId: number;
    orderItems: OrderItem[];
    price: number;
  }
  export interface AddToCartDto {
    userName: string | null;
    foodName: string;
    quantity: number;
  }
  
  export interface RemoveFromCartDto {
    userName: string;
    foodName: string;
  }
  export interface OrderItem {
    orderItemId: number;
    food: Food;
    pieces: number;
    price: number;
  }