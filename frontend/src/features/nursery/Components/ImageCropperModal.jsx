import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import getCroppedImg from './utils/cropImage';

const ImageCropperModal = ({ imageSrc, aspect, onCropComplete, onCancel }) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    try {
      const croppedImageBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImageBlob);
    } catch (e) {
      console.error(e);
    }
  };

  if (!imageSrc) return null;

  return (
    <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9055 }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Adjust Image</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body position-relative" style={{ height: '500px', backgroundColor: '#333' }}>
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={aspect}
              onCropChange={onCropChange}
              onCropComplete={handleCropComplete}
              onZoomChange={onZoomChange}
            />
          </div>
          <div className="modal-footer d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center" style={{ width: '60%' }}>
              <span className="me-2"><i className="fas fa-search-minus"></i></span>
              <input
                type="range"
                className="form-range flex-grow-1"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(e) => setZoom(e.target.value)}
              />
              <span className="ms-2"><i className="fas fa-search-plus"></i></span>
            </div>
            <div>
              <button type="button" className="btn btn-secondary me-2" onClick={onCancel}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSave}>Save</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropperModal;
