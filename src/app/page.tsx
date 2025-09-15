"use client";

import CanvasDrawing from "components/draw-on-canvas/canvasDrawing";
import ExtrudeDrawing from "components/extrude-drawing/extrudeDrawing";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import { draw_triangle } from "utils/try-drawing-triangle";
import NewDrawing from "../components/new-drawing";

export default function Home() {
    const canvaRef = useRef<HTMLCanvasElement>(null);

    const [show_drawing_window, set_show_drawing_window] = useState(false);
    const [show_extrude_window, set_show_extrude_window] = useState(false);


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

            {!show_drawing_window && !show_extrude_window ? (
                <NewDrawing onPress={() => set_show_drawing_window(true)} />
            ) : null}

            {show_drawing_window ? <CanvasDrawing onExtrude={() => set_show_extrude_window(true)} is_visible={!show_extrude_window}/> : null}

            {show_drawing_window ? <ExtrudeDrawing onDrawNew={() => set_show_extrude_window(false)} is_visible={show_extrude_window}/> : null}
        </>
    );
}
