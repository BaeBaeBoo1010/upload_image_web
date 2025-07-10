import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const tempPath = `/tmp/${file.name}`;
  await fs.promises.writeFile(tempPath, buffer);

  try {
    const result = await cloudinary.uploader.upload(tempPath, {
      folder: "nextjs_uploads", // tên folder trong Cloudinary
    });

    await fs.promises.unlink(tempPath); // Xoá file sau khi upload

    return NextResponse.json({ url: result.secure_url });
  } catch (error) {
    console.error(error);
  return NextResponse.json({ error: "Lỗi khi upload ảnh" }, { status: 500 });
  }
}
