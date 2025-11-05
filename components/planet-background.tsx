"use client";

import { useState, useEffect } from "react";

interface Star {
  top: number;
  left: number;
  opacity: number;
  animationDuration: number;
  animationDelay: number;
}

export default function PlanetBackground() {
  const [stars, setStars] = useState<Star[]>([]);
  const [mounted, setMounted] = useState(false);

  // Generate stars only on client to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
    const generatedStars = Array.from({ length: 80 }, () => ({
      top: Math.random() * 100,
      left: Math.random() * 100,
      opacity: Math.random() * 0.9 + 0.1,
      animationDuration: Math.random() * 3 + 2,
      animationDelay: Math.random() * 2,
    }));
    setStars(generatedStars);
  }, []);

  return (
    <div className="absolute left-1/2 top-0 -z-10 ml-[-38rem] aspect-[1216/708] w-[76rem] overflow-hidden">
      {/* Outer glow + atmospheric layers */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          backgroundImage:
            "radial-gradient(99.29% 99.29% at 50% 0.71%, rgba(255,255,255,0.06), rgba(255,255,255,0) 39.4%)",
        }}
      />
      <div
        className="absolute inset-0 -mt-10 rounded-full blur-[78px]"
        style={{
          backgroundImage:
            "radial-gradient(99.29% 99.29% at 50% 0.71%, #C4EFFF 8%, #2800C8 24%, rgba(124,98,248,0) 30%)",
        }}
      />
      <div
        className="absolute inset-0 -mt-0.5 rounded-full"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1), rgba(255,255,255,0) 5.875rem)",
        }}
      />

      {/* Starfield */}
      {mounted && (
        <div className="absolute inset-x-32 -top-48 bottom-full -mb-32">
          {stars.map((star, i) => (
            <div
              key={i}
              className="absolute w-px h-px bg-white opacity-80 animate-pulse"
              style={{
                top: `${star.top}%`,
                left: `${star.left}%`,
                opacity: star.opacity,
                animationDuration: `${star.animationDuration}s`,
                animationDelay: `${star.animationDelay}s`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
