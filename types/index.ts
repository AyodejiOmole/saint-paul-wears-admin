export interface User {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    address?: Address
    joinDate: string
    role?: "user" | "admin"
    totalSpent: number
    totalOrders: number
    orders?: Order[]
}

export interface Address {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
}

export interface Product {
  id?: string
  name: string
  price: number
  category: string
  description: string
  productImages: string[]
  stock: number
  sizeOptions: string[]
  originalPrice?: number
  colors: string[]
  sizes: string[]
  // ...etc
}

export interface Banner {
    id?: string
    // name: string
    header: string
    secondaryText: string
    title: string
    description: string
    image: string
    tagline?: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
    isActive?: boolean
    updatedAt: string
    createdAt: string
}

// types/order.ts
export type OrderStatus = 'CREATED' | 'INITIATED' | 'AWAITING_WEBHOOK' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export interface OrderItem {
  id: string
  name: string
  price: number
  image: string
  size: string
  color: string
  quantity: number
  category: string
}

export type Order = {
    id: string;
    userId: string;
    items: OrderItem[];
    amount: number;
    currency: 'NGN';
    status: OrderStatus;
    paystack: {
        reference: string | null;
        authorizationUrl: string | null;
        accessCode: string | null;
    };
    createdAt: number;
    updatedAt: number;
    customer: Omit<User, "id" | "role" | "totalSpent" | "totalOrders" | "joinDate" | "orders">;
    deliveryAddress: Address;
    deliveryFee: number;
    selectedLocation: string;
};