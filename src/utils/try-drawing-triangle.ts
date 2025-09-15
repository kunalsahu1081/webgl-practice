import {try_vertex_shader, try_fragment_shader} from './shaders-strings';
import {createShader, createProgram} from './gen-shaders';
import {off} from 'process';

export const draw_triangle = (gl: WebGLRenderingContext,) => {

    const vertex_shader_source = try_vertex_shader;

    const fragment_shader_source = try_fragment_shader;

    const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_source);

    const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);

    const program = createProgram(gl, vertex_shader, fragment_shader);

    // position of attribute a_position in the program
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    const positionBuffer = gl.createBuffer();


    // position of attribute a_color in the program
    const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');

    const colorBuffer = gl.createBuffer();
    set_colors(gl, colorBuffer);

    gl.useProgram(program);

    // pass data to position buffer attribute
    gl.enableVertexAttribArray(positionAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    const size = 3;
    const type = gl.FLOAT;
    const normalize = false;
    const stride = 0;
    const offset = 0;

    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    gl.enableVertexAttribArray(colorAttributeLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    gl.vertexAttribPointer(colorAttributeLocation, 4, type, normalize, stride, offset);

    return function ( geometry: any[] = [], geometry_2: any[] = [], boundary: any[] = []) {
        for (let i = 0; i < boundary.length; i += 9) {

            set_geometry(gl, positionBuffer, boundary.slice(i, i + 9));

            const primitiveType = gl.TRIANGLES;

            gl.drawArrays(primitiveType, offset, 3);

        }


        // pass data to color buffer attribute

        // set_colors(gl, colorBuffer);

        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        gl.vertexAttribPointer(colorAttributeLocation, 4, type, normalize, stride, offset);

        for (let i = 0; i < geometry.length; i += 9) {

            set_geometry(gl, positionBuffer, geometry.slice(i, i + 9));

            const primitiveType = gl.TRIANGLES;

            gl.drawArrays(primitiveType, offset, 3);

        }

        // pass data to color buffer attribute

        set_colors(gl, colorBuffer);

        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        gl.vertexAttribPointer(colorAttributeLocation, 4, type, normalize, stride, offset);

        for (let i = 0; i < geometry_2.length; i += 9) {


            set_geometry(gl, positionBuffer, geometry_2.slice(i, i + 9));

            // draw triangles
            const primitiveType = gl.TRIANGLES;

            gl.drawArrays(primitiveType, offset, 3);

        }
    }

}


const set_geometry = (gl: WebGLRenderingContext, positionBuffer: any, geometry: any) => {

    const triangle_2d_cooords = geometry

    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_2d_cooords), gl.STATIC_DRAW);

}

function set_colors(gl: WebGLRenderingContext, colorBuffer: any) {
    // Pick 2 random colors.
    var r1 = Math.random();
    var b1 = Math.random();
    var g1 = Math.random();

    var r2 = r1;
    var b2 = b1;
    var g2 = g1;

    const color_coordinates = [r1, b1, g1, 1,
        r2, b2, g2, 1,
        r1, b1, g1, 1,
        r1, b1, g1, 1,
        r2, b2, g2, 1,
        r2, b2, g2, 1];

    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color_coordinates), gl.STATIC_DRAW);
}