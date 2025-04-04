"use client"

import React, { useRef, useEffect, ReactNode, useState } from "react";
import { useSpring, animated, to } from "@react-spring/web";

interface FollowCursorProps {
  children: ReactNode;
  className?: string;
  animationConfig?: {
    mass?: number;
    tension?: number;
    friction?: number;
    [key: string]: unknown;
  };
  hoverScale?: number;
  offsetX?: number;
  cardWidth?: string;
  rotationFactor?: number;
  perspective?: string;
  zoomSensitivity?: number;
  wheelConfig?: {
    mass?: number;
    tension?: number;
    friction?: number;
    [key: string]: unknown;
  };
  enableTilt?: boolean;
  enableZoom?: boolean;
  enableDrag?: boolean;
}

// Array of funny meme GIFs
const memeGifs = [
  "https://res.cloudinary.com/practicaldev/image/fetch/s--8mUhEkXE--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_66%2Cw_800/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/km2w1ppw3yw9pd9na7mu.gif",
  
];

const calcX = (
  y: number,
  ly: number,
  containerCenterY: number,
  rotationFactor: number
): number => -(y - ly - containerCenterY) / rotationFactor;

const calcY = (
  x: number,
  lx: number,
  containerCenterX: number,
  rotationFactor: number
): number => (x - lx - containerCenterX) / rotationFactor;

const isMobile = (): boolean =>
  /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

interface TouchState {
  startX?: number;
  startY?: number;
  offsetX?: number;
  offsetY?: number;
}

