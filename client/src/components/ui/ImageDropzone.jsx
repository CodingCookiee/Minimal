import React from "react";
import { Upload, X } from "lucide-react";
import { useDropzone } from "react-dropzone";

const ImageDropzone = ({ onImageUpload, images, onImageRemove }) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".webp"] },
    multiple: true,
    onDrop: onImageUpload,
  });

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Product Images</h3>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-6 ${
          isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex items-center justify-start flex-wrap">
          {images.length > 0 ? (
            <div className="flex flex-wrap gap-5">
              {images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image.preview}
                    alt={`Preview ${index + 1}`}
                    className="lg:h-32 lg:w-32 w-16 h-16 object-contain rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onImageRemove(index);
                    }}
                    className="absolute -top-3 -right-2 p-1 bg-red-500 text-white rounded-full"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className=" flex flex-col items-center w-full h-full">
              <Upload className="w-8 h-8 mb-4 text-gray-500 mx-auto" />
              <p className="text-sm text-gray-500">
                Drag & drop images here, or click to select
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { ImageDropzone };
