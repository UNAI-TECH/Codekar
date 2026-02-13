
import React, { useState, useEffect, useRef, useCallback } from "react";
import { cn } from "@/lib/utils";

interface StarsBackgroundProps {
    starColor?: string;
    className?: string;
    allStarsTwinkle?: boolean;
    twinkleProbability?: number;
    minStarSize?: number;
    maxStarSize?: number;
    starDensity?: number;
}

export const StarsBackground = ({
    starColor = "white",
    className,
    allStarsTwinkle = true,
    twinkleProbability = 0.7,
    minStarSize = 0.6,
    maxStarSize = 1.1,
    starDensity = 0.00015,
}: StarsBackgroundProps) => {
    const [stars, setStars] = useState<any[]>([]);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const generateStars = useCallback(
        (width: number, height: number) => {
            const area = width * height;
            const numStars = Math.floor(area * starDensity);
            return Array.from({ length: numStars }).map(() => {
                const shouldTwinkle = allStarsTwinkle || Math.random() < twinkleProbability;
                return {
                    x: Math.random() * width,
                    y: Math.random() * height,
                    radius: Math.random() * (maxStarSize - minStarSize) + minStarSize,
                    opacity: Math.random(),
                    twinkleSpeed: shouldTwinkle
                        ? Math.random() * 0.05 + 0.005
                        : 0,
                };
            });
        },
        [allStarsTwinkle, twinkleProbability, minStarSize, maxStarSize, starDensity]
    );

    useEffect(() => {
        const updateStars = () => {
            if (canvasRef.current) {
                const canvas = canvasRef.current;
                const ctx = canvas.getContext("2d");
                if (!ctx) return;

                const { width, height } = canvas.getBoundingClientRect();
                canvas.width = width * window.devicePixelRatio;
                canvas.height = height * window.devicePixelRatio;
                ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

                setStars(generateStars(width, height));
            }
        };

        updateStars();

        const resizeObserver = new ResizeObserver(updateStars);
        if (canvasRef.current) {
            resizeObserver.observe(canvasRef.current);
        }

        return () => {
            if (canvasRef.current) {
                resizeObserver.unobserve(canvasRef.current);
            }
        };
    }, [starDensity, allStarsTwinkle, twinkleProbability, minStarSize, maxStarSize, generateStars]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;

        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            stars.forEach((star) => {
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = starColor; // Use the prop color directly or handle rgba logic if complex
                // We modify globalAlpha for twinkling
                ctx.globalAlpha = Math.abs(Math.sin(Date.now() * star.twinkleSpeed + star.opacity));
                ctx.fill();
            });
            animationFrameId = requestAnimationFrame(render);
        };

        render();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [stars, starColor]);

    return (
        <div className={cn("w-full h-full absolute inset-0", className)}>
            <canvas ref={canvasRef} className="w-full h-full" />
        </div>
    );
};