const FollowCursor: React.FC<FollowCursorProps> = ({
  children,
  className = "",
  animationConfig = { mass: 5, tension: 350, friction: 40 },
  hoverScale = 1.1,
  offsetX = 0,
  cardWidth = "200px",
  rotationFactor = 20,
  perspective = "1000px",
  zoomSensitivity = 200,
  wheelConfig = { mass: 1, tension: 200, friction: 30 },
  enableTilt = true,
  enableZoom = true,
  enableDrag = true,
}) => {
  const domTarget = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchState = useRef<TouchState>({});
  const [memeGif, setMemeGif] = useState<string>("");

  // Select a random meme GIF when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * memeGifs.length);
    setMemeGif(memeGifs[randomIndex]);
  }, []);

  const [{ x, y, rotateX, rotateY, rotateZ, zoom, scale }, api] = useSpring(
    () => ({
      rotateX: 0,
      rotateY: 0,
      rotateZ: 0,
      scale: 1,
      zoom: 0,
      x: 0,
      y: 0,
      config: animationConfig,
    })
  );

  const [{ wheelY }, wheelApi] = useSpring(() => ({
    wheelY: 0,
    config: wheelConfig,
  }));

  // Touch handling logic
  useEffect(() => {
    if (!isMobile() || !domTarget.current || !enableDrag) return;

    const card = domTarget.current;
    let isDragging = false;
    let pinchStartDistance = 0;
    let pinchStartAngle = 0;
    let initialZoom = 0;
    let initialRotateZ = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        touchState.current = {
          startX: touch.clientX,
          startY: touch.clientY,
          offsetX: x.get(),
          offsetY: y.get(),
        };
        isDragging = true;
      } else if (e.touches.length === 2 && enableZoom) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        pinchStartDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        pinchStartAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );
        initialZoom = zoom.get();
        initialRotateZ = rotateZ.get();
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!isDragging && e.touches.length !== 2) return;

      if (e.touches.length === 1 && isDragging) {
        const touch = e.touches[0];
        const deltaX = touch.clientX - (touchState.current.startX || 0);
        const deltaY = touch.clientY - (touchState.current.startY || 0);

        api.start({
          x: (touchState.current.offsetX || 0) + deltaX,
          y: (touchState.current.offsetY || 0) + deltaY,
          rotateX: 0,
          rotateY: 0,
          scale: 1,
        });
      } else if (e.touches.length === 2 && enableZoom) {
        const touch1 = e.touches[0];
        const touch2 = e.touches[1];
        const currentDistance = Math.hypot(
          touch2.clientX - touch1.clientX,
          touch2.clientY - touch1.clientY
        );
        const currentAngle = Math.atan2(
          touch2.clientY - touch1.clientY,
          touch2.clientX - touch1.clientX
        );

        const zoomDelta =
          (currentDistance - pinchStartDistance) / zoomSensitivity;
        const rotateDelta = currentAngle - pinchStartAngle;

        api.start({
          zoom: initialZoom + zoomDelta,
          rotateZ: initialRotateZ + rotateDelta,
        });
      }
    };

    const handleTouchEnd = () => {
      isDragging = false;
      api.start({ scale: hoverScale });
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      wheelApi.start({
        wheelY: wheelY.get() + e.deltaY,
        immediate: true,
      });
    };

    card.addEventListener("touchstart", handleTouchStart, { passive: false });
    card.addEventListener("touchmove", handleTouchMove, { passive: false });
    card.addEventListener("touchend", handleTouchEnd);
    if (enableZoom)
      card.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      card.removeEventListener("touchstart", handleTouchStart);
      card.removeEventListener("touchmove", handleTouchMove);
      card.removeEventListener("touchend", handleTouchEnd);
      card.removeEventListener("wheel", handleWheel);
    };
  }, [
    api,
    x,
    y,
    zoom,
    rotateZ,
    wheelY,
    wheelApi,
    enableDrag,
    enableZoom,
    zoomSensitivity,
    hoverScale,
  ]);

  // Mouse movement logic
  useEffect(() => {
    if (!isMobile() && enableTilt) {
      const handleMouseMove = (event: MouseEvent) => {
        const container = containerRef.current;
        if (!container) return;

        const rect = container.getBoundingClientRect();
        const containerCenterX = rect.left + rect.width / 2;
        const containerCenterY = rect.top + rect.height / 2;

        const px = event.clientX;
        const py = event.clientY;

        const xPos = px - containerCenterX;
        const yPos = py - containerCenterY;

        const parsedCardWidth = parseFloat(cardWidth);
        const calculatedWidth = container.offsetWidth * (parsedCardWidth / 100);
        const calculatedOffset = calculatedWidth / 2 + offsetX;

        api.start({
          x: xPos + calculatedOffset,
          y: yPos,
          rotateX: enableTilt
            ? calcX(py, y.get(), containerCenterY, rotationFactor)
            : 0,
          rotateY: enableTilt
            ? calcY(px, x.get(), containerCenterX, rotationFactor)
            : 0,
          scale: hoverScale,
        });
      };

      window.addEventListener("mousemove", handleMouseMove);
      return () => window.removeEventListener("mousemove", handleMouseMove);
    }
  }, [api, y, x, cardWidth, offsetX, hoverScale, enableTilt, rotationFactor]);

  const wheelTransform = (yValue: number): string => {
    const imgHeight = containerRef.current
      ? containerRef.current.offsetWidth * (parseFloat(cardWidth) / 100) - 20
      : window.innerWidth * 0.3 - 20;
    return `translateY(${-imgHeight * (yValue < 0 ? 6 : 1) - (yValue % (imgHeight * 5))}px)`;
  };

  return (
    <div className={`container ${className}`} ref={containerRef}>
      <div 
        className="relative"
        style={{ width: cardWidth }}
      >
        <animated.div
          style={{
            backgroundImage: `url('${memeGif}')`,
            transform: to(
              [x, y, scale, zoom, rotateX, rotateY, rotateZ],
              (x, y, s, z, rX, rY, rZ) => `
                perspective(${perspective})
                translate3d(${x}px, ${y}px, 0)
                scale(${s + z})
                rotateX(${enableTilt ? rX : 0}deg)
                rotateY(${enableTilt ? rY : 0}deg)
                rotateZ(${enableZoom ? rZ : 0}deg)
              `
            ),
            width: "100%",
            height: "150px",
            backgroundSize: "cover",
            borderRadius: "15px",
            boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.3)",
            transition: "box-shadow 0.5s, opacity 0.5s",
            willChange: "transform",
            touchAction: "none",
            position: "absolute"
          }}
        />
      </div>
      <div 
        ref={domTarget}
        className="absolute top-0 left-0 w-full h-full"
      >
        <div style={{ transform: wheelY.to(wheelTransform) as unknown as string }}>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default FollowCursor;
