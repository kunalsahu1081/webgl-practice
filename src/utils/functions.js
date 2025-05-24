function shadeColor(color, percent) {

    var R = parseInt(color.substring(1,3),16);
    var G = parseInt(color.substring(3,5),16);
    var B = parseInt(color.substring(5,7),16);

    R = R * (100 + percent) / 100;
    G = G * (100 + percent) / 100;
    B = B * (100 + percent) / 100;

    R = (R<255)?R:255;  
    G = (G<255)?G:255;  
    B = (B<255)?B:255;  

    R = Math.round(R)
    G = Math.round(G)
    B = Math.round(B)

    var RR = ((R.toString(16).length==1)?"0"+R.toString(16):R.toString(16));
    var GG = ((G.toString(16).length==1)?"0"+G.toString(16):G.toString(16));
    var BB = ((B.toString(16).length==1)?"0"+B.toString(16):B.toString(16));

    return "#"+RR+GG+BB;
}

export const drawLeaf = (
    x,
    y,
    z,
    a,
    b,
    c,
    current_leaf_darkness,
    leaf_lengthmber,
    canvaRef,
) => {
    const leaf_seg_length = 2;
    const color = shadeColor("#008000", current_leaf_darkness);
    current_leaf_darkness += 3;

    const angle = 0.3927;

    c -= 2 * angle;
    a -= angle;

    const canvas = canvaRef.current;

    const gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");


    if (!gl) {
        alert("WebGL not supported, falling back on experimental-webgl");
        return
    }
        

    // Init shaders
    var vs = `
        attribute vec4 a_Position;
        void main() {
            gl_Position = a_Position;
        }
    `;

    var fs = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }
    `;

    if (!initShaders(gl, vs, fs)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    var n = initVertexBuffers(gl, 0, 0, 0, 0, 0, 0);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Clear canvas
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Draw
    gl.drawArrays(gl.TRIANGLES, 0, n);
    


};

function initVertexBuffers(gl, x, y, z, a, b, c) {
    // Vertices
    var dim = 3;
    
    const coordinate = 200 / window.innerWidth;

    const del = 1.2926991;

    const verticesArray = generateVertices(x, y, z, a, b, c, coordinate, del);

    var vertices = new Float32Array(verticesArray);

    console.log(verticesArray);

    // Create a buffer object
    var vertexBuffer = gl.createBuffer();
    if (!vertexBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Assign the vertices in buffer object to a_Position variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if (a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, dim, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(a_Position);

    // Return number of vertices
    return vertices.length / dim;
}

function initShaders(gl, vs_source, fs_source) {
    // Compile shaders
    var vertexShader = makeShader(gl, vs_source, gl.VERTEX_SHADER);
    var fragmentShader = makeShader(gl, fs_source, gl.FRAGMENT_SHADER);

    // Create program
    var glProgram = gl.createProgram();

    // Attach and link shaders to the program
    gl.attachShader(glProgram, vertexShader);
    gl.attachShader(glProgram, fragmentShader);
    gl.linkProgram(glProgram);
    if (!gl.getProgramParameter(glProgram, gl.LINK_STATUS)) {
        alert("Unable to initialize the shader program");
        return false;
    }

    // Use program
    gl.useProgram(glProgram);
    gl.program = glProgram;

    return true;
}

function makeShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert("Error compiling shader: " + gl.getShaderInfoLog(shader));
        return;
    }
    return shader;
}

const generateVertices = (x, y, z, a, b, c, coordinate, del) => {

    const vertices_array = [];

    vertices_array.push(x, y, z);

    c -= 2 * del;
    a -= del;

    // vertices_array.push(x + 10, y + 10, z);

    // vertices_array.push(x + 20, y + 10, z);

    vertices_array.push((x + coordinate )* Math.sin(c) * Math.cos(a), (y + coordinate) * Math.sin(c) * Math.cos(b), (z + coordinate) * Math.cos(c));
        
    a+= del;
    vertices_array.push((x + coordinate) * Math.sin(c) * Math.cos(a), (y + coordinate) * Math.sin(c) * Math.cos(b), (z + coordinate) * Math.cos(c));

    a+= del;
    vertices_array.push((x + coordinate) * Math.sin(c) * Math.cos(a), (y + coordinate) * Math.sin(c) * Math.cos(b), (z + coordinate) * Math.cos(c));

    a-= 2*del * Math.PI;

    vertices_array.push((x + coordinate) * Math.sin(c) * Math.cos(a), (y + coordinate) * Math.sin(c) * Math.cos(b), (z + coordinate) * Math.cos(c));

    a+= del;
    vertices_array.push((x + coordinate) * Math.sin(c) * Math.cos(a), (y + coordinate) * Math.sin(c) * Math.cos(b), (z + coordinate) * Math.cos(c));
    a+= del;
    vertices_array.push((x + coordinate) * Math.sin(c) * Math.cos(a), (y + coordinate) * Math.sin(c) * Math.cos(b), (z + coordinate) * Math.cos(c));


    return vertices_array;

}