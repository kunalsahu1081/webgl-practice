import earcut  from 'earcut';
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

        const pixel_points: any = [];

        points.forEach((point) => {
                pixel_points.push(toPixelSpace(point[0], point[1], width, height));
        })

        const flat_points = pixel_points.flat();

        const triangles = earcut(flat_points);

        console.log(pixel_points, width, height)

        const triangle_coords = [];

        for (let i = 0; i < triangles.length; i += 3) {
            const i1 = triangles[i] * 2;
            const i2 = triangles[i + 1] * 2;
            const i3 = triangles[i + 2] * 2;

            const p1 = toClipSpace(flat_points[i1], flat_points[i1 + 1], width, height);
            const p2 = toClipSpace(flat_points[i2], flat_points[i2 + 1], width, height);
            const p3 = toClipSpace(flat_points[i3], flat_points[i3 + 1], width, height);

            triangle_coords.push(p1);
            triangle_coords.push(p2);
            triangle_coords.push(p3);
        }

        console.log(triangle_coords)

        return triangle_coords;
    };