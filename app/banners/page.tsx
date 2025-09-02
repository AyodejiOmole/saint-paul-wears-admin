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
import { Switch } from "@/components/ui/switch"
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
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye,
  Star,
} from "lucide-react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Products", href: "/products", icon: Package },
  { name: "Users", href: "/users", icon: Users },
  { name: "Hero Banners", href: "/banners", icon: ImageIcon },
  { name: "Revenue", href: "/revenue", icon: TrendingUp },
]

// Mock banners data
const mockBanners = [
  {
    id: "BANNER-001",
    name: "Spring Collection 2024",
    image: "/luxury-fashion-hero-banner.png",
    tagline: "Discover Elegance Redefined",
    subtitle: "Explore our latest collection of premium fashion pieces crafted for the modern gentleman.",
    ctaText: "Shop Collection",
    ctaLink: "/collection/spring-2024",
    isActive: true,
    position: "center",
    textColor: "white",
    overlayOpacity: 40,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-16",
  },
  {
    id: "BANNER-002",
    name: "Premium Suits Campaign",
    image: "/elegant-suit-showcase.png",
    tagline: "Tailored to Perfection",
    subtitle: "Experience the finest craftsmanship in our bespoke suit collection.",
    ctaText: "Book Consultation",
    ctaLink: "/consultation",
    isActive: false,
    position: "left",
    textColor: "white",
    overlayOpacity: 50,
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
  },
  {
    id: "BANNER-003",
    name: "Accessories Spotlight",
    image: "/luxury-accessories-display.png",
    tagline: "Complete Your Look",
    subtitle: "Premium accessories that make the difference in your style statement.",
    ctaText: "View Accessories",
    ctaLink: "/accessories",
    isActive: false,
    position: "right",
    textColor: "black",
    overlayOpacity: 20,
    createdAt: "2024-01-08",
    updatedAt: "2024-01-09",
  },
]

interface Banner {
  id: string
  name: string
  image: string
  tagline: string
  subtitle: string
  ctaText: string
  ctaLink: string
  isActive: boolean
  position: "left" | "center" | "right"
  textColor: "white" | "black"
  overlayOpacity: number
  createdAt: string
  updatedAt: string
}

