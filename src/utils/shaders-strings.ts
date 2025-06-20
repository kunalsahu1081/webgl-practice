export const try_vertex_shader = `

  attribute vec4 a_position;

  attribute vec4 a_color;

  varying vec4 v_color;

  void main() {

    gl_Position = a_position;

    v_color = a_color;

  }
`

export const try_fragment_shader = `

  precision mediump float;

  varying vec4 v_color;
 
  void main() {

    gl_FragColor = v_color; 
    
  }
`