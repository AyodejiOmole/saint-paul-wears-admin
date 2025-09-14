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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
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
  Eye,
  UserCheck,
  UserX,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingCart,
} from "lucide-react"
import { useQuery } from "@tanstack/react-query"

import { User } from "@/types"
import { fetchUsers } from "@/lib/users"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Products", href: "/products", icon: Package },
  { name: "Users", href: "/users", icon: Users },
  { name: "Hero Banners", href: "/banners", icon: ImageIcon },
  { name: "Newsletters", href: "/newsletters", icon: Mail},
  { name: "Delivery Fees", href: "/delivery-fee", icon: Package },
  // { name: "Revenue", href: "/revenue", icon: TrendingUp },
]

const statusColors = {
  active: "bg-green-100 text-green-800 border-green-200",
  inactive: "bg-red-100 text-red-800 border-red-200",
}

const orderStatusColors = {
  PAID: "bg-green-100 text-green-800 border-green-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  CREATED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  INITIATED: "bg-yellow-100 text-yellow-800 border-yellow-200",
  AWAITING_WEBHOOK: "bg-yellow-100 text-yellow-800 border-yellow-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
  CANCELLED: "bg-red-100 text-red-800 border-red-200",
  REFUNDED: "bg-red-100 text-red-800 border-red-200",
  FAILED_OUT_OF_STOCK: "bg-red-100 text-red-800 border-red-200"
}

