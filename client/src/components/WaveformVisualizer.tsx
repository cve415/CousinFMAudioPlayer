import React, { useEffect, useRef } from 'react';

interface WaveformVisualizerProps {
  isPlaying: boolean;
  barCount?: number;
  className?: string;
}

export function WaveformVisualizer({ 
  isPlaying, 
  barCount = 32, 
  className = "" 
}: WaveformVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const barsRef = useRef<number[]>([]);

  useEffect(() => {
    // Initialize bar heights
    barsRef.current = Array(barCount).fill(0).map(() => Math.random() * 0.3 + 0.1);
  }, [barCount]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / barCount;
      const maxBarHeight = height * 0.8;

      barsRef.current.forEach((barHeight, index) => {
        const x = index * barWidth;
        const currentHeight = isPlaying 
          ? maxBarHeight * barHeight 
          : maxBarHeight * 0.1;

        // Create gradient
        const gradient = ctx.createLinearGradient(0, height, 0, height - currentHeight);
        gradient.addColorStop(0, 'rgba(255, 166, 0, 0.8)'); // cousin-orange
        gradient.addColorStop(0.5, 'rgba(255, 166, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 166, 0, 0.3)');

        ctx.fillStyle = gradient;
        ctx.fillRect(x + 1, height - currentHeight, barWidth - 2, currentHeight);

        // Animate bars when playing
        if (isPlaying) {
          // Update bar heights with smooth animation
          const targetHeight = Math.random() * 0.8 + 0.2;
          barsRef.current[index] += (targetHeight - barsRef.current[index]) * 0.1;
        } else {
          // Gradually decrease to minimum height when not playing
          barsRef.current[index] += (0.1 - barsRef.current[index]) * 0.05;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, barCount]);

  return (
    <canvas
      ref={canvasRef}
      width={400}
      height={80}
      className={`${className}`}
      style={{ width: '100%', height: '80px' }}
    />
  );
}