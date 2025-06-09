import {try_vertex_shader, try_fragment_shader} from './shaders-strings';
import {createShader, createProgram} from './gen-shaders';
import { off } from 'process';

export const draw_triangle = (gl: WebGLRenderingContext, geometry: any[] = []) => {


        const vertex_shader_source = try_vertex_shader;

        const fragment_shader_source = try_fragment_shader;

        const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_source);

        const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);

        const program = createProgram(gl, vertex_shader, fragment_shader);

        // position of attribute a_position in the program
        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        const positionBuffer = gl.createBuffer();
        set_geometry(gl, positionBuffer, geometry);

        // position of attribute a_color in the program
        const colorAttributeLocation = gl.getAttribLocation(program, 'a_color');

        const colorBuffer = gl.createBuffer();
        set_colors(gl, colorBuffer);

        gl.useProgram(program);

        // pass data to position buffer attribute
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);


        // pass data to color buffer attribute

        gl.enableVertexAttribArray(colorAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        
        const c_size = 4;

        gl.vertexAttribPointer(colorAttributeLocation, c_size, type, normalize, stride, offset);

        // draw triangles
        const primitiveType = gl.TRIANGLES;
        const count = 6;

        gl.drawArrays(primitiveType, offset, count);


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

        var r2 = Math.random();
        var b2 = Math.random();
        var g2 = Math.random();

        const color_coordinates = [ r1, b1, g1, 1,
                r2, b2, g2, 1,
                r1, b1, g1, 1,
                r1, b1, g1, 1,
                r2, b2, g2, 1,
                r2, b2, g2, 1];

        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);

        gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(color_coordinates), gl.STATIC_DRAW);
}