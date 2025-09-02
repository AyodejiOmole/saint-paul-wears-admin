"use client"

import { useState } from "react"
import { ref, push } from "firebase/database"
import { db } from "@/lib/firebase"

export default function CreateProductPage() {
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState("")
  const [images, setImages] = useState<File[]>([])
  const [variants, setVariants] = useState([
    { size: "", color: "", stock: 0 }
  ])
  const [loading, setLoading] = useState(false)

  // Upload each image and return all URLs
  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = []

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
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const uploadedUrls = await uploadImages()

      const product = {
        title,
        price: parseFloat(price),
        images: uploadedUrls,
        // variations,
        createdAt: Date.now(),
      }

      await push(ref(db, "products"), product)

      alert("Product created successfully!")
      setTitle("")
      setPrice("")
      setImages([])
      setVariants([{ size: "", color: "", stock: 0 }])
    } catch (err) {
      console.error(err)
      alert("Failed to create product.")
    } finally {
      setLoading(false)
    }
  }

  const updateVariant = (index: number, key: keyof typeof variants[0], value: string | number) => {
    setVariants(prev => {
      const newVariants = [...prev]
    //   newVariants[index][key] = value
      return newVariants
    })
  }

  const addVariant = () => {
    setVariants([...variants, { size: "", color: "", stock: 0 }])
  }

  const removeVariant = (index: number) => {
    setVariants(prev => prev.filter((_, i) => i !== index))
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">Create Product</h1>

      <input
        type="text"
        placeholder="Product Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        className="w-full p-2 border"
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
        className="w-full p-2 border"
      />

      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(Array.from(e.target.files || []))}
        className="w-full"
        required
      />

      <div>
        <h2 className="font-semibold">Variants</h2>
        {variants.map((variant, index) => (
          <div key={index} className="flex gap-2 items-center my-2">
            <input
              type="text"
              placeholder="Size"
              value={variant.size}
              onChange={(e) => updateVariant(index, "size", e.target.value)}
              className="p-2 border"
              required
            />
            <input
              type="text"
              placeholder="Color"
              value={variant.color}
              onChange={(e) => updateVariant(index, "color", e.target.value)}
              className="p-2 border"
              required
            />
            <input
              type="number"
              placeholder="Stock"
              value={variant.stock}
              onChange={(e) => updateVariant(index, "stock", parseInt(e.target.value))}
              className="p-2 border"
              required
              min={0}
            />
            <button type="button" onClick={() => removeVariant(index)} className="text-red-500">X</button>
          </div>
        ))}
        <button type="button" onClick={addVariant} className="text-blue-500">
          + Add Variant
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-black text-white p-3 w-full"
      >
        {loading ? "Uploading..." : "Create Product"}
      </button>
    </form>
  )
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
