import React, { useState, useRef, useCallback } from 'react';
import { Plus, RotateCw, Trash2, Move, ZoomIn, ZoomOut } from 'lucide-react';
import LoginButton from './Login Button.jsx'; 

const Canvas = () => {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const img = new Image();
          img.onload = () => {
            const newImage = {
              id: Date.now() + Math.random(),
              src: event.target.result,
              x: 50,
              y: 50,
              width: Math.min(img.width, 200),
              height: Math.min(img.height, 200),
              rotation: 0,
              originalWidth: img.width,
              originalHeight: img.height
            };
            setImages(prev => [...prev, newImage]);
          };
          img.src = event.target.result;
        };
        reader.readAsDataURL(file);
      }
    });
    
    e.target.value = '';
  }, []);

  const handleMouseDown = useCallback((e, imageId) => {
    e.preventDefault();
    const rect = canvasRef.current.getBoundingClientRect();
    const image = images.find(img => img.id === imageId);
    
    if (image) {
      setSelectedImage(imageId);
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left - image.x,
        y: e.clientY - rect.top - image.y
      });
    }
  }, [images]);

  const handleMouseMove = useCallback((e) => {
    if (selectedImage && isDragging) {
      const rect = canvasRef.current.getBoundingClientRect();
      const newX = e.clientX - rect.left - dragOffset.x;
      const newY = e.clientY - rect.top - dragOffset.y;
      
      setImages((prev) => prev.map((img) =>
        img.id === selectedImage ? { ...img, x: Math.max(0, newX), y: Math.max(0, newY) }: img
      ));
      console.log('Updated images:', images[0]['x'], images[0]['y']); // Debug

    }
  }, [isDragging, selectedImage, dragOffset]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const rotateImage = useCallback((imageId) => {
    setImages(prev => prev.map(img => 
      img.id === imageId 
        ? { ...img, rotation: (img.rotation + 90) % 360 }
        : img
    ));
  }, []);

  const scaleImage = useCallback((imageId, scaleFactor) => {
    setImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const newWidth = Math.max(50, img.width * scaleFactor);
        const newHeight = Math.max(50, img.height * scaleFactor);
        return { ...img, width: newWidth, height: newHeight };
      }
      return img;
    }));
  }, []);

  const deleteImage = useCallback((imageId) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    setSelectedImage(null);
  }, []);

  const clearCanvas = useCallback(() => {
    setImages([]);
    setSelectedImage(null);
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 bg-gray-50 rounded-lg">
      <div className="mb-4 flex flex-wrap gap-2">

        {/* "Add Images" button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="button-55"
        >
          <Plus className="w-4 h-4" />
          Add Images
        </button>
        
        {/* Clear Canvas button */}
        <button
          onClick={clearCanvas}
          className="button-55"
        >
          <Trash2 className="w-4 h-4" />
          Clear Canvas
        </button>

        {/* Transformation Buttons */}
        {selectedImage && (
          <>
            {/* Rotate Image */}
            <button
              onClick={() => rotateImage(selectedImage)}
              className="button-55"
            >
              <RotateCw className="w-4 h-4" />
              Rotate
            </button>
            
            {/* Scale Up Image */}
            <button
              onClick={() => scaleImage(selectedImage, 1.2)}
              className="button-55"
            >
              <ZoomIn className="w-4 h-4" />
              Bigger
            </button>
            
            {/* Scale Down Image */}
            <button
              onClick={() => scaleImage(selectedImage, 0.8)}
              className="button-55"
            >
              <ZoomOut className="w-4 h-4" />
              Smaller
            </button>
            
            {/* Delete Image */}            
            <button
              onClick={() => deleteImage(selectedImage)}
              className="button-55"
            >
              <Trash2 className="w-4 h-4" />
              Delete
            </button>
          </>
        )}

        <LoginButton />
      </div>

      {/* Hidden file input for image upload */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleImageUpload}
        style={{ display: 'none' }}
      />

      {/* Canvas area for images */}
      <div
        ref={canvasRef}
        style={{
          border: '2px solid black',
          outline: 'black 3px solid',
          height: '80vh',
          width: '90vw',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >

        {images.map((image) => (
          <div
            key={image.id}
            className={`absolute cursor-move select-none ${
              selectedImage === image.id ? 'ring-2 ring-blue-400' : ''
            }`}
            style={{
              left: image.x,
              top: image.y,
              width: image.width,
              height: image.height,
              transform: `rotate(${image.rotation}deg)`,
              transformOrigin: 'center'
            }}
            onMouseDown={(e) => handleMouseDown(e, image.id)}
          >
              {/* Image element */}
            <img
              src={image.src}
              alt="Collage item"
              className="object-cover rounded shadow-lg"
              style={{
                left: image.x,
                top: image.y,
                width: image.width,
                height: image.height
              }}
              draggable={false}
            />
            
            {/* Drag to move label */}
            {selectedImage === image.id && (
              <div className="absolute -top-8 left-0 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                <Move className="w-3 h-3 inline mr-1" />
                Drag to move
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Canvas;
