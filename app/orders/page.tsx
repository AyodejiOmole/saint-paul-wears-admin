"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ImageIcon,
  TrendingUp,
  Menu,
  X,
  Search,
  ChevronDown,
  ChevronRight,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Products", href: "/products", icon: Package },
  { name: "Users", href: "/users", icon: Users },
  { name: "Hero Banners", href: "/banners", icon: ImageIcon },
  { name: "Revenue", href: "/revenue", icon: TrendingUp },
]

// Mock orders data
const mockOrders = [
  {
    id: "ORD-001",
    customer: { name: "Adebayo Johnson", email: "adebayo@email.com", phone: "+234 801 234 5678" },
    items: [
      { name: "Saint Paul Classic Shirt", size: "L", color: "Black", quantity: 2, price: 45000 },
      { name: "Premium Leather Belt", size: "32", color: "Brown", quantity: 1, price: 25000 },
    ],
    total: 115000,
    status: "pending",
    paymentStatus: "paid",
    orderDate: "2024-01-15",
    shippingAddress: "123 Victoria Island, Lagos, Nigeria",
  },
  {
    id: "ORD-002",
    customer: { name: "Fatima Abdullahi", email: "fatima@email.com", phone: "+234 802 345 6789" },
    items: [{ name: "Luxury Blazer", size: "M", color: "Navy", quantity: 1, price: 85000 }],
    total: 85000,
    status: "shipped",
    paymentStatus: "paid",
    orderDate: "2024-01-14",
    shippingAddress: "456 Wuse II, Abuja, Nigeria",
  },
  {
    id: "ORD-003",
    customer: { name: "Chidi Okafor", email: "chidi@email.com", phone: "+234 803 456 7890" },
    items: [
      { name: "Designer Trousers", size: "34", color: "Charcoal", quantity: 1, price: 55000 },
      { name: "Silk Tie", size: "One Size", color: "Burgundy", quantity: 2, price: 15000 },
    ],
    total: 85000,
    status: "delivered",
    paymentStatus: "paid",
    orderDate: "2024-01-12",
    shippingAddress: "789 GRA, Port Harcourt, Nigeria",
  },
  {
    id: "ORD-004",
    customer: { name: "Aisha Mohammed", email: "aisha@email.com", phone: "+234 804 567 8901" },
    items: [{ name: "Evening Dress", size: "S", color: "Black", quantity: 1, price: 120000 }],
    total: 120000,
    status: "pending",
    paymentStatus: "pending",
    orderDate: "2024-01-16",
    shippingAddress: "321 Kaduna Road, Kano, Nigeria",
  },
]

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  shipped: "bg-blue-100 text-blue-800 border-blue-200",
  delivered: "bg-green-100 text-green-800 border-green-200",
}

const paymentStatusColors = {
  paid: "bg-green-100 text-green-800 border-green-200",
  pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
  failed: "bg-red-100 text-red-800 border-red-200",
}

