"use client";

import CanvasDrawing from "components/draw-on-canvas/canvasDrawing";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { draw_triangle } from "utils/try-drawing-triangle";

export default function Home() {
    const canvaRef = useRef<HTMLCanvasElement>(null);

    const [gl, set_gl] = useState<any>(null);

    useEffect(() => {
        const canvas = canvaRef.current;
        set_gl(canvas?.getContext("webgl"));
    }, []);

    const resizeCanvas = () => {
        const canvas = canvaRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            gl?.viewport(0, 0, canvas.width, canvas.height);
            gl?.clearColor(0.0, 0.0, 0.0, 1.0);
            gl?.clear(gl.COLOR_BUFFER_BIT);
        }
    };

    useEffect(() => {
        if (gl) {
            resizeCanvas();
        }
    }, [gl]);

    useEffect(() => {
        window.addEventListener("resize", resizeCanvas);

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <>
            <CanvasDrawing />
        </>
    );
}
