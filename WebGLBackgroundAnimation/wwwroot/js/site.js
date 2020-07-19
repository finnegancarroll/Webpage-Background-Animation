//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html

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

    //Create shaders
    var vertexShaderSource = document.querySelector("#vertexshader").text;
    var pixelShaderSource = document.querySelector("#pixelshader").text;

    var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    var pixelShader = createShader(gl, gl.FRAGMENT_SHADER, pixelShaderSource);

    //Create program
    var program = createProgram(gl, vertexShader, pixelShader);

    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

    //Create vertex buffer
    var positionBuffer = gl.createBuffer();
    //Bind vertex buffer to GPU "handle"
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // three 2d points EXAMPLE
    var positions = [
        0, 0,
        0, 0.5,
        0.7, 0,
    ];

    //Load vertices into vertex buffer
    //gl.STATIC_DRAW => We will not be changing these vertices much
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    //Starting choords and size of screen we will project onto
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //Set clear color 
    gl.clearColor(0, 0, 0, 1);
    //Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);
    //Program to use
    gl.useProgram(program);
    //Enable vertex buffer
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    var size = 2;          // 2 components per iteration
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    var offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 3;
    gl.drawArrays(primitiveType, offset, count);
}

function createShader(gl, shaderName, source) {
    var shader = gl.createShader(shaderName);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    var result = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (result) {
        return shader;
    }
    //else
    gl.deleteShader();
    window.alert("Shader Creation Failed:" + shaderName);
}

//Both together our shaders create a program which must be passed to the GPU for execution
function createProgram(gl, vertexShader, fragmentShader) {
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

main();