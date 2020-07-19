//Vertex Shader
<script id="vertexshader" type="notjs">

attribute vec4 a_position;
void main() {
    gl_Position = a_position;
}
    
</script>

//Pixel Shader
<script id="pixelshader" type="notjs">

precision mediump float;  
void main() {
    //Set pixel color to purple
    gl_FragColor = vec4(1, 0, 0.5, 1);
}
 
</script>

function main() {
    const canvas = document.querySelector('#maincanvas');
    // Initialize the GL context
    const gl = canvas.getContext('webgl');
    gl.canvas.width = window.innerWidth;
    gl.canvas.height = window.innerHeight;

    if (!gl) {
        alert('Unable to initialize WebGL. Your browser or machine may not support it.');
        return;
    }

    // Set clear color to black, fully opaque
    gl.clearColor(1.0, 0.0, 1.0, 1.0);
    // Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
}

function createShader(gl, shaderName, source) {
    var shader = gl.createShader(shaderName);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (success) {
        return shader;
    }
    //else
    gl.deleteShader();
    window.alert("Shader Creation Failed:" + shaderName);

}

main();