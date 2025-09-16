import {useEffect, useRef, useState} from "react";
import styles from "./cansvasDrawing.module.scss";
import {
    fragmentShaderSource,
    generate_face_top,
    interpolatePoints,
    vertexShaderSource,
} from "utils/draw-on-canvas/draw-shader-strings";
import {createProgram, createShader} from "utils/gen-shaders";
import concaveman from "concaveman";
import {getPackedSettings} from "http2";
import {draw_triangle} from "utils/try-drawing-triangle";
import ButtonN from "../button";



const CanvasDrawing = ({is_visible, onExtrude}) => {
    // refs
    const drawCanvasRef = useRef<any>(null);
    const glRef = useRef<any>(null);
    const programRef = useRef<any>(null);
    const bufferRef = useRef<any>(null);

    // states
    const [points, setPoints] = useState<any[]>([]);
    const [drawing, setDrawing] = useState(false);
    const [draw_new, set_draw_new] = useState(false);


    const getConcavePolygon = () => {
        const rect = drawCanvasRef.current.getBoundingClientRect();

        const faces_arr:any = [];
        const polygon_arr:any = [];

        points.forEach((point_arr) => {

            const new_points = interpolatePoints(
                point_arr,
                0,
                rect.width,
                rect.height
            );

            const polygon = concaveman(new_points);

            const faces = generate_face_top(polygon, rect.width, rect.height);

            faces_arr.push(faces);
            polygon_arr.push(polygon);


        });

        if (faces_arr.length) {
            const new_event = new CustomEvent("drawextrude", {
                detail: {faces: faces_arr, polygon: polygon_arr},
            });

            if (document.getElementById("extrudeId")) {
                document.getElementById("extrudeId")?.dispatchEvent(new_event);
            } else {
                console.log("no ducasdfasd");
            }

            onExtrude();
        }

        // setPoints(faces ?? []);
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
        const gl = glRef.current;
        gl?.clear(gl.COLOR_BUFFER_BIT);

        points.forEach((point_arr, index) => {
            if (!point_arr.length && glRef.current && index === 0) {
                const gl = glRef.current;
                gl.clearColor(1, 1, 1, 1);
                gl.clear(gl.COLOR_BUFFER_BIT);
            }

            if (!glRef.current || point_arr.length < 2) return;


            const vertices = new Float32Array(point_arr.flat());
            gl.bindBuffer(gl.ARRAY_BUFFER, bufferRef.current);
            gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);


            gl.drawArrays(gl.LINE_STRIP, 0, point_arr.length);
        })

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
        if (draw_new || !points.length) {
            points.push([point]);
            setPoints([...points]);
        } else {
            points[points.length - 1].push(point);
            setPoints([...points]);
        }
        set_draw_new(false);
    };

    const handleMouseMove = (e: any) => {
        if (!drawing) return;
        const rect = drawCanvasRef.current.getBoundingClientRect();

        // console.log(e.clientY, rect);

        const point = toClipSpace(
            e.clientX - rect.left,
            e.clientY - rect.top,
            rect.width,
            rect.height
        );
        points[points.length - 1].push(point);
        setPoints([...points]);
    };

    const handleMouseUp = () => {
        setDrawing(false);
    };

    return (
        <>
            <section className={styles.drawingBoardContainer} style={{display: is_visible ? undefined : 'none'}}>

                <div className={styles.buttonContainer}>
                    <ButtonN onPress={() => setPoints([])}>Clear</ButtonN>

                    <ButtonN onPress={() => set_draw_new(true)}>New Extrude</ButtonN>

                    <ButtonN onPress={() => getConcavePolygon()}>
                        Make Polygon
                    </ButtonN>
                </div>

                <canvas
                    ref={drawCanvasRef}
                    width={1200}
                    height={800}
                    style={{border: "1px solid black", touchAction: "none", width: '100%', height: '100%'}}
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
