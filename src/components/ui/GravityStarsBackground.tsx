
import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface GravityStarsBackgroundProps {
    className?: string;
    starCount?: number;
    starColor?: string;
}

interface Star {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    alpha: number;
}

export const GravityStarsBackground = ({
    className,
    starCount = 100,
    starColor = "#ffffff",
}: GravityStarsBackgroundProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const mouseRef = useRef({ x: 0, y: 0, isActive: false });

    useEffect(() => {
        const handleResize = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight,
                });
            }
        };

        window.addEventListener("resize", handleResize);
        handleResize();

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = dimensions.width;
        canvas.height = dimensions.height;

        const stars: Star[] = [];
        for (let i = 0; i < starCount; i++) {
            stars.push({
                x: Math.random() * dimensions.width,
                y: Math.random() * dimensions.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 1.5 + 0.5,
                alpha: Math.random() * 0.5 + 0.5,
            });
        }

        let animationFrameId: number;

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            stars.forEach((star) => {
                // Physics
                if (mouseRef.current.isActive) {
                    const dx = mouseRef.current.x - star.x;
                    const dy = mouseRef.current.y - star.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    const force = 100 / (distance * distance + 1000); // Gravity-like pull

                    star.vx += force * dx * 0.05;
                    star.vy += force * dy * 0.05;
                }

                // Friction / Damping
                star.vx *= 0.99;
                star.vy *= 0.99;

                // Base Movement
                star.x += star.vx;
                star.y += star.vy;

                // Wrap around screen
                if (star.x < 0) star.x = canvas.width;
                if (star.x > canvas.width) star.x = 0;
                if (star.y < 0) star.y = canvas.height;
                if (star.y > canvas.height) star.y = 0;

                // Draw
                ctx.beginPath();
                ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
                ctx.fillStyle = starColor;
                ctx.globalAlpha = star.alpha;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e: MouseEvent) => {
            if (containerRef.current) {
                const rect = containerRef.current.getBoundingClientRect();
                mouseRef.current = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top,
                    isActive: true,
                };
            }
        };

        const handleMouseLeave = () => {
            mouseRef.current.isActive = false;
        };

        if (containerRef.current) {
            containerRef.current.addEventListener("mousemove", handleMouseMove);
            containerRef.current.addEventListener("mouseleave", handleMouseLeave);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
            if (containerRef.current) {
                containerRef.current.removeEventListener("mousemove", handleMouseMove);
                containerRef.current.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, [dimensions, starCount, starColor]);

    return (
        <div
            ref={containerRef}
            className={cn("absolute inset-0 overflow-hidden", className)}
        >
            <canvas ref={canvasRef} />
        </div>
    );
};
