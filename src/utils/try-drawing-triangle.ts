import {try_vertex_shader, try_fragment_shader} from './shaders-strings';
import {createShader, createProgram} from './gen-shaders';
import { create } from 'domain';

export const draw_triangle = (gl: WebGL2RenderingContext) => {


        const triangle_2d_cooords = [
                0, 1,
                -1, -1,
                1, -1,
                1, -1,
                0, 1,
                1, 1,
        ];

        const vertex_shader_source = try_vertex_shader;

        const fragment_shader_source = try_fragment_shader;

        const vertex_shader = createShader(gl, gl.VERTEX_SHADER, vertex_shader_source);

        const fragment_shader = createShader(gl, gl.FRAGMENT_SHADER, fragment_shader_source);

        const program = createProgram(gl, vertex_shader, fragment_shader);

        const positionAttributeLocation = gl.getAttribLocation(program, "a_position");

        // create new buffer
        const positionBuffer = gl.createBuffer();
        // bind this buffer to gl.Array_Buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        // add static data to this buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(triangle_2d_cooords), gl.STATIC_DRAW);

        // rendering gl code

        gl.useProgram(program);
        gl.enableVertexAttribArray(positionAttributeLocation);
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);


        const size = 2;
        const type = gl.FLOAT;
        const normalize = false;
        const stride = 0;
        const offset = 0;
        gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

        // draw triangles
        const primitiveType = gl.TRIANGLES;
        const count = 6;

        console.log('drawing something, count', count)

        gl.drawArrays(primitiveType, offset, count);


}