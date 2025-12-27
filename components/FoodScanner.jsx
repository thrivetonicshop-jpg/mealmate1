"use client";

import React, { useState, useEffect } from "react";
import { useFoodScanner } from "@/hooks/useFoodScanner";

const categoryIcons = {
  produce: "🥬",
  dairy: "🧀",
  protein: "🥩",
  grain: "🌾",
  condiment: "🧂",
  beverage: "🥤",
  snack: "🍿",
  frozen: "🧊",
  canned: "🥫",
  other: "📦",
};

const freshnessColors = {
  fresh: "bg-green-500",
  "expiring-soon": "bg-yellow-500",
  expired: "bg-red-500",
  unknown: "bg-gray-500",
};

export default function FoodScanner({ onAddToPantry, apiKey: propApiKey }) {
  const [apiKey, setApiKey] = useState(propApiKey || "");
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [error, setError] = useState(null);

  const {
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
    scanImage,
    scanFromFile,
    clearResults,
  } = useFoodScanner();

  useEffect(() => {
    const savedKey = localStorage.getItem("claude_api_key");
    if (savedKey) {
      setApiKey(savedKey);
    }
  }, []);

  const saveApiKey = (key) => {
    setApiKey(key);
    localStorage.setItem("claude_api_key", key);
    setShowApiKeyModal(false);
  };

  const handleScan = async () => {
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    setError(null);
    try {
      await scanImage(null, apiKey);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!apiKey) {
      setShowApiKeyModal(true);
      return;
    }
    setError(null);
    try {
      await scanFromFile(file, apiKey);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleItemSelection = (index) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedItems(newSelected);
  };

  const selectAll = () => {
    setSelectedItems(new Set(detectedItems.map((_, i) => i)));
  };

  const handleAddToPantry = () => {
    const itemsToAdd = detectedItems.filter((_, i) => selectedItems.has(i));
    if (onAddToPantry && itemsToAdd.length > 0) {
      onAddToPantry(itemsToAdd);
    }
    clearResults();
    setSelectedItems(new Set());
    closeCamera();
  };

  return (
    <div className="food-scanner">
      <canvas ref={canvasRef} className="hidden" />

      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">🔑</span>
              <h3 className="text-lg font-semibold text-gray-900">Enable AI Food Scanner</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Add your Claude API key from{" "}
              <a href="https://console.anthropic.com" target="_blank" rel="noopener noreferrer" className="text-orange-600 hover:underline">
                console.anthropic.com
              </a>{" "}
              to enable real AI food recognition.
            </p>
            <input
              type="password"
              placeholder="sk-ant-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <div className="flex gap-3">
              <button onClick={() => setShowApiKeyModal(false)} className="flex-1 px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-xl transition">
                Cancel
              </button>
              <button onClick={() => saveApiKey(apiKey)} disabled={!apiKey} className="flex-1 px-4 py-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition disabled:opacity-50">
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {!isCameraOpen && !capturedImage ? (
        <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6 text-center">
          <div className="text-5xl mb-4">📷</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Scan Your Fridge</h2>
          <p className="text-gray-600 mb-6">AI identifies ingredients & suggests recipes</p>
          <div className="flex flex-col gap-3">
            <button onClick={openCamera} className="w-full py-4 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition flex items-center justify-center gap-2">
              <span>📸</span> Open Camera
            </button>
            <label className="w-full py-4 bg-white border-2 border-dashed border-gray-300 text-gray-600 rounded-xl font-medium hover:border-orange-400 hover:text-orange-600 transition cursor-pointer flex items-center justify-center gap-2">
              <span>🖼️</span> Upload Photo
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
          {!apiKey && (
            <button onClick={() => setShowApiKeyModal(true)} className="mt-4 text-sm text-orange-600 hover:underline">
              🔑 Set up API key
            </button>
          )}
        </div>
      ) : (
        <div className="bg-black rounded-2xl overflow-hidden relative">
          {isCameraOpen && !capturedImage && (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full aspect-[4/3] object-cover" />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <div className="flex items-center justify-between">
                  <button onClick={closeCamera} className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur">✕</button>
                  <button onClick={handleScan} disabled={isScanning} className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition disabled:opacity-50">
                    {isScanning ? <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /> : <div className="w-16 h-16 bg-orange-500 rounded-full" />}
                  </button>
                  <button onClick={flipCamera} className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur">🔄</button>
                </div>
              </div>
              {isScanning && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="bg-white rounded-2xl p-6 text-center">
                    <div className="w-12 h-12 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-900 font-medium">Analyzing your ingredients...</p>
                  </div>
                </div>
              )}
            </>
          )}

          {capturedImage && (
            <div className="bg-gray-900">
              <img src={capturedImage} alt="Captured" className="w-full aspect-[4/3] object-cover opacity-50" />
              <div className="absolute inset-0 flex flex-col">
                <div className="p-4 bg-gradient-to-b from-black/80 to-transparent">
                  <div className="flex items-center justify-between text-white">
                    <button onClick={() => { clearResults(); openCamera(); }} className="flex items-center gap-2 text-sm">← Scan More</button>
                    <span className="text-sm font-medium">{detectedItems.length} items found</span>
                  </div>
                </div>
                <div className="flex-1 overflow-auto p-4">
                  {error && <div className="bg-red-500/90 text-white p-4 rounded-xl mb-4">{error}</div>}
                  {detectedItems.length > 0 && (
                    <div className="space-y-2">
                      {detectedItems.map((item, index) => (
                        <button key={index} onClick={() => toggleItemSelection(index)} className={`w-full p-4 rounded-xl flex items-center gap-3 transition ${selectedItems.has(index) ? "bg-orange-500 text-white" : "bg-white/90 text-gray-900"}`}>
                          <span className="text-2xl">{categoryIcons[item.category] || "📦"}</span>
                          <div className="flex-1 text-left">
                            <div className="font-medium capitalize">{item.name}</div>
                            <div className={`text-sm ${selectedItems.has(index) ? "text-white/80" : "text-gray-500"}`}>{item.quantity}</div>
                          </div>
                          {item.freshness && item.freshness !== "unknown" && (
                            <span className={`px-2 py-1 rounded-full text-xs text-white ${freshnessColors[item.freshness]}`}>{item.freshness}</span>
                          )}
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedItems.has(index) ? "border-white bg-white" : "border-gray-300"}`}>
                            {selectedItems.has(index) && <span className="text-orange-500">✓</span>}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {detectedItems.length > 0 && (
                  <div className="p-4 bg-gradient-to-t from-black/80 to-transparent">
                    <div className="flex gap-3">
                      <button onClick={selectAll} className="flex-1 py-3 bg-white/20 text-white rounded-xl font-medium backdrop-blur">Select All</button>
                      <button onClick={handleAddToPantry} disabled={selectedItems.size === 0} className="flex-1 py-3 bg-orange-500 text-white rounded-xl font-medium hover:bg-orange-600 transition disabled:opacity-50">
                        Add to Pantry ({selectedItems.size})
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {cameraError && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
          <p className="font-medium">⚠️ {cameraError}</p>
          <button onClick={openCamera} className="mt-2 text-sm underline hover:no-underline">Try Again</button>
        </div>
      )}
    </div>
  );
}