export default function BannersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [banners, setBanners] = useState<Banner[]>([])
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null)
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    name: "",
    image: "",
    tagline: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    isActive: false,
    position: "center",
    textColor: "white",
    overlayOpacity: 40,
  })
  const pathname = usePathname()

  const activeBanner = banners.find((banner) => banner.isActive)

  const handleAddBanner = () => {
    if (newBanner.name && newBanner.image && newBanner.tagline) {
      const banner: Banner = {
        id: `BANNER-${String(banners.length + 1).padStart(3, "0")}`,
        name: newBanner.name,
        image: newBanner.image,
        tagline: newBanner.tagline,
        subtitle: newBanner.subtitle || "",
        ctaText: newBanner.ctaText || "",
        ctaLink: newBanner.ctaLink || "",
        isActive: newBanner.isActive || false,
        position: newBanner.position || "center",
        textColor: newBanner.textColor || "white",
        overlayOpacity: newBanner.overlayOpacity || 40,
        createdAt: new Date().toISOString().split("T")[0],
        updatedAt: new Date().toISOString().split("T")[0],
      }

      // If setting as active, deactivate others
      let updatedBanners = banners
      if (banner.isActive) {
        updatedBanners = banners.map((b) => ({ ...b, isActive: false }))
      }

      setBanners([...updatedBanners, banner])
      setNewBanner({
        name: "",
        image: "",
        tagline: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        isActive: false,
        position: "center",
        textColor: "white",
        overlayOpacity: 40,
      })
      setIsAddDialogOpen(false)
    }
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setNewBanner(banner)
  }

  const handleUpdateBanner = () => {
    if (editingBanner && newBanner.name && newBanner.image && newBanner.tagline) {
      let updatedBanners = banners.map((banner) =>
        banner.id === editingBanner.id
          ? {
              ...banner,
              name: newBanner.name!,
              image: newBanner.image!,
              tagline: newBanner.tagline!,
              subtitle: newBanner.subtitle || "",
              ctaText: newBanner.ctaText || "",
              ctaLink: newBanner.ctaLink || "",
              isActive: newBanner.isActive || false,
              position: newBanner.position || "center",
              textColor: newBanner.textColor || "white",
              overlayOpacity: newBanner.overlayOpacity || 40,
              updatedAt: new Date().toISOString().split("T")[0],
            }
          : banner,
      )

      // If setting as active, deactivate others
      if (newBanner.isActive) {
        updatedBanners = updatedBanners.map((b) => (b.id === editingBanner.id ? b : { ...b, isActive: false }))
      }

      setBanners(updatedBanners)
      setEditingBanner(null)
      setNewBanner({
        name: "",
        image: "",
        tagline: "",
        subtitle: "",
        ctaText: "",
        ctaLink: "",
        isActive: false,
        position: "center",
        textColor: "white",
        overlayOpacity: 40,
      })
    }
  }

  const handleDeleteBanner = (bannerId: string) => {
    setBanners(banners.filter((banner) => banner.id !== bannerId))
  }

  const handleSetActive = (bannerId: string) => {
    setBanners(
      banners.map((banner) => ({
        ...banner,
        isActive: banner.id === bannerId,
      })),
    )
  }

  const BannerPreview = ({ banner }: { banner: Banner }) => (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <img src={banner.image || "/placeholder.svg"} alt={banner.name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-black" style={{ opacity: banner.overlayOpacity / 100 }} />
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center p-8",
          banner.position === "left" && "items-start text-left",
          banner.position === "center" && "items-center text-center",
          banner.position === "right" && "items-end text-right",
        )}
      >
        <h1
          className={cn(
            "font-heading text-4xl md:text-6xl font-bold mb-4",
            banner.textColor === "white" ? "text-white" : "text-black",
          )}
        >
          {banner.tagline}
        </h1>
        {banner.subtitle && (
          <p
            className={cn(
              "text-lg md:text-xl mb-6 max-w-2xl",
              banner.textColor === "white" ? "text-white/90" : "text-black/90",
            )}
          >
            {banner.subtitle}
          </p>
        )}
        {banner.ctaText && (
          <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 text-lg">
            {banner.ctaText}
          </Button>
        )}
      </div>
    </div>
  )

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
            <h2 className="font-heading text-2xl font-semibold text-foreground">Hero Section Manager</h2>
          </div>

          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90">
                <Plus className="h-4 w-4 mr-2" />
                Add Banner
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="font-heading">Create New Hero Banner</DialogTitle>
                <DialogDescription>Design a new hero banner for your Saint Paul website.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Banner Name</Label>
                  <Input
                    id="name"
                    value={newBanner.name}
                    onChange={(e) => setNewBanner({ ...newBanner, name: e.target.value })}
                    placeholder="Enter banner name for internal reference"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Banner Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      value={newBanner.image}
                      onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                      placeholder="Enter image URL or upload"
                    />
                    <Button variant="outline" size="sm">
                      <Upload className="h-4 w-4" />
                    </Button>
                  </div>
                  {newBanner.image && (
                    <div className="mt-2">
                      <img
                        src={newBanner.image || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  )}
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="tagline">Main Tagline</Label>
                  <Input
                    id="tagline"
                    value={newBanner.tagline}
                    onChange={(e) => setNewBanner({ ...newBanner, tagline: e.target.value })}
                    placeholder="Enter main headline text"
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="subtitle">Subtitle (Optional)</Label>
                  <Textarea
                    id="subtitle"
                    value={newBanner.subtitle}
                    onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                    placeholder="Enter supporting text"
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="ctaText">CTA Button Text</Label>
                    <Input
                      id="ctaText"
                      value={newBanner.ctaText}
                      onChange={(e) => setNewBanner({ ...newBanner, ctaText: e.target.value })}
                      placeholder="e.g., Shop Now"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="ctaLink">CTA Link</Label>
                    <Input
                      id="ctaLink"
                      value={newBanner.ctaLink}
                      onChange={(e) => setNewBanner({ ...newBanner, ctaLink: e.target.value })}
                      placeholder="e.g., /collection"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="position">Text Position</Label>
                    <Select
                      value={newBanner.position}
                      onValueChange={(value: "left" | "center" | "right") =>
                        setNewBanner({ ...newBanner, position: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="left">Left</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="right">Right</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="textColor">Text Color</Label>
                    <Select
                      value={newBanner.textColor}
                      onValueChange={(value: "white" | "black") => setNewBanner({ ...newBanner, textColor: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="white">White</SelectItem>
                        <SelectItem value="black">Black</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="overlayOpacity">Overlay Opacity (%)</Label>
                    <Input
                      id="overlayOpacity"
                      type="number"
                      min="0"
                      max="80"
                      value={newBanner.overlayOpacity}
                      onChange={(e) => setNewBanner({ ...newBanner, overlayOpacity: Number(e.target.value) })}
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="isActive"
                    checked={newBanner.isActive}
                    onCheckedChange={(checked) => setNewBanner({ ...newBanner, isActive: checked })}
                  />
                  <Label htmlFor="isActive">Set as active banner</Label>
                </div>

                {/* Preview */}
                {newBanner.image && newBanner.tagline && (
                  <div className="grid gap-2">
                    <Label>Preview</Label>
                    <BannerPreview banner={newBanner as Banner} />
                  </div>
                )}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleAddBanner}
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                >
                  Create Banner
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Page content */}
        <main className="p-6">
          {/* Active Banner Preview */}
          {activeBanner && (
            <Card className="mb-6 border-accent/20 bg-accent/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-accent font-heading">
                  <Star className="h-5 w-5" />
                  Currently Active Banner
                </CardTitle>
                <CardDescription>This banner is currently displayed on your website.</CardDescription>
              </CardHeader>
              <CardContent>
                <BannerPreview banner={activeBanner} />
                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{activeBanner.name}</h3>
                    <p className="text-sm text-muted-foreground">Last updated: {activeBanner.updatedAt}</p>
                  </div>
                  <Button variant="outline" onClick={() => handleEditBanner(activeBanner)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* All Banners */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="font-heading text-lg text-card-foreground">
                All Hero Banners ({banners.length})
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                Manage your hero section banners and content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {banners.map((banner) => (
                  <Card key={banner.id} className="overflow-hidden">
                    <div className="relative">
                      <img
                        src={banner.image || "/placeholder.svg"}
                        alt={banner.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2 flex gap-2">
                        {banner.isActive && (
                          <Badge className="bg-accent text-accent-foreground">
                            <Star className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h3 className="font-medium text-card-foreground">{banner.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{banner.tagline}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {banner.position}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {banner.textColor}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Dialog
                          open={previewBanner?.id === banner.id}
                          onOpenChange={(open) => !open && setPreviewBanner(null)}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setPreviewBanner(banner)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-5xl">
                            <DialogHeader>
                              <DialogTitle className="font-heading">Banner Preview</DialogTitle>
                              <DialogDescription>
                                Preview how "{banner.name}" will appear on your website.
                              </DialogDescription>
                            </DialogHeader>
                            <BannerPreview banner={banner} />
                          </DialogContent>
                        </Dialog>

                        <Dialog
                          open={editingBanner?.id === banner.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setEditingBanner(null)
                              setNewBanner({
                                name: "",
                                image: "",
                                tagline: "",
                                subtitle: "",
                                ctaText: "",
                                ctaLink: "",
                                isActive: false,
                                position: "center",
                                textColor: "white",
                                overlayOpacity: 40,
                              })
                            }
                          }}
                        >
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => handleEditBanner(banner)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="font-heading">Edit Hero Banner</DialogTitle>
                              <DialogDescription>Update banner content and settings.</DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-6 py-4">
                              <div className="grid gap-2">
                                <Label htmlFor="edit-name">Banner Name</Label>
                                <Input
                                  id="edit-name"
                                  value={newBanner.name}
                                  onChange={(e) => setNewBanner({ ...newBanner, name: e.target.value })}
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="edit-image">Banner Image</Label>
                                <div className="flex gap-2">
                                  <Input
                                    id="edit-image"
                                    value={newBanner.image}
                                    onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                                  />
                                  <Button variant="outline" size="sm">
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </div>
                                {newBanner.image && (
                                  <div className="mt-2">
                                    <img
                                      src={newBanner.image || "/placeholder.svg"}
                                      alt="Preview"
                                      className="w-full h-32 object-cover rounded border"
                                    />
                                  </div>
                                )}
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="edit-tagline">Main Tagline</Label>
                                <Input
                                  id="edit-tagline"
                                  value={newBanner.tagline}
                                  onChange={(e) => setNewBanner({ ...newBanner, tagline: e.target.value })}
                                />
                              </div>

                              <div className="grid gap-2">
                                <Label htmlFor="edit-subtitle">Subtitle</Label>
                                <Textarea
                                  id="edit-subtitle"
                                  value={newBanner.subtitle}
                                  onChange={(e) => setNewBanner({ ...newBanner, subtitle: e.target.value })}
                                  rows={2}
                                />
                              </div>

                              <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-ctaText">CTA Button Text</Label>
                                  <Input
                                    id="edit-ctaText"
                                    value={newBanner.ctaText}
                                    onChange={(e) => setNewBanner({ ...newBanner, ctaText: e.target.value })}
                                  />
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-ctaLink">CTA Link</Label>
                                  <Input
                                    id="edit-ctaLink"
                                    value={newBanner.ctaLink}
                                    onChange={(e) => setNewBanner({ ...newBanner, ctaLink: e.target.value })}
                                  />
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-4">
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-position">Text Position</Label>
                                  <Select
                                    value={newBanner.position}
                                    onValueChange={(value: "left" | "center" | "right") =>
                                      setNewBanner({ ...newBanner, position: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="left">Left</SelectItem>
                                      <SelectItem value="center">Center</SelectItem>
                                      <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-textColor">Text Color</Label>
                                  <Select
                                    value={newBanner.textColor}
                                    onValueChange={(value: "white" | "black") =>
                                      setNewBanner({ ...newBanner, textColor: value })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="white">White</SelectItem>
                                      <SelectItem value="black">Black</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="grid gap-2">
                                  <Label htmlFor="edit-overlayOpacity">Overlay Opacity (%)</Label>
                                  <Input
                                    id="edit-overlayOpacity"
                                    type="number"
                                    min="0"
                                    max="80"
                                    value={newBanner.overlayOpacity}
                                    onChange={(e) =>
                                      setNewBanner({ ...newBanner, overlayOpacity: Number(e.target.value) })
                                    }
                                  />
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Switch
                                  id="edit-isActive"
                                  checked={newBanner.isActive}
                                  onCheckedChange={(checked) => setNewBanner({ ...newBanner, isActive: checked })}
                                />
                                <Label htmlFor="edit-isActive">Set as active banner</Label>
                              </div>

                              {/* Preview */}
                              {newBanner.image && newBanner.tagline && (
                                <div className="grid gap-2">
                                  <Label>Preview</Label>
                                  <BannerPreview banner={newBanner as Banner} />
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button
                                variant="outline"
                                onClick={() => {
                                  setEditingBanner(null)
                                  setNewBanner({
                                    name: "",
                                    image: "",
                                    tagline: "",
                                    subtitle: "",
                                    ctaText: "",
                                    ctaLink: "",
                                    isActive: false,
                                    position: "center",
                                    textColor: "white",
                                    overlayOpacity: 40,
                                  })
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                onClick={handleUpdateBanner}
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
                              >
                                Update Banner
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>

                        {!banner.isActive && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSetActive(banner.id)}
                            className="text-accent hover:text-accent"
                          >
                            <Star className="h-4 w-4" />
                          </Button>
                        )}

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
                              <AlertDialogTitle>Delete Banner</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{banner.name}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDeleteBanner(banner.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
