export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
}

export interface Credentials {
  username: string | null;
  password: string | null;
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
  userName: string | null;
  foodName: string;
}
export interface OrderItem {
  orderItemId: number;
  food: Food;
  pieces: number;
  price: number;
}

export interface RegisterDto {
  Name: string;
  UserName: string;
  Password: string;
}

export enum Roles {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

export interface Customer extends Credentials {
  CustomerId: number;
  Name: string;
  Balance: number;
  Cart: Cart;
  Orders: Order[];
  Role: Roles;
}

export interface Order {
  OrderId: number;
  Customer: Customer;
  Cart: Cart;
  Price: number;
  TimestampCreated: string;
}
export interface CustomerDto {
  userName: string;
  balance: number;
}