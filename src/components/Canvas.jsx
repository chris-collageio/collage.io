import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Plus, RotateCw, Trash2, ZoomIn, ZoomOut } from 'lucide-react';

export default function Canvas() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [activeResize, setActiveResize] = useState(null);
  const [activeRotate, setActiveRotate] = useState(null);
  const [history, setHistory] = useState([]);
  const [future, setFuture] = useState([]);

  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);

  // Utility to update images + store history
  const updateImages = useCallback((updater) => {
    setImages(prev => {
      const newImages = typeof updater === 'function' ? updater(prev) : updater;
      if (JSON.stringify(newImages) !== JSON.stringify(prev)) {
        setHistory(h => [...h, prev]);
        setFuture([]);
      }
      return newImages;
    });
  }, []);

  // Upload handler
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
            rotation: 0,
          };
          updateImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      }
    });
    e.target.value = '';
  }, [updateImages]);

  // Move start
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

  // Resize start
  const handleResizeMouseDown = (e, corner, imageId) => {
    e.stopPropagation();
    const img = images.find(i => i.id === imageId);
    if (!img) return;
    setSelectedImage(imageId);
    setActiveResize({
      corner,
      imageId,
      prevX: e.clientX,
      prevY: e.clientY,
    });
  };

  // Rotate start
  const handleRotateMouseDown = (e, imageId) => {
    e.stopPropagation();
    const rect = canvasRef.current.getBoundingClientRect();
    const img = images.find(i => i.id === imageId);
    if (!img) return;

    const centerX = img.x + img.width / 2;
    const centerY = img.y + img.height / 2;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const startAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);

    setSelectedImage(imageId);
    setActiveRotate({
      imageId,
      startRotation: img.rotation,
      startAngle,
    });
  };

  // Handle movement, resizing, rotating
  useEffect(() => {
    const handleMove = (e) => {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (!rect) return;
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (isDragging && selectedImage) {
        updateImages(prev =>
          prev.map(img =>
            img.id === selectedImage
              ? { ...img, x: mouseX - dragOffset.x, y: mouseY - dragOffset.y }
              : img
          )
        );
      }

      if (activeResize) {
        const { prevX, prevY, corner, imageId } = activeResize;
        const dx = (e.clientX - prevX) * 0.4;
        const dy = (e.clientY - prevY) * 0.4;

        updateImages(prev =>
          prev.map(img => {
            if (img.id !== imageId) return img;

            let newWidth = img.width;
            let newHeight = img.height;
            let newX = img.x;
            let newY = img.y;

            if (corner === 'bottomRight') {
              newWidth = Math.max(50, img.width + dx);
              newHeight = Math.max(50, img.height + dy);
            } else if (corner === 'topLeft') {
              newWidth = Math.max(50, img.width - dx);
              newHeight = Math.max(50, img.height - dy);
              newX = img.x + dx;
              newY = img.y + dy;
            }

            return {
              ...img,
              x: newX,
              y: newY,
              width: newWidth,
              height: newHeight,
            };
          })
        );

        setActiveResize(prev => ({
          ...prev,
          prevX: e.clientX,
          prevY: e.clientY,
        }));
      }

      if (activeRotate) {
        updateImages(prev =>
          prev.map(img => {
            if (img.id !== activeRotate.imageId) return img;

            const centerX = img.x + img.width / 2;
            const centerY = img.y + img.height / 2;
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            let currentAngle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI);
            currentAngle = (currentAngle + 360) % 360;

            let deltaAngle = currentAngle - activeRotate.startAngle;
            deltaAngle = (deltaAngle + 360) % 360;

            let newRotation = (activeRotate.startRotation + deltaAngle) % 360;

            // Snapping
            const snapThreshold = 10;
            const snapAngles = [0, 45, 90, 135, 180, 225, 270, 315];
            for (let snap of snapAngles) {
              if (Math.abs(newRotation - snap) < snapThreshold) {
                newRotation = snap;
                break;
              }
            }

            return { ...img, rotation: newRotation };
          })
        );
      }
    };

    const handleUp = () => {
      setIsDragging(false);
      setActiveResize(null);
      setActiveRotate(null);
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleUp);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('mouseup', handleUp);
    };
  }, [isDragging, selectedImage, dragOffset, activeResize, activeRotate, updateImages]);

  // Keyboard shortcuts: Delete, Undo, Redo
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' && selectedImage) {
        updateImages(prev => prev.filter(img => img.id !== selectedImage));
        setSelectedImage(null);
      }

      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (history.length > 0) {
          setFuture(f => [images, ...f]);
          const prevImages = history[history.length - 1];
          setHistory(h => h.slice(0, -1));
          setImages(prevImages);
        }
      }

      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.shiftKey && e.key === 'Z'))) {
        e.preventDefault();
        if (future.length > 0) {
          setHistory(h => [...h, images]);
          const nextImages = future[0];
          setFuture(f => f.slice(1));
          setImages(nextImages);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImage, images, history, future, updateImages]);

  // Other actions
  const rotateImage = useCallback((imageId) => {
    updateImages(prev =>
      prev.map(img =>
        img.id === imageId
          ? { ...img, rotation: (img.rotation + 90) % 360 }
          : img
      )
    );
  }, [updateImages]);

  const scaleImage = useCallback((imageId, scaleFactor) => {
    updateImages(prev =>
      prev.map(img => {
        if (img.id === imageId) {
          const newWidth = Math.max(50, img.width * scaleFactor);
          const newHeight = Math.max(50, img.height * scaleFactor);
          return { ...img, width: newWidth, height: newHeight };
        }
        return img;
      })
    );
  }, [updateImages]);

  const deleteImage = useCallback((imageId) => {
    updateImages(prev => prev.filter(img => img.id !== imageId));
    setSelectedImage(null);
  }, [updateImages]);

  const clearCanvas = useCallback(() => {
    updateImages([]);
    setSelectedImage(null);
  }, [updateImages]);

  return (
    <>
      <div>
        <div className='pinterest-button'>
          <button className="button-55" role="button">Connect to Pinterest</button>
        </div>

        <div className="buttons-container">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="button-55"
          >
            <Plus className="w-4 h-4" />
            Add Image(s)
          </button>

          {images.length > 0 && 
          <button onClick={clearCanvas} className="button-55">
            <Trash2 className="w-4 h-4" />
            Clear Canvas
          </button>
          }

          {selectedImage && (
            <>
              <button onClick={() => rotateImage(selectedImage)} className="button-55">
                <RotateCw className="w-4 h-4" />
                Rotate
              </button>
              <button onClick={() => scaleImage(selectedImage, 1.2)} className="button-55">
                <ZoomIn className="w-4 h-4" />
                Bigger
              </button>
              <button onClick={() => scaleImage(selectedImage, 0.8)} className="button-55">
                <ZoomOut className="w-4 h-4" />
                Smaller
              </button>
              <button onClick={() => deleteImage(selectedImage)} className="button-55">
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
                transform: `rotate(${img.rotation}deg)`,
                transformOrigin: 'center center',
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

              {selectedImage === img.id && (
                <>
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, 'topLeft', img.id)}
                    style={{
                      position: 'absolute',
                      width: 10,
                      height: 10,
                      left: -5,
                      top: -5,
                      background: 'white',
                      border: '1px solid black',
                      cursor: 'nwse-resize',
                    }}
                  />
                  <div
                    onMouseDown={(e) => handleResizeMouseDown(e, 'bottomRight', img.id)}
                    style={{
                      position: 'absolute',
                      width: 10,
                      height: 10,
                      right: -5,
                      bottom: -5,
                      background: 'white',
                      border: '1px solid black',
                      cursor: 'nwse-resize',
                    }}
                  />
                  <div
                    onMouseDown={(e) => handleRotateMouseDown(e, img.id)}
                    style={{
                      position: 'absolute',
                      top: -30,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 20,
                      height: 20,
                      background: 'lightgray',
                      borderRadius: '50%',
                      border: '1px solid black',
                      cursor: 'grab',
                    }}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      </div>
      <div>
        <Link to="/privacy-policy">Privacy Policy</Link>
      </div>
    </>
  );
}
