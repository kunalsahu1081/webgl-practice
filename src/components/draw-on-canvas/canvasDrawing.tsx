import { useEffect, useRef, useState } from "react";
import styles from "./cansvasDrawing.module.scss";
import {
    fragmentShaderSource,
    generate_face_top,
    interpolatePoints,
    vertexShaderSource,
} from "utils/draw-on-canvas/draw-shader-strings";
import { createProgram, createShader } from "utils/gen-shaders";
import concaveman from "concaveman";
import { getPackedSettings } from "http2";
import { draw_triangle } from "utils/try-drawing-triangle";

const CanvasDrawing = () => {
    // refs
    const drawCanvasRef = useRef<any>(null);
    const glRef = useRef<any>(null);
    const programRef = useRef<any>(null);
    const bufferRef = useRef<any>(null);

    // states
    const [points, setPoints] = useState<any[]>([]);
    const [drawing, setDrawing] = useState(false);

    const getConcavePolygon = () => {
        const rect = drawCanvasRef.current.getBoundingClientRect();

        const new_points = interpolatePoints(
            points,
            0,
            rect.width,
            rect.height
        );

        const polygon = concaveman(new_points);

        const faces = (points, rect.width, rect.height);

        // console.log(points, new_points);

        // draw_triangle(glRef.current, faces);

        setPoints(polygon ?? []);
    };

    const toClipSpace = (
        x: number,
        y: number,
        width: number,
        height: number
    ) => {
        return [(x / width) * 2 - 1, -((y / height) * 2 - 1)];
    };

    useEffect(() => {
        const canvas = drawCanvasRef.current;
        const gl: WebGL2RenderingContext = canvas.getContext("webgl");

        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        glRef.current = gl;

        // Vertex shader program
        const vertexString = vertexShaderSource;

        // Fragment shader program
        const fragmentString = fragmentShaderSource;

        const vertexShader = createShader(
            gl,
            gl.VERTEX_SHADER,
            vertexShaderSource
        );

        const fragmentShader = createShader(
            gl,
            gl.FRAGMENT_SHADER,
            fragmentShaderSource
        );

        const program = createProgram(gl, vertexShader, fragmentShader);

        gl.useProgram(program);
        programRef.current = program;

        const buffer = gl.createBuffer();
        bufferRef.current = buffer;

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        const positionLocation = gl.getAttribLocation(program, "a_position");
        gl.enableVertexAttribArray(positionLocation);
        gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);
    }, []);

    useEffect(() => {
        if (!points.length && glRef.current) {
            const gl = glRef.current;
            gl.clearColor(1, 1, 1, 1);
            gl.clear(gl.COLOR_BUFFER_BIT);
        }

        if (!glRef.current || points.length < 2) return;
        const gl = glRef.current;

        const vertices = new Float32Array(points.flat());
        gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

        gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.LINE_STRIP, 0, points.length);
    }, [points]);

    const handleMouseDown = (e: any) => {
        setDrawing(true);
        const rect = drawCanvasRef.current.getBoundingClientRect();
        const point = toClipSpace(
            e.clientX - rect.left,
            e.clientY - rect.top,
            rect.width,
            rect.height
        );
        setPoints((prev) => [...prev, point]);
    };

    const handleMouseMove = (e: any) => {
        if (!drawing) return;
        const rect = drawCanvasRef.current.getBoundingClientRect();
        const point = toClipSpace(
            e.clientX - rect.left,
            e.clientY - rect.top,
            rect.width,
            rect.height
        );
        setPoints((prev) => [...prev, point]);
    };

    const handleMouseUp = () => {
        setDrawing(false);
    };

    return (
        <>
            <section className={styles.drawingBoardContainer}>
                <button onClick={() => setPoints([])}>clear</button>

                <button onClick={() => getConcavePolygon()}>
                    make polygon
                </button>

                <canvas
                    ref={drawCanvasRef}
                    width={600}
                    height={600}
                    style={{ border: "1px solid black", touchAction: "none" }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                />
            </section>
        </>
    );
};

export default CanvasDrawing;
