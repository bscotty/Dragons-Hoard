const fragmentShaderHeader = [''               // PREDEFINED STUFF FOR FRAGMENT SHADERS
    , '   precision highp float;'
].join('\n');

let time = 0;

function SceneObject(vertices) {
    const bpe = Float32Array.BYTES_PER_ELEMENT;

    this.vertexSize = 6;
    this.matrix = M.identityMatrix();

    this.setMatrix = function (src) {
        M.copy(this.matrix, src);
    };

    this.setVertices = function (vertices) {
        this.vertices = vertices;
    };

    this.init = function (gl) {
        if (!this.gl) {
            this.gl = gl;
            if (!this.buffer) {
                this.buffer = gl.createBuffer();
                this.vertexData = new Float32Array(this.vertices);
            }
        }
        gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertexData, gl.STATIC_DRAW);
        this.bindVertexAttribute('aPos', 3, gl.FLOAT, 6, 0);
        this.bindVertexAttribute('aNor', 3, gl.FLOAT, 6, 3);
    };

    this.bindVertexAttribute = function (name, len, type, stride, offset) {
        const gl = this.gl;
        const attr = gl.getAttribLocation(gl.program, name);
        gl.enableVertexAttribArray(attr);
        gl.vertexAttribPointer(attr, len, type, false, stride * bpe, offset * bpe);
    }
}

function Scene() {
    this.objects = [];

    this.addObject = function (obj) {
        this.objects.push(obj);
    };

    this.init = function (gl) {
        for (let n = 0; n < this.objects.length; n++) {
            this.objects[n].init(gl);
        }
    }
}

function gl_start(canvas, vertexShader, fragmentShader, update) {           // START WEBGL RUNNING IN A CANVAS
    try {
        canvas.gl = canvas.getContext('experimental-webgl');                // Make sure WebGl is supported.
    } catch (e) {
        throw 'Sorry, your browser does not support WebGL.';
    }

    setTimeout(function () {
        canvas.setShaders = function (vertexShader, fragmentShader) {       // Add the vertex and fragment shaders:

            const gl = this.gl, program = gl.createProgram();               // Create the WebGL program.

            function addShader(type, src) {                                 // Create and attach a WebGL shader.
                const shader = gl.createShader(type);
                gl.shaderSource(shader, src);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.log('Cannot compile shader:\n\n' + gl.getShaderInfoLog(shader));
                }
                gl.attachShader(program, shader);
            }

            addShader(gl.VERTEX_SHADER, vertexShader);                      // Add the vertex and fragment shaders.
            addShader(gl.FRAGMENT_SHADER, fragmentShaderHeader + fragmentShader);

            gl.linkProgram(program);                                        // Link the program and report any errors.
            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                console.log('Could not link the shader program!');
            }
            gl.useProgram(program);

            gl.uTime = gl.getUniformLocation(program, 'uTime');            // Remember address of uTime variable.

            gl.program = program;

            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
        };

        canvas.setShaders(vertexShader, fragmentShader);                   // Initialize everything,

        setInterval(function () {                                          // Start the animation loop.
            const gl = canvas.gl, scene = canvas.scene;

            if (!scene || !gl.program) {
                return;
            }

            if (gl.startTime === undefined) {                              // First time through,
                gl.startTime = Date.now();                                 //    record the start time.
            }
            time = (Date.now() - gl.startTime) / 1000;

            update(time);

            gl.uniform1f(gl.uTime, time);              // Set time for the shaders.

            for (let n = 0; n < scene.objects.length; n++) {
                const obj = scene.objects[n];
                obj.init(gl);

                const matrixAddr = gl.getUniformLocation(gl.program, 'matrix');

                const renderMatrix = M.identityMatrix();
                M.matrixMultiply([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, .3, 0, 0, 0, 1], obj.matrix, renderMatrix);
                gl.uniformMatrix4fv(matrixAddr, false, renderMatrix);

                const invMatrixAddr = gl.getUniformLocation(gl.program, 'invMatrix');
                const invMatrix = M.inverseMatrix(obj.matrix);
                gl.uniformMatrix4fv(invMatrixAddr, false, invMatrix);

                gl.drawArrays(gl.TRIANGLES, 0, obj.vertices.length / obj.vertexSize);
            }
        }, 30);

    }, 100); // Wait 100 milliseconds after page has loaded before starting WebGL.
}