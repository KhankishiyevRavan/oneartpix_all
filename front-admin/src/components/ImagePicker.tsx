// src/components/ImagePicker.tsx
import React, { useCallback, useRef, useState } from "react";

type Props = {
  value?: File | null;
  onChange: (file: File | null) => void;
  maxSizeMB?: number;            // default 5MB
  accept?: string[];             // default ["image/jpeg","image/png","image/webp"]
};

export default function ImagePicker({
  value = null,
  onChange,
  maxSizeMB = 5,
  accept = ["image/jpeg", "image/png", "image/webp"],
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const validate = (file: File) => {
    if (!accept.includes(file.type)) {
      return "Only JPG, PNG or WEBP files are allowed.";
    }
    const max = maxSizeMB * 1024 * 1024;
    if (file.size > max) {
      return `File exceeds ${maxSizeMB}MB.`;
    }
    return null;
  };

  const handleFile = (file: File | null) => {
    setError(null);
    if (!file) {
      onChange(null);
      setPreview(null);
      return;
    }
    const err = validate(file);
    if (err) {
      setError(err);
      onChange(null);
      setPreview(null);
      return;
    }
    onChange(file);
    const url = URL.createObjectURL(file);
    setPreview(url);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    handleFile(file ?? null);
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition
          ${dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        `}
        onClick={() => inputRef.current?.click()}
        role="button"
        aria-label="Select or drop an image"
      >
        <p className="font-medium">Drag & drop an image here or click to select</p>
        <p className="text-sm text-gray-500 mt-1">
          Supported: JPG, PNG, WEBP — up to {maxSizeMB}MB
        </p>

        {preview && (
          <div className="mt-4 flex justify-center">
            <img
              src={preview}
              alt="Preview"
              className="max-h-48 rounded-lg object-contain"
            />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={accept.join(",")}
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
      />

      {value && (
        <button
          type="button"
          onClick={() => handleFile(null)}
          className="self-start text-sm text-gray-600 underline"
        >
          Clear
        </button>
      )}

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );
}
