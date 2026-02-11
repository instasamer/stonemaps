'use client';

import { useState } from 'react';
import { ProfileImage } from '@/lib/types';
import { X } from 'lucide-react';

interface Props {
  images: ProfileImage[];
}

export default function ProfileGallery({ images }: Props) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (images.length === 0) return null;

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setSelectedImage(img.url)}
            className="aspect-square rounded-xl overflow-hidden hover:opacity-90 transition"
          >
            <img src={img.url} alt={img.caption || ''} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white transition"
            onClick={() => setSelectedImage(null)}
          >
            <X size={28} />
          </button>
          <img
            src={selectedImage}
            alt=""
            className="max-w-full max-h-[85vh] object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}
