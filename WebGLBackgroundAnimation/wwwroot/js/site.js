//https://webglfundamentals.org/webgl/lessons/webgl-fundamentals.html

var MSINS = 1000;

var canvas = document.querySelector('#maincanvas');
var gl = canvas.getContext('webgl');
var program; 

//Verticies of our graph
var verticies = [
    [-.9, -.7],
    [.5, .2],
    [.5, .2],
    [.3, -.2]
];

//The lines connecting verticies of the graph
//TEMPTEMPTEMPTEMPTEMPTEMPTEMPTEMPTEMPTEMPTEMPTEMPTEMP
var edges = [
    [0, 1],
    [1, 2],
    [2, 3]
]; 

//Each vertex has velocity
var velocities = [
    [1, -1],
    [-1, 1],
    [1, 0],
    [0, 1]
];

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

function render(fps) { 

    //SOME OF THESE CAN BE CALCULATED??? DONT NEED TO HARDCODE
    //THOSE THAT ARE HARDCODED CAN JUST GLOBAL CONST IF THEY ARE SPECIFIC TO THIS PROGRAM AND NEVER CHANGED

    // Describes how we iterate through the vertex buffer for rendering
    var size = verticies[0].length;          // Dimension of elemends (2d/34,...)
    var type = gl.FLOAT;   // the data is 32bit floats
    var normalize = false; // don't normalize the data
    var stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position

    //What/Where/How many?
    var primitiveType = gl.LINES;
    var offset = 0;
    var vertexCount = verticies.length;

    var timestep = 1 / (fps * 10);
    updateVerticies(vertexCount, size, timestep);

    //Set clear color 
    gl.clearColor(0, 0, 0, 1);
    //Clear the color buffer with specified clear color
    gl.clear(gl.COLOR_BUFFER_BIT);

    //Load vertices into vertex buffer
    //gl.STATIC_DRAW => We will not be changing these vertices much
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getLines()), gl.STATIC_DRAW);

    //Starting choords and size of screen we will project onto
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    //Link the program to the attributes in the buffer
    var positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    //Enable vertex buffer
    gl.enableVertexAttribArray(positionAttributeLocation);
    //Set how vertices are pulled out of the buffer for rendering
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    gl.drawArrays(primitiveType, offset, vertexCount*size);
}

//A vertex with multiple edges will be passed to opengl once per edge
function getLines() {
    var lines = [];

    //For each edge add the corresponding verticies to the 
    //list of lines to be drawn
    for (i = 0; i < edges.length; i++) {
        var edge = edges[i];
        //x of first vertex of edge
        lines.push(verticies[edge[0]][0]);
        //y of first vertex of edge
        lines.push(verticies[edge[0]][1]);
        //x of second vertex of edge
        lines.push(verticies[edge[1]][0]);
        //y of second vertex of edge
        lines.push(verticies[edge[1]][1]);
    }

    return lines;
}


//Update the positions of verticies based on velocity and timestep
function updateVerticies(count, size, timestep) {

    //There are "count" many verticies each of dimension "size"
    //For each we update their position based on their velocity
    for (i = 0; i < count; i++) {
        for (j = 0; j < size; j++) {

            //New position out of bounds => reverse velocity
            //Else update position as normal
            var newPosition = verticies[i][j] + (timestep * velocities[i][j]);
            if (Math.abs(newPosition) > 1) {
                velocities[i][j] = velocities[i][j] * -1;
                verticies[i][j] = newPosition;
            } else {
                verticies[i][j] = newPosition;
            }
        }
    }
}


//Loops the render function
function renderLoop() {
    //Recursive call to renderLoop()
    //1000 ms in a second, we will aim for 60 frames a second
    var fps = 60;
    var fixedStep = MSINS / fps;
    render(fps);
    window.setTimeout(renderLoop, fixedStep);
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