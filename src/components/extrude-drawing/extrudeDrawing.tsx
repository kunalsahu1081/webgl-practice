import earcut from "earcut";

const ExtrudeDrawing = () => {
    const boundary_points: any[] = [];

    const front_faces: any[] = [];

    const generate_face_top = (points: any[]) => {
        const flat_points = points.flat();

        const triangles = earcut(flat_points);

        const triangle_coords = [];

        for (let i = 0; i < triangles.length; i += 3) {
            const i1 = triangles[i] * 2;
            const i2 = triangles[i + 1] * 2;
            const i3 = triangles[i + 2] * 2;

            const p1 = [flat_points[i1], flat_points[i1 + 1]];
            const p2 = [flat_points[i2], flat_points[i2 + 1]];
            const p3 = [flat_points[i3], flat_points[i3 + 1]];

            triangle_coords.push(p1);
            triangle_coords.push(p2);
            triangle_coords.push(p3);
        }

        return triangle_coords;
    };

    return <></>;
};
