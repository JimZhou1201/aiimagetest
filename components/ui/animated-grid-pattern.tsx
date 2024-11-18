"use client";

import React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface AnimatedGridPatternProps {
  width?: number;
  height?: number;
  x?: number;
  y?: number;
  strokeDasharray?: any;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  repeatDelay?: number;
  colors?: string[];
}

export function AnimatedGridPattern({
  width = 40,
  height = 40,
  x = -1,
  y = -1,
  strokeDasharray = 0,
  numSquares = 50,
  className,
  maxOpacity = 0.5,
  duration = 4,
  repeatDelay = 0.5,
  ...props
}: AnimatedGridPatternProps) {
  const id = useId();
  const containerRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 1000 });
  const [squares, setSquares] = useState<Array<{ id: number; pos: number[] }>>([]);

  useEffect(() => {
    console.log('AnimatedGridPattern mounted');
    console.log('Initial dimensions:', dimensions);
    console.log('Initial squares:', squares);
  }, []);

  function getPos() {
    return [
      Math.floor((Math.random() * dimensions.width) / width),
      Math.floor((Math.random() * dimensions.height) / height),
    ];
  }

  function generateSquares(count: number) {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      pos: getPos(),
    }));
  }

  useEffect(() => {
    setSquares(generateSquares(numSquares));
  }, [numSquares]);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width || 1000,
          height: entry.contentRect.height || 1000,
        });
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      if (containerRef.current) {
        resizeObserver.unobserve(containerRef.current);
      }
    };
  }, []);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={clsx(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      {...props}
    >
      <defs>
        <pattern
          id={id}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
          x={x}
          y={y}
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            stroke="rgba(156, 163, 175, 0.15)"
            strokeWidth="0.5"
            strokeDasharray={strokeDasharray}
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
      <svg x={x} y={y} className="overflow-visible">
        {squares.map(({ pos: [x, y], id }, index) => {
          const colors = [
            'rgba(129, 140, 248, 0.5)',
            'rgba(244, 114, 182, 0.5)',
            'rgba(167, 139, 250, 0.5)',
          ];
          const color = colors[index % colors.length];
          
          return (
            <motion.rect
              key={`${id}-${index}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: maxOpacity }}
              transition={{
                duration,
                repeat: Infinity,
                delay: index * 0.1,
                repeatType: "reverse",
              }}
              width={width - 1}
              height={height - 1}
              x={x * width + 1}
              y={y * height + 1}
              fill={color}
              strokeWidth="0"
            />
          );
        })}
      </svg>
    </svg>
  );
}
