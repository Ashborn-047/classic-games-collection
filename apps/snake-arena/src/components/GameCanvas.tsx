import React, { useRef, useEffect } from 'react';
import { useSnakeStore } from '../store/useSnakeStore';

/**
 * High-Performance Game Canvas
 * Transmutes the rendering to a Web Worker.
 */
export default function GameCanvas() {
  const canvasRef = useRef(null);
  const workerRef = useRef(null);
  const { snakes, food, gridSize } = useSnakeStore();

  useEffect(() => {
    // Initialize Web Worker
    workerRef.current = new Worker(new URL('../workers/snakeWorker.ts', import.meta.url));

    // Transfer OffscreenCanvas control to worker
    const offscreen = canvasRef.current.transferControlToOffscreen();
    workerRef.current.postMessage({ 
      type: 'INIT', 
      payload: { canvas: offscreen } 
    }, [offscreen]);

    return () => {
      workerRef.current.terminate();
    };
  }, []);

  // Sync state to worker on every store update
  useEffect(() => {
    if (workerRef.current) {
      workerRef.current.postMessage({
        type: 'RENDER',
        payload: { snakes, food, gridSize }
      });
    }
  }, [snakes, food, gridSize]);

  return (
    <div className="relative border-8 border-black bg-[#111] shadow-[8px_8px_0px_0px_#000]">
      <canvas
        ref={canvasRef}
        width={600}
        height={600}
        className="max-w-full h-auto aspect-square block"
      />
      
      {/* Grid Overlay Decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-5">
        <div className="w-full h-full" style={{ 
          backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }} />
      </div>
    </div>
  );
}