export default function OrdersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [expandedOrders, setExpandedOrders] = useState<Set<string>>(new Set())
  const [orders, setOrders] = useState(mockOrders)
  const pathname = usePathname()

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleOrderExpansion = (orderId: string) => {
    const newExpanded = new Set(expandedOrders)
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId)
    } else {
      newExpanded.add(orderId)
    }
    setExpandedOrders(newExpanded)
  }

  const updateOrderStatus = (orderId: string, newStatus: string) => {
    setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-sidebar transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-sidebar-border">
            <h1 className="font-heading text-xl font-bold text-sidebar-foreground">Saint Paul</h1>
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.name}
                </Link>
              )
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-sidebar-border">
            <p className="text-xs text-sidebar-foreground/60 text-center">Admin Dashboard v1.0</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
          <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>

          <div className="flex-1">
            <h2 className="font-heading text-2xl font-semibold text-foreground">Orders Management</h2>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {/* Filters and Search */}
          <Card className="mb-6 border-border">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-card-foreground">Filter Orders</CardTitle>
              <CardDescription className="text-muted-foreground">
                Search and filter orders by status, customer, or order ID
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search orders, customers, or order IDs..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Orders</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="shipped">Shipped</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Orders Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-card-foreground">
                Orders ({filteredOrders.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage customer orders and update delivery status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead className="font-medium">Order ID</TableHead>
                      <TableHead className="font-medium">Customer</TableHead>
                      <TableHead className="font-medium">Total</TableHead>
                      <TableHead className="font-medium">Status</TableHead>
                      <TableHead className="font-medium">Payment</TableHead>
                      <TableHead className="font-medium">Date</TableHead>
                      <TableHead className="font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredOrders.map((order) => (
                      <>
                        <TableRow key={order.id} className="hover:bg-muted/50">
                          <TableCell>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => toggleOrderExpansion(order.id)}
                              className="p-0 h-8 w-8"
                            >
                              {expandedOrders.has(order.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </Button>
                          </TableCell>
                          <TableCell className="font-mono text-sm">{order.id}</TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">{order.customer.name}</div>
                              <div className="text-sm text-muted-foreground">{order.customer.email}</div>
                            </div>
                          </TableCell>
                          <TableCell className="font-medium">{formatCurrency(order.total)}</TableCell>
                          <TableCell>
                            <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}
                            >
                              {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>{order.orderDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Select
                                value={order.status}
                                onValueChange={(value) => updateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-32 h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="shipped">Shipped</SelectItem>
                                  <SelectItem value="delivered">Delivered</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </TableCell>
                        </TableRow>

                        {/* Expanded order details */}
                        {expandedOrders.has(order.id) && (
                          <TableRow>
                            <TableCell colSpan={8} className="bg-muted/30">
                              <div className="p-4 space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                  {/* Customer Details */}
                                  <div>
                                    <h4 className="font-medium text-card-foreground mb-2">Customer Details</h4>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <span className="font-medium">Name:</span> {order.customer.name}
                                      </p>
                                      <p>
                                        <span className="font-medium">Email:</span> {order.customer.email}
                                      </p>
                                      <p>
                                        <span className="font-medium">Phone:</span> {order.customer.phone}
                                      </p>
                                      <p>
                                        <span className="font-medium">Address:</span> {order.shippingAddress}
                                      </p>
                                    </div>
                                  </div>

                                  {/* Order Summary */}
                                  <div>
                                    <h4 className="font-medium text-card-foreground mb-2">Order Summary</h4>
                                    <div className="space-y-1 text-sm">
                                      <p>
                                        <span className="font-medium">Order ID:</span> {order.id}
                                      </p>
                                      <p>
                                        <span className="font-medium">Order Date:</span> {order.orderDate}
                                      </p>
                                      <p>
                                        <span className="font-medium">Payment Status:</span>
                                        <Badge
                                          className={`ml-2 ${paymentStatusColors[order.paymentStatus as keyof typeof paymentStatusColors]}`}
                                        >
                                          {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
                                        </Badge>
                                      </p>
                                      <p>
                                        <span className="font-medium">Total:</span> {formatCurrency(order.total)}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Items Ordered */}
                                <div>
                                  <h4 className="font-medium text-card-foreground mb-2">Items Ordered</h4>
                                  <div className="overflow-x-auto">
                                    <Table>
                                      <TableHeader>
                                        <TableRow>
                                          <TableHead className="text-xs">Product</TableHead>
                                          <TableHead className="text-xs">Size</TableHead>
                                          <TableHead className="text-xs">Color</TableHead>
                                          <TableHead className="text-xs">Qty</TableHead>
                                          <TableHead className="text-xs">Price</TableHead>
                                        </TableRow>
                                      </TableHeader>
                                      <TableBody>
                                        {order.items.map((item, index) => (
                                          <TableRow key={index}>
                                            <TableCell className="text-sm">{item.name}</TableCell>
                                            <TableCell className="text-sm">{item.size}</TableCell>
                                            <TableCell className="text-sm">{item.color}</TableCell>
                                            <TableCell className="text-sm">{item.quantity}</TableCell>
                                            <TableCell className="text-sm">{formatCurrency(item.price)}</TableCell>
                                          </TableRow>
                                        ))}
                                      </TableBody>
                                    </Table>
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
