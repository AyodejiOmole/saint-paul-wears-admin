// import type { NextApiRequest, NextApiResponse } from "next"
// import { v2 as cloudinary } from "cloudinary"

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
//   api_key: process.env.CLOUDINARY_API_KEY!,
//   api_secret: process.env.CLOUDINARY_API_SECRET!,
// })

// export const config = {
//   api: {
//     bodyParser: {
//       sizeLimit: "10mb", // allow big files
//     },
//   },
// }

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Method not allowed" })
//   }

//   const { file } = req.body

//   try {
//     const uploadResponse = await cloudinary.uploader.upload(file, {
//       folder: "products",
//     })

//     return res.status(200).json({ url: uploadResponse.secure_url })
//   } catch (error) {
//     console.error("Cloudinary Upload Error:", error)
//     return res.status(500).json({ error: "Upload failed" })
//   }
// }

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

