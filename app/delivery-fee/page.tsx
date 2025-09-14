"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  ImageIcon,
  X,
  Menu,
  Mail
} from "lucide-react"
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Orders", href: "/orders", icon: ShoppingBag },
  { name: "Products", href: "/products", icon: Package },
  { name: "Users", href: "/users", icon: Users },
  { name: "Hero Banners", href: "/banners", icon: ImageIcon },
  { name: "Newsletters", href: "/newsletters", icon: Mail},
  { name: "Delivery Fees", href: "/delivery-fee", icon: Package },
]

export default function AdminDeliveryFee() {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const pathname = usePathname()

    const [lagos, setLagos] = useState("");
    const [others, setOthers] = useState("");

    const handleSave = async () => {
        await fetch("/api/admin/delivery-fee", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ lagos: Number(lagos), others: Number(others) }),
        });

        toast.success("Updated!");
    };

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
        <div>
            {/* Top bar */}
            <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background px-6">
                <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                    <Menu className="h-5 w-5" />
                </Button>

                <div className="flex-1">
                    <h2 className="font-heading text-2xl font-semibold text-foreground">Delivery Fees</h2>
                </div>
            </div>

            <div className="flex-row gap-3 w-full shadow-lg rounded p-6">
                <input className="w-full border p-2 h-24 mb-2" type="number" placeholder="Lagos Fee" value={lagos} onChange={(e) => setLagos(e.target.value)} />
                <input className="w-full border p-2 h-24 mb-2" type="number" placeholder="Other States Fee" value={others} onChange={(e) => setOthers(e.target.value)} />
                <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={handleSave}>Save</button>
            </div>
        </div>
    </div>
  );
}
