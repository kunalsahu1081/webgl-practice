import {useEffect, useRef, useState} from "react";
import styles from "./extrudeDrawing.module.scss";
import {try_fragment_shader, try_vertex_shader} from "utils/shaders-strings";
import {createProgram, createShader} from "utils/gen-shaders";
import {draw_triangle} from "utils/try-drawing-triangle";
import ButtonN from "../button";


let drawTriangleFunc = null;

const ExtrudeDrawing = ({is_visible, onDrawNew}) => {
    const extrudeCanvasRef = useRef<any>(null);

    const glRef = useRef<any>(null);

    // states
    const [points, setPoints] = useState<any[]>([]);
    const [polygon, setPolygon] = useState<any[]>([]);

    useEffect(() => {
        const canvas = extrudeCanvasRef.current;
        const gl: WebGL2RenderingContext = canvas.getContext("webgl");

        if (!gl) {
            console.error("WebGL not supported");
            return;
        }

        glRef.current = gl;
        gl.clearColor(1, 1, 1, 1);
        gl.clear(gl.COLOR_BUFFER_BIT);

    }, []);


    useEffect(() => {
        if (polygon?.length && points.length) {

            let polygon_triangles = [];
            let modified_points_3 = [];
            let modified_points_4 = [];

            drawTriangleFunc = draw_triangle(glRef.current);

            points.forEach((point_arr, index) => {

                const modified_points = polygon[index].map((point) => {
                    return [...point, 0];
                });

                const modified_points_2 = polygon[index].map((point) => {
                    return [point[0] + 0.1, point[1] + 0.1, 0.2];
                });

                modified_points_3 = [...modified_points_3, ...points[index].map((point) => {
                    return [...point, 0];
                })]

                modified_points_4 = [...modified_points_4, ...points[index].map((point) => {
                    return [point[0] + 0.1, point[1] + 0.1, 0.2];
                })]

                for (let i = 0; i + 1 < modified_points?.length; i += 1) {
                    polygon_triangles.push(modified_points[i]);
                    polygon_triangles.push(modified_points[i + 1]);
                    polygon_triangles.push(modified_points_2[i]);

                    polygon_triangles.push(modified_points_2[i]);
                    polygon_triangles.push(modified_points_2[i + 1]);
                    polygon_triangles.push(modified_points[i + 1]);
                }

            })


            try {
                drawTriangleFunc(
                    modified_points_4.flat(),
                    modified_points_3.flat(),
                    polygon_triangles.flat()
                );
            } catch (e) {
                console.log(e);
            }


        }
    }, [polygon, points]);

    useEffect(() => {
        document
            .getElementById("extrudeId")
            ?.addEventListener("drawextrude", (event: any) => {
                const points = event.detail?.faces;

                const polygons = event.detail?.polygon;

                setPoints(points ?? []);

                setPolygon(polygons);
            });

        return () => {
            document
                .getElementById("extrudeId")
                ?.removeEventListener("drawextrude", (event: any) => {
                    const points = event.detail.points;

                    const polygons = event.detail?.polygon;

                    setPoints(points ?? []);

                    setPolygon(polygons);
                });
        };
    }, []);

    return (
        <>
            <section id={'extrudeId'} className={styles.drawingBoardContainer} style={{display: is_visible ? null : 'none', height: is_visible ? null : 0}}>

                <div className={styles.buttonContainer}>
                    <ButtonN onPress={onDrawNew}>Draw New</ButtonN>

                </div>

                <canvas
                    ref={extrudeCanvasRef}
                    width={1200}
                    height={800}
                    style={{touchAction: "none"}}
                />

            </section>
        </>
    );
};

export default ExtrudeDrawing;