export default function UsersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const pathname = usePathname()

  // const searchTerm = "";
  const { data } = useQuery({
    queryKey: ["users"],
    queryFn: ({ queryKey }) => fetchUsers(queryKey[0]),
  })

  const users = data ?? [];
  
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.id.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch;
  })

  // const totalRevenue = data?.reduce((sum, user) => sum + user.totalSpent, 0)
  // const totalOrders = data?.reduce((sum, user) => sum + user.totalOrders, 0)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  const formatDate = (dateString: string | number) => {
    return new Date(dateString).toLocaleDateString("en-NG", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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
            <h2 className="font-heading text-2xl font-semibold text-foreground">Users Management</h2>
          </div>
        </div>

        {/* Page content */}
        <main className="p-6">
          {/* User Statistics */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
            <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{data?.length}</div>
                <p className="text-xs text-muted-foreground">Registered customers</p>
              </CardContent>
            </Card>

            {/* <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Active Users</CardTitle>
                <UserCheck className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{activeUsers}</div>
                <p className="text-xs text-muted-foreground">Currently active accounts</p>
              </CardContent>
            </Card> */}

            {/* <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total Orders</CardTitle>
                <ShoppingCart className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{totalOrders ?? 0}</div>
                <p className="text-xs text-muted-foreground">Orders from all users</p>
              </CardContent>
            </Card> */}

            {/* <Card className="border-border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-card-foreground">Total Revenue</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{formatCurrency(totalRevenue ?? 0)}</div>
                <p className="text-xs text-muted-foreground">From all user purchases</p>
              </CardContent>
            </Card> */}
          </div>

          {/* Filters and Search */}
          <Card className="mb-6 border-border">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-card-foreground">Filter Users</CardTitle>
              <CardDescription className="text-muted-foreground">
                Search and filter users by status, name, or email
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search users by name, email, or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Users</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select> */}
              </div>
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-card-foreground">
                Users ({data?.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage customer accounts and view user details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">User</TableHead>
                      <TableHead className="font-medium">Contact</TableHead>
                      {/* <TableHead className="font-medium">Status</TableHead> */}
                      <TableHead className="font-medium">Orders</TableHead>
                      <TableHead className="font-medium">Total Spent</TableHead>
                      <TableHead className="font-medium">Join Date</TableHead>
                      {/* <TableHead className="font-medium">Last Login</TableHead> */}
                      <TableHead className="font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers?.map((user) => (
                      <TableRow key={user.id} className="hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                              <AvatarImage src={"/placeholder.svg"} alt={user.firstName} />
                              <AvatarFallback className="bg-accent text-accent-foreground">
                                {getInitials(user.firstName + user.lastName)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.firstName + user.lastName}</div>
                              <div className="text-sm text-muted-foreground">{user.id}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1 text-sm">
                              <Mail className="h-3 w-3" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Phone className="h-3 w-3" />
                              {user.phone}
                            </div>
                          </div>
                        </TableCell>
                        {/* <TableCell>
                          <Badge className={statusColors[user.status]}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                        </TableCell> */}
                        <TableCell className="font-medium">{user.totalOrders ?? 0}</TableCell>
                        <TableCell className="font-medium">{formatCurrency(user.totalSpent ?? 0)}</TableCell>
                        <TableCell>{formatDate(user.joinDate)}</TableCell>
                        {/* <TableCell>{formatDate(user.lastLogin)}</TableCell> */}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Dialog
                              open={selectedUser?.id === user.id}
                              onOpenChange={(open) => !open && setSelectedUser(null)}
                            >
                              <DialogTrigger asChild>
                                <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="min-w-9/10 max-h-[90vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="font-heading">User Details</DialogTitle>
                                  <DialogDescription>
                                    Complete information for {user.firstName} {user.lastName}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-6 py-4">
                                  {/* User Info */}
                                  <div className="grid gap-4 md:grid-cols-2">
                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">Personal Information</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-3">
                                        <div className="flex items-center gap-3">
                                          <Avatar className="h-12 w-12">
                                            <AvatarImage src={"/placeholder.svg"} alt={user.firstName} />
                                            <AvatarFallback className="bg-accent text-accent-foreground">
                                              {getInitials(user.firstName + user.lastName)}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <div className="font-medium">{user.firstName}</div>
                                            {/* <div className="text-sm text-muted-foreground">{user.id}</div> */}
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{user.email}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{user.phone}</span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">
                                              {user?.address?.street}, {user?.address?.city}, {user?.address?.state}
                                            </span>
                                          </div>
                                          <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">Joined {formatDate(user.joinDate)}</span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>

                                    <Card>
                                      <CardHeader>
                                        <CardTitle className="text-base">Account Statistics</CardTitle>
                                      </CardHeader>
                                      <CardContent className="space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                          <div className="text-center p-3 bg-muted rounded-lg">
                                            <div className="text-sm font-bold text-secondary">{user.totalOrders ?? 0}</div>
                                            <div className="text-sm text-muted-foreground">Total Orders</div>
                                          </div>
                                          <div className="text-center p-3 bg-muted rounded-lg">
                                            <div className="text-sm font-bold text-accent">
                                              {formatCurrency(user.totalSpent ?? 0)}
                                            </div>
                                            <div className="text-sm text-muted-foreground">Total Spent</div>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          {/* <div className="flex justify-between">
                                            <span className="text-sm">Account Status:</span>
                                            <Badge className={statusColors[user.status]}>
                                              {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                            </Badge>
                                          </div> */}
                                          {/* <div className="flex justify-between">
                                            <span className="text-sm">Last Login:</span>
                                            <span className="text-sm">{formatDate(user.lastLogin)}</span>
                                          </div> */}
                                          <div className="flex justify-between">
                                            <span className="text-sm">Average Order:</span>
                                            <span className="text-sm">
                                              {formatCurrency(user.totalSpent / user.totalOrders || 0)}
                                            </span>
                                          </div>
                                        </div>
                                      </CardContent>
                                    </Card>
                                  </div>

                                  {/* Order History */}
                                  <Card>
                                    <CardHeader>
                                      <CardTitle className="text-base">Recent Order History</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                      <div className="overflow-x-auto">
                                        <Table>
                                          <TableHeader>
                                            <TableRow>
                                              <TableHead>Order ID</TableHead>
                                              <TableHead>Date</TableHead>
                                              <TableHead>Total</TableHead>
                                              <TableHead>Status</TableHead>
                                            </TableRow>
                                          </TableHeader>
                                          <TableBody>
                                            {user?.orders?.map((order) => (
                                              <TableRow key={order.id}>
                                                <TableCell className="font-mono text-sm">{order.id}</TableCell>
                                                <TableCell>{formatDate(new Date(Number(order.createdAt)).toDateString())}</TableCell>
                                                <TableCell>{formatCurrency(order.amount)}</TableCell>
                                                <TableCell>
                                                  <Badge
                                                    className={
                                                      orderStatusColors[order.status as keyof typeof orderStatusColors]
                                                    }
                                                  >
                                                    {order.status}
                                                  </Badge>
                                                </TableCell>
                                              </TableRow>
                                            ))}
                                          </TableBody>
                                        </Table>
                                      </div>
                                    </CardContent>
                                  </Card>
                                </div>
                              </DialogContent>
                            </Dialog>

                            {/* <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className={cn(
                                    user.status === "active"
                                      ? "text-destructive hover:text-destructive"
                                      : "text-accent hover:text-accent",
                                  )}
                                >
                                  {user.status === "active" ? (
                                    <UserX className="h-4 w-4" />
                                  ) : (
                                    <UserCheck className="h-4 w-4" />
                                  )}
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    {user.status === "active" ? "Deactivate" : "Activate"} User Account
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to {user.status === "active" ? "deactivate" : "activate"}{" "}
                                    {user.name}'s account? This will{" "}
                                    {user.status === "active"
                                      ? "prevent them from accessing their account"
                                      : "restore their account access"}
                                    .
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => toggleUserStatus(user.id)}
                                    className={cn(
                                      user.status === "active"
                                        ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                        : "bg-accent text-accent-foreground hover:bg-accent/90",
                                    )}
                                  >
                                    {user.status === "active" ? "Deactivate" : "Activate"}
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog> */}
                          </div>
                        </TableCell>
                      </TableRow>
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
