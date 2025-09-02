"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
  Plus,
  Edit,
  Trash2,
  Upload,
  AlertTriangle,
} from "lucide-react"
import { push, ref } from "firebase/database"
import toast from "react-hot-toast"
import { useQuery } from "@tanstack/react-query"

import { db } from "@/lib/firebase"
import { Product } from "@/types"
import { fetchProducts } from "@/lib/products"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Products", href: "/products", icon: Package },
  { name: "Users", href: "/users", icon: Users },
  { name: "Hero Banners", href: "/banners", icon: ImageIcon },
  { name: "Revenue", href: "/revenue", icon: TrendingUp },
]

export default function ProductsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [products, setProducts] = useState<Product[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [images, setImages] = useState<File[]>()
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    sizes: [],
    colors: [],
    category: "",
  })
  const pathname = usePathname()

  const [loading, setLoading] = useState(false)

  // const filteredProducts = products.filter((product) => {
  //   const matchesSearch =
  //     product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     product.id.toLowerCase().includes(searchTerm.toLowerCase())
  //   const matchesCategory = categoryFilter === "all" || product.category === categoryFilter
  //   return matchesSearch && matchesCategory
  // })

  // const searchTerm = null;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["products", searchTerm],
    // queryFn: ({ queryKey }) => fetchProducts(queryKey[0]),
    queryFn: fetchProducts
  })

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
    }).format(amount)
  }

  // Upload each image and return all URLs
  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = []

    if(images) {
      for (const file of images) {
        const base64 = await toBase64(file)
        const res = await fetch("/api/cloudinary-upload", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ file: base64 }),
        })

        const data = await res.json()
        if (data.url) urls.push(data.url)
      }

      return urls
    } else {
      return []
    }    
  }

  // Helper to convert File to base64
  function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
    })
  }

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price && newProduct.stock !== undefined) {
      setLoading(true)

      try {
        const uploadedUrls = await uploadImages();

        const product: Product = {
          name: newProduct.name,
          description: newProduct.description || "",
          price: newProduct.price,
          stock: newProduct.stock,
          sizes: newProduct.sizes || [],
          sizeOptions: newProduct.sizes || [],
          colors: newProduct.colors || [],
          category: newProduct.category || "Uncategorized",
          productImages: uploadedUrls
        }

        await push(ref(db, "products"), product)

        toast.success("Product created successfully!");
        // setTitle("")
        // setPrice("")
        // setImages([])
        // setVariants([{ size: "", color: "", stock: 0 }])
        setIsAddDialogOpen((prev) => !prev);
        window.location.reload();
      } catch (err) {
        console.error(err)
        toast.error("Failed to create product.");
      } finally {
        setLoading(false)
      }
      // setProducts([...products, product])
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setNewProduct(product)
  }

  const handleUpdateProduct = () => {
    if (editingProduct && newProduct.name && newProduct.price && newProduct.stock !== undefined) {
      const updatedProducts = products.map((product) =>
        product.id === editingProduct.id
          ? {
              ...product,
              name: newProduct.name!,
              description: newProduct.description || "",
              price: newProduct.price!,
              stock: newProduct.stock!,
              // lowStockThreshold: newProduct.lowStockThreshold || 10,
              sizes: newProduct.sizes || [],
              colors: newProduct.colors || [],
              category: newProduct.category || "Uncategorized",
              // image: newProduct.image || product.image,
            }
          : product,
      )
      setProducts(updatedProducts)
      setEditingProduct(null)
      setNewProduct({
        name: "",
        description: "",
        price: 0,
        stock: 0,
        // lowStockThreshold: 10,
        sizes: [],
        colors: [],
        category: "",
        // image: "",
      })
    }
  }

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((product) => product.id !== productId))
  }

  const categories = Array.from(new Set(products.map((product) => product.category)))

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
            <h2 className="font-heading text-2xl font-semibold text-foreground">Products Management</h2>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">Add New Product</DialogTitle>
                <DialogDescription>Create a new product for your Saint Paul collection.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input
                    id="name"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="Enter product name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    placeholder="Enter product description"
                    rows={3}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price (₦)</Label>
                    <Input
                      id="price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                      placeholder="e.g., Shirts, Blazers"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock Quantity</Label>
                    <Input
                      id="stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
                      placeholder="0"
                    />
                  </div>
                  {/* <div className="grid gap-2">
                    <Label htmlFor="lowStockThreshold">Low Stock Alert</Label>
                    <Input
                      id="lowStockThreshold"
                      type="number"
                      value={newProduct.lowStockThreshold}
                      onChange={(e) => setNewProduct({ ...newProduct, lowStockThreshold: Number(e.target.value) })}
                      placeholder="10"
                    />
                  </div> */}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="sizes">Available Sizes (comma-separated)</Label>
                  <Input
                    id="sizes"
                    value={newProduct.sizes?.join(", ")}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        sizes: e.target.value.split(",").map((size) => size.trim()),
                      })
                    }
                    placeholder="S, M, L, XL"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="colors">Available Colors (comma-separated)</Label>
                  <Input
                    id="colors"
                    value={newProduct.colors?.join(", ")}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        colors: e.target.value.split(",").map((color) => color.trim()),
                      })
                    }
                    placeholder="Black, White, Navy"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="image">Product Image URL</Label>
                  <div className="flex gap-2">
                    {/* <Input
                      id="image"
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({ ...newProduct, image: e.target.value })}
                      placeholder="Enter image URL or upload"
                    /> */}
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) => setImages(Array.from(e.target.files || []))}
                      className="w-full"
                      required
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddProduct}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Add Product
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Page content */}
        <main className="p-6">
          {/* Filters and Search */}
          <Card className="mb-6 border-border">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-card-foreground">Filter Products</CardTitle>
              <CardDescription className="text-muted-foreground">
                Search and filter products by category or name
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full md:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Products Table */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-card-foreground">
                Products ({ data ? data.length : 0})
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your product catalog and inventory
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="font-medium">Product</TableHead>
                      <TableHead className="font-medium">Category</TableHead>
                      <TableHead className="font-medium">Price</TableHead>
                      <TableHead className="font-medium">Stock</TableHead>
                      <TableHead className="font-medium">Sizes</TableHead>
                      <TableHead className="font-medium">Colors</TableHead>
                      <TableHead className="font-medium">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    { 
                      data && data.length ? 
                        data.map((product) => (
                          <TableRow key={product.id} className="hover:bg-muted/50">
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img
                                  src={product.productImages[0] || "/placeholder.svg"}
                                  alt={product.name}
                                  className="h-12 w-12 rounded-lg object-cover border"
                                />
                                <div>
                                  <div className="font-medium">{product.name}</div>
                                  <div className="text-sm text-muted-foreground">{product.id}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{product.category}</Badge>
                            </TableCell>
                            <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span>{product.stock}</span>
                                {/* {product.stock <= product.lowStockThreshold && (
                                  <AlertTriangle className="h-4 w-4 text-destructive" />
                                )} */}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {product.sizes.slice(0, 3).map((size) => (
                                  <Badge key={size} variant="secondary" className="text-xs">
                                    {size}
                                  </Badge>
                                ))}
                                {product.sizes.length > 3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{product.sizes.length - 3}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-wrap gap-1">
                                {product.colors.slice(0, 2).map((color) => (
                                  <Badge key={color} variant="outline" className="text-xs">
                                    {color}
                                  </Badge>
                                ))}
                                {product.colors.length > 2 && (
                                  <Badge variant="outline" className="text-xs">
                                    +{product.colors.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Dialog
                                  open={editingProduct?.id === product.id}
                                  onOpenChange={(open) => {
                                    if (!open) {
                                      setEditingProduct(null)
                                      setNewProduct({
                                        name: "",
                                        description: "",
                                        price: 0,
                                        stock: 0,
                                        sizes: [],
                                        colors: [],
                                        category: "",
                                      })
                                    }
                                  }}
                                >
                                  <DialogTrigger asChild>
                                    <Button variant="outline" size="sm" onClick={() => handleEditProduct(product)}>
                                      <Edit className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                                    <DialogHeader>
                                      <DialogTitle className="font-heading">Edit Product</DialogTitle>
                                      <DialogDescription>Update product information and inventory.</DialogDescription>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-name">Product Name</Label>
                                        <Input
                                          id="edit-name"
                                          value={newProduct.name}
                                          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-description">Description</Label>
                                        <Textarea
                                          id="edit-description"
                                          value={newProduct.description}
                                          onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                                          rows={3}
                                        />
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-price">Price (₦)</Label>
                                          <Input
                                            id="edit-price"
                                            type="number"
                                            value={newProduct.price}
                                            onChange={(e) =>
                                              setNewProduct({ ...newProduct, price: Number(e.target.value) })
                                            }
                                          />
                                        </div>
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-category">Category</Label>
                                          <Input
                                            id="edit-category"
                                            value={newProduct.category}
                                            onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                                          />
                                        </div>
                                      </div>
                                      <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                          <Label htmlFor="edit-stock">Stock Quantity</Label>
                                          <Input
                                            id="edit-stock"
                                            type="number"
                                            value={newProduct.stock}
                                            onChange={(e) =>
                                              setNewProduct({ ...newProduct, stock: Number(e.target.value) })
                                            }
                                          />
                                        </div>
                                        {/* <div className="grid gap-2">
                                          <Label htmlFor="edit-lowStockThreshold">Low Stock Alert</Label>
                                          <Input
                                            id="edit-lowStockThreshold"
                                            type="number"
                                            value={newProduct.lowStockThreshold}
                                            onChange={(e) =>
                                              setNewProduct({ ...newProduct, lowStockThreshold: Number(e.target.value) })
                                            }
                                          />
                                        </div> */}
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-sizes">Available Sizes (comma-separated)</Label>
                                        <Input
                                          id="edit-sizes"
                                          value={newProduct.sizes?.join(", ")}
                                          onChange={(e) =>
                                            setNewProduct({
                                              ...newProduct,
                                              sizes: e.target.value.split(",").map((size) => size.trim()),
                                            })
                                          }
                                        />
                                      </div>
                                      <div className="grid gap-2">
                                        <Label htmlFor="edit-colors">Available Colors (comma-separated)</Label>
                                        <Input
                                          id="edit-colors"
                                          value={newProduct.colors?.join(", ")}
                                          onChange={(e) =>
                                            setNewProduct({
                                              ...newProduct,
                                              colors: e.target.value.split(",").map((color) => color.trim()),
                                            })
                                          }
                                        />
                                      </div>
                                    </div>
                                    <DialogFooter>
                                      <Button
                                        variant="outline"
                                        onClick={() => {
                                          setEditingProduct(null)
                                          setNewProduct({
                                            name: "",
                                            description: "",
                                            price: 0,
                                            stock: 0,
                                            sizes: [],
                                            colors: [],
                                            category: "",
                                          })
                                        }}
                                      >
                                        Cancel
                                      </Button>
                                      <Button
                                        onClick={handleUpdateProduct}
                                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                                      >
                                        Update Product
                                      </Button>
                                    </DialogFooter>
                                  </DialogContent>
                                </Dialog>

                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-destructive hover:text-destructive bg-transparent"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() => handleDeleteProduct(product?.id || "")}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        )) : <p className="text-md text-gray-500 flex align-center justify-center items-center">No products for now.</p>
                    }

                    {/* {
                      isLoading && !data && <p className="text-lg text-gray-500 flex align-center justify-center items-center">Loading...</p>
                    } */}
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
