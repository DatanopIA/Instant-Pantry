import React, { useRef, useState, useCallback, useEffect } from "react";
import { cn } from "../../lib/utils";

export function MagneticText({
    text,
    hoverText,
    className,
    circleSize = 150,
    variant = "default"
}) {
    const containerRef = useRef(null);
    const circleRef = useRef(null);
    const innerTextRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [dim, setDim] = useState({ w: 0, h: 0 });

    const mousePos = useRef({ x: 0, y: 0 });
    const currentPos = useRef({ x: 0, y: 0 });
    const animationFrameRef = useRef();

    const updateSize = useCallback(() => {
        if (containerRef.current) {
            const rect = containerRef.current.getBoundingClientRect();
            setDim({ w: rect.width, h: rect.height });
        }
    }, []);

    useEffect(() => {
        updateSize();
        const timer = setTimeout(updateSize, 100);
        window.addEventListener("resize", updateSize);
        return () => {
            window.removeEventListener("resize", updateSize);
            clearTimeout(timer);
        };
    }, [text, hoverText, updateSize]);

    useEffect(() => {
        const lerp = (start, end, factor) => start + (end - start) * factor;

        const animate = () => {
            currentPos.current.x = lerp(currentPos.current.x, mousePos.current.x, 0.15);
            currentPos.current.y = lerp(currentPos.current.y, mousePos.current.y, 0.15);

            if (circleRef.current) {
                circleRef.current.style.transform = `translate(${currentPos.current.x}px, ${currentPos.current.y}px) translate(-50%, -50%)`;
            }

            if (innerTextRef.current && dim.w > 0) {
                const tx = (dim.w / 2) - currentPos.current.x;
                const ty = (dim.h / 2) - currentPos.current.y;
                innerTextRef.current.style.transform = `translate(${tx}px, ${ty}px)`;
            }

            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animationFrameRef.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [dim.w, dim.h]);

    const handleMouseMove = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        mousePos.current = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        };
    }, []);

    const handleMouseEnter = useCallback((e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        mousePos.current = { x, y };
        currentPos.current = { x, y };
        setIsHovered(true);
        updateSize();
    }, [updateSize]);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
    }, []);

    useEffect(() => {
        if (window.innerWidth >= 768) return;

        const interval = setInterval(() => {
            setIsHovered(prev => !prev);
            if (!isHovered && dim.w > 0) {
                mousePos.current = {
                    x: dim.w / 2,
                    y: dim.h / 2
                };
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [dim.w, dim.h, isHovered]);

    const circleBg = variant === "default" ? "bg-black" : "bg-[#84A98C]";
    const innerTextColor = variant === "default" ? "text-white" : "text-black";

    return (
        <div
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            className={cn(
                "relative inline-grid items-center justify-center cursor-none select-none overflow-visible w-full",
                className
            )}
        >
            <span className="invisible pointer-events-none [grid-area:1/1] opacity-0 flex justify-center w-full text-center" aria-hidden="true">
                {text}
            </span>
            <span className="invisible pointer-events-none [grid-area:1/1] opacity-0 flex justify-center w-full text-center" aria-hidden="true">
                {hoverText || text}
            </span>

            <div className="[grid-area:1/1] flex items-center justify-center pointer-events-none z-10 w-full h-full p-2">
                <span className="text-center w-full">{text}</span>
            </div>

            <div className="[grid-area:1/1] relative pointer-events-none overflow-visible w-full h-full">
                <div
                    ref={circleRef}
                    className={cn(
                        "absolute top-0 left-0 pointer-events-none rounded-full overflow-hidden z-20 flex items-center justify-center",
                        circleBg
                    )}
                    style={{
                        width: isHovered ? circleSize : 0,
                        height: isHovered ? circleSize : 0,
                        transition: "width 0.6s cubic-bezier(0.16, 1, 0.3, 1), height 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
                        willChange: "transform, width, height",
                    }}
                >
                    <div
                        ref={innerTextRef}
                        className={cn("absolute flex items-center justify-center pointer-events-none p-2", innerTextColor)}
                        style={{
                            width: dim.w,
                            height: dim.h,
                            willChange: "transform",
                        }}
                    >
                        <span className="text-center w-full">
                            {hoverText || text}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
