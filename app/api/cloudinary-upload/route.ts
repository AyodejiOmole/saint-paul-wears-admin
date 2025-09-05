import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
})

// App Router API route format
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { file } = body

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const result = await cloudinary.uploader.upload(file, {
      folder: "products",
    })

    return NextResponse.json({ url: result.secure_url })
  } catch (error) {
    console.error("Cloudinary Upload Error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}

