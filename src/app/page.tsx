"use client";

import { useState } from "react";
import axios from "axios";
import Image from "next/image";


export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setUrl("");
    }
  };

  const handleUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("file", image);
    setLoading(true);

    try {
      const res = await axios.post("/api/upload", formData);
      setUrl(res.data.url);
    } catch {
      alert("Upload thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm p-6 rounded-xl shadow-lg space-y-5">
        <h1 className="text-xl font-bold text-center text-gray-800">
          Upload ảnh lên Cloudinary
        </h1>

        <input
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {preview && (
          <div className="flex justify-center">
            <Image
              src={preview}
              alt="Preview"
              width={96}
              height={96}
              className="object-contain rounded border"
            />
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={loading || !image}
          className={`w-full py-2 rounded-md text-white font-semibold transition ${
            loading || !image
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {loading ? "Đang upload..." : "Upload"}
        </button>

        {url && (
          <div className="text-center space-y-2 pt-4 border-t">
            <p className="text-sm text-gray-600">Ảnh đã upload:</p>
            <div className="w-24 h-24 relative rounded-lg mx-auto overflow-hidden border">
              <Image src={url} alt="Uploaded" fill className="object-cover" />
            </div>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 text-sm underline"
            >
              Xem ảnh gốc
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
