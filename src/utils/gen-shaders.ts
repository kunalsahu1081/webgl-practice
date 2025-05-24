
export function createShader(gl: any, type: any, source: string ) {

    var shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }
  
    console.log(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
  
}

export function createProgram(gl: any, vertexShader: any, fragmentShader: any) {

        var program = gl.createProgram();
        gl.attachShader(program, vertexShader);
        gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);

        var success = gl.getProgramParameter(program, gl.LINK_STATUS);
        if (success) {
                return program;
        }
        
        console.log(gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
}