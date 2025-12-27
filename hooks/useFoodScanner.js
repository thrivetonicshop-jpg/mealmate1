import { useState, useRef, useCallback } from "react";

export function useFoodScanner() {
  const [isScanning, setIsScanning] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState(null);
  const [detectedItems, setDetectedItems] = useState([]);
  const [capturedImage, setCapturedImage] = useState(null);
  
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = useCallback(async () => {
    try {
      setCameraError(null);
      
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Camera access error:", error);
      
      if (error.name === "NotAllowedError") {
        setCameraError("Camera access denied. Please enable camera permissions.");
      } else if (error.name === "NotFoundError") {
        setCameraError("No camera found on this device.");
      } else {
        setCameraError("Unable to access camera. Please try again.");
      }
    }
  }, []);

  const closeCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setIsCameraOpen(false);
    setCapturedImage(null);
    setDetectedItems([]);
  }, []);

  const flipCamera = useCallback(async () => {
    if (!streamRef.current) return;

    const currentTrack = streamRef.current.getVideoTracks()[0];
    const currentFacingMode = currentTrack.getSettings().facingMode;
    
    closeCamera();
    
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: currentFacingMode === "environment" ? "user" : "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      
      setIsCameraOpen(true);
    } catch (error) {
      console.error("Failed to flip camera:", error);
      openCamera();
    }
  }, [closeCamera, openCamera]);

  const captureImage = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return null;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);
    
    const imageData = canvas.toDataURL("image/jpeg", 0.8);
    setCapturedImage(imageData);
    
    return imageData;
  }, []);

  const scanImage = useCallback(async (imageData, apiKey) => {
    if (!imageData) {
      const captured = captureImage();
      if (!captured) {
        throw new Error("No image to scan");
      }
      imageData = captured;
    }

    setIsScanning(true);
    setDetectedItems([]);

    try {
      const response = await fetch("/api/scan-food", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: imageData,
          apiKey: apiKey,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Scan failed");
      }

      setDetectedItems(data.ingredients);
      return data.ingredients;
      
    } catch (error) {
      console.error("Scan error:", error);
      throw error;
    } finally {
      setIsScanning(false);
    }
  }, [captureImage]);

  const scanFromFile = useCallback(async (file, apiKey) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = async (e) => {
        const imageData = e.target.result;
        setCapturedImage(imageData);
        
        try {
          const results = await scanImage(imageData, apiKey);
          resolve(results);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });
  }, [scanImage]);

  const clearResults = useCallback(() => {
    setDetectedItems([]);
    setCapturedImage(null);
  }, []);

  return {
    isScanning,
    isCameraOpen,
    cameraError,
    detectedItems,
    capturedImage,
    videoRef,
    canvasRef,
    openCamera,
    closeCamera,
    flipCamera,
    captureImage,
    scanImage,
    scanFromFile,
    clearResults,
  };
}

export default useFoodScanner;
