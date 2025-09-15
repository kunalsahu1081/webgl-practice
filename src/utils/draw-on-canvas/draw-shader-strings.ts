import earcut  from 'earcut';
import {bayazitDecompose} from './bayajit-conves'

export const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
                gl_Position = vec4(a_position, 0, 1);
        }
`;

export const fragmentShaderSource = `
        precision mediump float;
        void main() {
                gl_FragColor = vec4(0.2, 0.3, 0.9, 1.0);
        }
`;


const toClipSpace = (
        x: number,
        y: number,
        width: number,
        height: number
    ) => {
        return [(x / width) * 2 - 1, -((y / height) * 2 - 1)];
    };

export const interpolatePoints: any = (points: any[], index = 0, width = 0, height = 0) => {

        console.log(points.length, index);

        if (index + 1 < points.length) {

                const x1 = (points[index][0] + 1) * width / 2;
                const x2 = (points[index + 1][0] + 1) * width / 2;
                const y1 = (-points[index][1] + 1) * height / 2;
                const y2 = (-points[index + 1][1] + 1) * height / 2;



                const distance = Math.sqrt( (x1 - x2) * (x1 - x2) + 
                (y1 - y2) * (y1 - y2));

                if (distance > 5) {


                        const interpolotion_points = interpolatePoints2px({x: x1, y: y1}, {x: x2, y: y2}, 2, width, height);

                        const interpolation_length = interpolotion_points.length;

                        const n_points = [...points.slice(0, index + 1), ...interpolotion_points, ...points.slice(index + 1, points.length) ];

                        console.log(interpolation_length, points.length, n_points.length);

                        return interpolatePoints(n_points, index + interpolation_length + 1, width, height);


                } else {
                        return interpolatePoints(points, index + 1, width, height);
                }


        } 

        return points;

}


const toPixelSpace = (x = 0, y = 0, width = 0, height = 0) => {

        return [(x + 1) * width / 2, (-y + 1) * height / 2]

}


function interpolatePoints2px(p1: any, p2: any, step = 2, width = 0, height = 0) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const distance = Math.hypot(dx, dy);

        const count = Math.floor(distance / step);
        const points = [];

        for (let i = 1; i < count; i++) {
                const t = i / count;
                points.push(toClipSpace(p1.x + dx * t,p1.y + dy * t, width, height));
        }

        return points;
}

export const generate_face_top = (points: any[], width = 0, height = 0) => {

        
        const modified_points: any[] = points.flat();


        const triangles = earcut(modified_points);



        const modified_polygons: any[] = [];

        triangles.forEach((point: any) => {
                modified_polygons.push(points[point]);
        })
       

        // console.log(polygons, modified_polygons.flat())

        return modified_polygons;

        // console.log(polygons);
        
    };