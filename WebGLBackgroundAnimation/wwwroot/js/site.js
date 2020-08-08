//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html
var canvas = document.querySelector('#maincanvas');
var gl = canvas.getContext('webgl');
var program; 

function main() {
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

    //Create and use program
    program = createProgram(gl, vertexShader, pixelShader);
    gl.useProgram(program);

    //Create vertex buffer
    var positionBuffer = gl.createBuffer();
    //Bind vertex buffer to GPU "handle"
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    renderLoop();
}

function render() { 
    
    // Describes how we iterate through the vertex buffer for rendering
    var size = 2;          // Dimension of elemends (2d/34,...)
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position

    //What/Where/How many?
    var primitiveType = gl.LINES;
    var offset = 0;
    var count = 2;

    // three 2d points EXAMPLE
    var positions = [
        -1, -1,
        1, 1
    ];

    //Set clear color 
    gl.clearColor(0, 0, 0, 1);
    //Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Load vertices into vertex buffer
    //gl.STATIC_DRAW => We will not be changing these vertices much
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

    //Starting choords and size of screen we will project onto
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //Link the program to the attributes in the buffer
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    //Enable vertex buffer
    gl.enableVertexAttribArray(positionAttributeLocation);
    //Set how vertices are pulled out of the buffer for rendering
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    gl.drawArrays(primitiveType, offset, count);
}

//Loops the render function
function renderLoop() {
    render();
    //Recursive call to renderLoop()
    window.setTimeout(renderLoop, 1000 / 60);
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