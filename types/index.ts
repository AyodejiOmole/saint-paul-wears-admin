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
    orderHistory?: Order[]
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
    title: string
    description: string
    image: string
    tagline?: string
    subtitle?: string
    ctaText?: string
    ctaLink?: string
    isActive?: boolean
}

export interface Order {
    id: string
    total: number
    status: "pending" | "shipped" | "delivered"
    date: string
}