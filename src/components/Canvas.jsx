import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Plus, RotateCw, Trash2, Move, ZoomIn, ZoomOut } from 'lucide-react';

export default function Canvas() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleImageUpload = useCallback((e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const newImage = {
            id: Date.now() + Math.random(),
            src: event.target.result,
            x: 50,
            y: 50,
            width: 150,
            height: 150,
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  }, []);

//   Same as other
  const handleMouseDown = useCallback((e, imageId) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const img = images.find(img => img.id === imageId);
    if (img) {
      setSelectedImage(imageId);
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - rect.left - img.x,
        y: e.clientY - rect.top - img.y,
      });
    }
  }, [images]);

  useEffect(() => {
    const handleMove = (e) => {
      if (isDragging && selectedImage) {
        const rect = canvasRef.current.getBoundingClientRect();
        const newX = e.clientX - rect.left - dragOffset.x;
        const newY = e.clientY - rect.top - dragOffset.y;
        setImages((prev) =>
          prev.map((img) =>
            img.id === selectedImage
              ? { ...img, x: newX, y: newY }
              : img
          )
        );
      }
    };
    const handleUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, selectedImage, dragOffset]);

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
    <>
    <div>
      <div className='login-button'>
        <button className="button-55" role="button">Login</button>
      </div>

      <div className="buttons-container">

        {/* "Add Images" button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="button-55"
        >
          <Plus className="w-4 h-4" />
          Add Image(s)
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

      </div>
    </div>

    <div>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        multiple
        onChange={handleImageUpload}
      />
      <div
        ref={canvasRef}
        style={{
          border: '2px solid black',
          height: '80vh',
          width: '90vw',
          marginTop: '20px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {images.map((img) => (
          <div
            key={img.id}
            onMouseDown={(e) => handleMouseDown(e, img.id)}
            style={{
              position: 'absolute',
              left: img.x,
              top: img.y,
              width: img.width,
              height: img.height,
              cursor: 'move',
              border: selectedImage === img.id ? '2px solid blue' : '1px solid gray',
            }}
          >
            <img
              src={img.src}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                userSelect: 'none',
                pointerEvents: 'none',
              }}
              draggable={false}
            />
          </div>
        ))}
      </div>
    </div>
    </>
  );
}
