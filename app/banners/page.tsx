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
import toast from "react-hot-toast"
import { push, ref } from "firebase/database"
import { useQuery } from "@tanstack/react-query"
import { fetchBanners, updateBanner } from "@/lib/banners"

import { toBase64 } from "@/lib/utils"
import { Banner } from "@/types"
import { db } from "@/lib/firebase"
import { deleteBanner } from "@/lib/banners"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Products", href: "/products", icon: Package },
  { name: "Users", href: "/users", icon: Users },
  { name: "Hero Banners", href: "/banners", icon: ImageIcon },
  { name: "Revenue", href: "/revenue", icon: TrendingUp },
]

export default function BannersPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null)
  const [previewBanner, setPreviewBanner] = useState<Banner | null>(null)
  const [newBanner, setNewBanner] = useState<Partial<Banner>>({
    image: "",
    tagline: "",
    subtitle: "",
    ctaText: "",
    ctaLink: "",
    isActive: false,
    header: "",
    secondaryText: "",
  })
  const pathname = usePathname()
  const [image, setImage] = useState<File>();
  const [loading, setLoading] = useState<boolean>(false);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["banners"],
    queryFn: fetchBanners
  })

  let banners = data ?? [];

  const activeBanner = banners.find((banner) => banner.isActive)

  // Upload each image and return all URLs
  const uploadImages = async (): Promise<string> => {
    let url: string;

    if(image) {
      const base64 = await toBase64(image)
      const res = await fetch("/api/cloudinary-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ file: base64 }),
      })

      const data = await res.json()
      if (data.url) url = data.url;
  
      return data.url;
    }  
    
    return "";
  }

  const handleAddBanner = async () => {
    if (newBanner.header && newBanner.secondaryText && image) {
      setLoading(true);
      // toast.loading("Creating...");

      try {
        const uploadedUrls = await uploadImages();

        const banner: Partial<Banner> = {
          header: newBanner.header,
          secondaryText: newBanner.secondaryText,
          image: uploadedUrls,
          createdAt: new Date().toISOString().split("T")[0],
          updatedAt: new Date().toISOString().split("T")[0]
        }

        await push(ref(db, "banners"), banner)

        toast.success("Banner created successfully!");

        setNewBanner({
          image: "",
          tagline: "",
          subtitle: "",
          ctaText: "",
          ctaLink: "",
          isActive: false,
          header: "",
          secondaryText: "",
        })

        setIsAddDialogOpen((prev) => !prev);
        window.location.reload();
      } catch (err) {
        console.error(err)
        toast.error("Failed to create banner.");
      } finally {
        setLoading(false)
      }
    }
  }

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner)
    setNewBanner(banner)
  }

  const handleUpdateBanner = async () => {
    if (editingBanner && newBanner.header && newBanner.image && newBanner.secondaryText) {
      try {
        const updatedBanner = {
            image: editingBanner.image!,
            isActive: newBanner.isActive || false,
            header: newBanner.header || "",
            secondaryText: newBanner.secondaryText || ""
        }

        await updateBanner(editingBanner.id ?? "", updatedBanner);

        toast.success("Banner updated");

        setEditingBanner(null)
        setNewBanner({
          image: "",
          isActive: false,
          header: "",
          secondaryText: "",
        })
      } catch(error) {
        console.log("Error updating banner, ", error instanceof Error ? error.message : "Failed to update error.");
        toast.error(error instanceof Error ? error.message : "Failed to update banner.");
      }
    }
  }

  const handleDeleteBanner = async (bannerId: string) => {
    toast.loading("Deleting banner...");

    try {
      const result = await deleteBanner(bannerId);

      toast.dismiss();
      if(result.success) {
        toast.success(result.message);
        banners = banners.filter((banner) => banner.id !== bannerId)
      } else {
        toast.error(result.message);
      }
    } catch(error) {
      console.log("Error deleting banner: ", error)
      toast.dismiss();
      toast.error("Failed to delete banner");
    }
  }

  const handleSetActive = (bannerId: string) => {
    banners = banners.map((banner) => ({
        ...banner,
        isActive: banner.id === bannerId,
    }))
  }

  const BannerPreview = ({ banner }: { banner: Banner }) => (
    <div className="relative w-full h-96 rounded-lg overflow-hidden">
      <img src={banner.image || "/placeholder.svg"} alt={banner.header} className="w-full h-full object-cover" />
      {/* <div className="absolute inset-0 bg-black" style={{ opacity: banner.overlayOpacity / 100 }} /> */}
      <div
        className={cn(
          "absolute inset-0 flex flex-col justify-center p-8",
          // banner.position === "left" && "items-start text-left",
          // banner.position === "center" && "items-center text-center",
          // banner.position === "right" && "items-end text-right",
        )}
      >
        <h1
          className={cn(
            "font-heading text-4xl md:text-6xl font-bold mb-4",
            // banner.textColor === "white" ? "text-white" : "text-black",
          )}
        >
          {banner.tagline}
        </h1>
        {banner.secondaryText && (
          <p
            className={cn(
              "text-lg md:text-xl mb-6 max-w-2xl   text-white/90",
              // banner.textColor === "white" ? "text-white/90" : "text-black/90",
            )}
          >
            {banner.secondaryText}
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
                  <Label htmlFor="name">Banner Header</Label>
                  <Input
                    id="name"
                    value={newBanner.header}
                    onChange={(e) => setNewBanner({ ...newBanner, header: e.target.value })}
                    placeholder="Enter banner header for internal reference"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="name">Banner Secondary Text</Label>
                  <Input
                    id="name"
                    value={newBanner.secondaryText}
                    onChange={(e) => setNewBanner({ ...newBanner, secondaryText: e.target.value })}
                    placeholder="Enter banner secondary text"
                    required
                  />
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="image">Banner Image</Label>
                  <div className="flex gap-2">
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      value={newBanner.image}
                      // onChange={(e) => setNewBanner({ ...newBanner, image: e.target.value })}
                      onChange={(e) => setImage(e.target.files![0])}
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

                {/* <div className="grid gap-2">
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
                </div> */}

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
                  disabled={loading}
                >
                  {loading ? "Creating banner..." : "Create Banner"}
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
                  {/* <div>
                    <h3 className="font-medium">{activeBanner.name}</h3>
                    <p className="text-sm text-muted-foreground">Last updated: {activeBanner.updatedAt}</p>
                  </div> */}
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
                { !isLoading && banners && banners.length ?
                  banners.map((banner, index) => (
                    <Card key={banner.id} className="overflow-hidden">
                      <div className="relative">
                        <img
                          src={banner.image || "/placeholder.svg"}
                          alt={`Banner-${index + 1}`}
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
                          <h3 className="font-medium text-card-foreground">{banner.header}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{banner.secondaryText}</p>
                          {/* <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-xs">
                              {banner.position}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {banner.textColor}
                            </Badge>
                          </div> */}
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
                                  Preview how "{`Banner-${index + 1}`}" will appear on your website.
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
                                  image: "",
                                  tagline: "",
                                  subtitle: "",
                                  ctaText: "",
                                  ctaLink: "",
                                  isActive: false,
                                  header: "",
                                  secondaryText: "",
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
                                  <Label htmlFor="edit-name">Banner Header</Label>
                                  <Input
                                    id="edit-header"
                                    value={newBanner.header}
                                    onChange={(e) => setNewBanner({ ...newBanner, header: e.target.value })}
                                  />
                                </div>

                                <div className="grid gap-2">
                                  <Label htmlFor="edit-name">Banner Secondary Text</Label>
                                  <Input
                                    id="edit-scondaryText"
                                    value={newBanner.secondaryText}
                                    onChange={(e) => setNewBanner({ ...newBanner, secondaryText: e.target.value })}
                                  />
                                </div>

                                <div className="grid gap-2">
                                  <Label htmlFor="edit-image">Banner Image</Label>
                                  <div className="flex gap-2">
                                    <Input
                                      id="edit-image"
                                      type="file"
                                      // value={image}
                                      required
                                      accept="image/*"
                                      onChange={(e) => setImage(e.target.files![0])}
                                    />
                                    <Button variant="outline" size="sm">
                                      <Upload className="h-4 w-4" />
                                    </Button>
                                  </div>
                                  {image && (
                                    <div className="mt-2">
                                      <img
                                        src={image || "/placeholder.svg"}
                                        alt="Preview"
                                        className="w-full h-32 object-cover rounded border"
                                      />
                                    </div>
                                  )}
                                </div>

                                {/* <div className="grid gap-2">
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
                                </div> */}

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
                                      image: "",
                                      tagline: "",
                                      subtitle: "",
                                      ctaText: "",
                                      ctaLink: "",
                                      isActive: false,
                                      header: "",
                                      secondaryText: ""
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
                              onClick={() => handleSetActive(banner.id ?? "")}
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
                                  Are you sure you want to delete "{`Banner-${index}`}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDeleteBanner(banner.id ?? "")}
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
                  )) : <p className="text-md text-gray-500 flex align-center justify-center items-center">No banners for now.</p>
                }

                {
                  isLoading && !data && <p className="text-lg text-gray-500 flex align-center justify-center items-center">Loading...</p>
                }
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}
