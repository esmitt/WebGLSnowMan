"use strict";

var dist = 80;

var texture;
var texCoord = [
    vec2(0, 0),
    vec2(0, 1),
    vec2(1, 1),
    vec2(1, 0)
];
var texSize = 64;

var canvas;
var gl;
var key = [];

var lightPosition = vec4(0.0, 1.0, 0.0, 0.0 );
var lightAmbient = vec4(0.6, 0.6, 0.6, 1.0 );
var lightDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var lightSpecular = vec4( 0.0, 0.0, 0.0, 1.0 );

var materialAmbient = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialDiffuse = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialSpecular = vec4( 1.0, 1.0, 1.0, 1.0 );
var materialShininess = 30.0;

var ambientProduct;
var diffuseProduct;
var specularProduct;

//Cube Structure
var pointsArray = [];
var colorsArray = [];
var texCoordsArray = [];

//Sphere Structures
var pointsArraySphere = [];
var colorsArraySphere = [];
var indexsArraySphere = [];
var normalsArraySphere = [];

var blue = vec4(0.0, 0.0, 1.0, 1,0 );
var yellow = vec4( 1.0, 1.0, 0.0, 1.0 );
var red = vec4( 1.0, 0.0, 0.0, 1.0 );
var black = vec4( 0.0, 0.0, 0.0, 1.0 )
var white = vec4( 1.0, 1.0, 1.0, 1.0 )
var brown = vec4( 0.647059, 0.164706, 0.164706, 1.0 )


var vertices = [
    vec4( dist, -10.0,  dist, 1.0),//0
    vec4(-dist, -10.0,  dist, 1.0),//1
    vec4(-dist, -10.0, -dist, 1.0),//2
    vec4( dist, -10.0, -dist, 1.0) //3
];

var vertexColors = [
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
    vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
    vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
    vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
    vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
    vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 ),  // white
];


var near = 0.1;
var far = 1000.0;

var radius = 4.0;
var theta  = 0.0;
var phi    = 0.0;
var dr = 5.0 * Math.PI/180.0;

var  fovy = 45.0;  // Field-of-view in Y direction angle (in degrees)
var  aspect = 1.0;       // Viewport aspect ratio

var modelViewMatrix, projectionMatrix;
var modelViewMatrixLoc, projectionMatrixLoc;
var modelViewMatrixLoc2, projectionMatrixLoc2, normalMatrixLoc;
var translation, scale, sColor, isPhongLighting;

// var eye;
const up = vec3(0.0, 1.0, 0.0);
//Eye Position
var x = 0.0;
var y = 0.0;
var z = -40.0;
//Eye Direction
var lx = 0.0;
var ly = 0.0;
var lz = 1.0;
//Eye Y Angle
var angle = 0.0;

function plus_button()
{
    z += 1;
}

function minus_button()
{
    z -= 1;
}

function createSphere(r) //Create a Sphere mesh (Vertex and Index)
{
    var latitudeBands = 15;
    var longitudeBands = 15;
    // var radius = 10;
    var radius = r;

    for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
        var theta = latNumber * Math.PI / latitudeBands;
        var sinTheta = Math.sin(theta);
        var cosTheta = Math.cos(theta);

        for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
            var phi = longNumber * 2 * Math.PI / longitudeBands;
            var sinPhi = Math.sin(phi);
            var cosPhi = Math.cos(phi);

            var x = cosPhi * sinTheta;
            var y = cosTheta;
            var z = sinPhi * sinTheta;

            //var u = 1 - (longNumber / longitudeBands);
            //var v = 1 - (latNumber / latitudeBands);

            // texturessArraySphere.push(u,v);
            normalsArraySphere.push(vec4(x, y, z, 0.0));
            normalsArraySphere.push(x, y, z, 0.0);
            // normalsArraySphere.push(vec4(x, y, z, 0.0));
            pointsArraySphere.push(vec4(radius * x, radius * y, radius * z, 1.0));
            colorsArraySphere.push(vertexColors[4]);
        }
    }

    for (var latNumber=0; latNumber < latitudeBands; latNumber++) {
        for (var longNumber=0; longNumber < longitudeBands; longNumber++) {
            var first = (latNumber * (longitudeBands + 1)) + longNumber;
            var second = first + longitudeBands + 1;
            indexsArraySphere.push(first);
            indexsArraySphere.push(second);
            indexsArraySphere.push(first + 1);

            indexsArraySphere.push(second);
            indexsArraySphere.push(second + 1);
            indexsArraySphere.push(first + 1);
        }
    }
};

function quad(a, b, c, d) {
     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[b]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[1]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[a]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[0]);

     pointsArray.push(vertices[c]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[2]);

     pointsArray.push(vertices[d]);
     colorsArray.push(vertexColors[1]);
     texCoordsArray.push(texCoord[3]);
}

function floor()
{
    quad( 0, 1, 2, 3 );
}

function configureTexture( image ) {
    texture = gl.createTexture();
    gl.bindTexture( gl.TEXTURE_2D, texture );
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D( gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, image );
    gl.generateMipmap( gl.TEXTURE_2D );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST_MIPMAP_LINEAR );
    gl.texParameteri( gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST );
    gl.uniform1i(gl.getUniformLocation(program, "texture"), 0);
}

var program, program2; //Shader Program
var cBuffer,vBuffer, vBufferS,tBuffer, iBuffer, nBuffer; //All Buffers
var vColor,vPosition, vPositionS ,vTexCoord, vNormal; //Color and Pos for Shader

window.onload = function init() {
    canvas = document.getElementById( "gl-canvas" );

    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );

    aspect =  canvas.width/canvas.height;

    gl.clearColor( 0.0, 0.5, 0.8, 1.0 );

    gl.enable(gl.DEPTH_TEST);

    //
    //  Load shaders and initialize attribute buffers
    //

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );
    floor();

    cBuffer = gl.createBuffer(); //Color Buffer for Outside of cube (Red)
    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(colorsArray), gl.STATIC_DRAW );

    vColor = gl.getAttribLocation( program, "vColor" ); //Color name Attr for shader
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor);

    vBuffer = gl.createBuffer(); //Vertex Buffer for Cube
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArray), gl.STATIC_DRAW );

    vPosition = gl.getAttribLocation( program, "vPosition" ); //Position name Attr for shader
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    tBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tBuffer );
    gl.bufferData( gl.ARRAY_BUFFER, flatten(texCoordsArray), gl.STATIC_DRAW );

    vTexCoord = gl.getAttribLocation( program, "vTexCoord" );
    gl.vertexAttribPointer( vTexCoord, 2, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vTexCoord );

    modelViewMatrixLoc = gl.getUniformLocation( program, "modelViewMatrix" ); //ModelViewMatrix name Attr for shader
    projectionMatrixLoc = gl.getUniformLocation( program, "projectionMatrix" ); //ProjectionMatric name Attr for shader

    var image = document.getElementById("texImage");
    configureTexture( image );

    //----------------------------------------

    program2 = initShaders( gl, "sphere-vertex", "sphere-fragment" );
    gl.useProgram( program2 );

    ambientProduct = mult(lightAmbient, materialAmbient);
    diffuseProduct = mult(lightDiffuse, materialDiffuse);
    specularProduct = mult(lightSpecular, materialSpecular);

    createSphere(5);

    vBufferS = gl.createBuffer(); //Vertex Buffer for Sphere
    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(pointsArraySphere), gl.STATIC_DRAW );

    vPositionS = gl.getAttribLocation( program2, "vPosition" ); //Position name Attr for shader
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPositionS );

    iBuffer = gl.createBuffer(); //Index Buffer for Sphere
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexsArraySphere), gl.STATIC_DRAW );

    nBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.bufferData( gl.ARRAY_BUFFER, flatten(normalsArraySphere), gl.STATIC_DRAW );

    vNormal = gl.getAttribLocation( program2, "vNormal" );
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vNormal);

    isPhongLighting = gl.getUniformLocation(program2, "isPhongLighting");
    translation = gl.getUniformLocation(program2, 'translation');
    scale = gl.getUniformLocation(program2, 'scale');
    sColor = gl.getUniformLocation( program2, "fColor");
    modelViewMatrixLoc2 = gl.getUniformLocation( program2, "modelViewMatrix" ); //ModelViewMatrix name Attr for shader
    projectionMatrixLoc2 = gl.getUniformLocation( program2, "projectionMatrix" ); //ProjectionMatric name Attr for shader
    normalMatrixLoc = gl.getUniformLocation( program2, "normalMatrix" );

    // document.getElementById("DirectionalPoint").onclick = function(){
    //     // lightPosition[3] = !lightPosition[3];
    //     lightPosition[3] = (lightPosition[3])?0:1;
    //     var textB = (lightPosition[3])?0:1;

    //     document.getElementById("text"+lightPosition[3]).style.visibility = 'visible';
    //     document.getElementById("text"+textB).style.visibility = 'hidden';
    // };

    canvas.onmousedown = handleMouseDown;
    document.onmouseup = handleMouseUp;
    document.onmousemove = handleMouseMove;

    render();
}

window.onkeydown = window.onkeyup = function(e){ //Multiple Keys
	var e = e || event;
	key[e.keyCode] = e.type == 'keydown';
};
(function loop(){
	var fraction = 0.3;
	var fraction2 = 0.6;
	var l = key.length, i;
	for(i = 0; i < l; i++){
		if(key[i]){
			switch (i) {
				case 87: x += lx * fraction; //W
						 z += lz * fraction;
						 break;
				// case 65: x -= (-(lz)/3) * fraction2;
				// 		 z -= ((lx)/3) * fraction2;
				// 		 break; //A
				// case 68: x += (-(lz)/3) * fraction2;
				// 		 z += ((lx)/3) * fraction2;
				// 		 break; //D
				case 83: x -= lx * fraction; //S
						 z -= lz * fraction;
						 break;
				// case 37: angle -= 0.01;
				// 		 lx = -Math.sin(angle);
				// 		 lz = Math.cos(angle);
				// 		 break; //<-
				// case 39: angle += 0.01;
				// 		 lx = -Math.sin(angle);
				// 		 lz = Math.cos(angle);
				// 		 break; //->
				default: //Everything else
			}
		}
	}

	setTimeout(loop,500/24);
})();

//Mouse events
var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var moonRotationMatrix = mat4();

function handleMouseDown(event) {
    mouseDown = true;
    lastMouseX = event.clientX;
    lastMouseY = event.clientY;
}


function handleMouseUp(event) {
    mouseDown = false;
}


function handleMouseMove(event) {
    if (!mouseDown) {
        return;
    }
    var newX = event.clientX;
    var newY = event.clientY;

    var deltaX = newX - lastMouseX
    var newRotationMatrix = mat4();
    newRotationMatrix = mult(newRotationMatrix , rotateY(-deltaX / 10));

    var deltaY = newY - lastMouseY;
    newRotationMatrix = mult(newRotationMatrix , rotateX(deltaY / 10));

    moonRotationMatrix = mult(newRotationMatrix , moonRotationMatrix);

    lastMouseX = newX
    lastMouseY = newY;
}

var render = function(){

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT); //Clear buffers

    modelViewMatrix = lookAt(vec3(x,y,z), vec3(x+lx,y+ly,z+lz) , up); //gluLookAt (eye, at, up)

    modelViewMatrix = mult(modelViewMatrix, moonRotationMatrix);

    projectionMatrix = perspective(fovy, aspect, near, far);

    normalMatrix = [
        vec3(modelViewMatrix[0][0], modelViewMatrix[0][1], modelViewMatrix[0][2]),
        vec3(modelViewMatrix[1][0], modelViewMatrix[1][1], modelViewMatrix[1][2]),
        vec3(modelViewMatrix[2][0], modelViewMatrix[2][1], modelViewMatrix[2][2])
    ];

    // normalMatrix = inverse(normalMatrix);
    // normalMatrix = transpose( normalMatrix );

    // //---------------Eye 1----------------//
    gl.useProgram( program2 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    gl.uniform1i(isPhongLighting, false);
    gl.uniform4f(scale, 0.05, 0.05, 0.05, 1);
    gl.uniform4f(translation, 1, 6.1, -2, 0.0);
    gl.uniform4fv(sColor, flatten(black));
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    // //---------------Eye 2----------------//
    gl.useProgram( program2 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    gl.uniform1i(isPhongLighting, false);
    gl.uniform4f(scale, 0.05, 0.05, 0.05, 1);
    gl.uniform4f(translation, -1, 6.1, -2, 0.0);
    gl.uniform4fv(sColor, flatten(black));
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    // //---------------button 1----------------//
    gl.useProgram( program2 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    gl.uniform1i(isPhongLighting, false);
    gl.uniform4f(scale, 0.08, 0.08, 0.08, 1);
    gl.uniform4f(translation, 0, 2.8, -2.8, 0.0);
    gl.uniform4fv(sColor, flatten(black));
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    // //---------------button 2----------------//
    gl.useProgram( program2 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    gl.uniform1i(isPhongLighting, false);
    gl.uniform4f(scale, 0.08, 0.08, 0.08, 1);
    gl.uniform4f(translation, 0, 1.5, -3.6, 0.0);
    gl.uniform4fv(sColor, flatten(black));
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    // //---------------button 3----------------//
    gl.useProgram( program2 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    gl.uniform1i(isPhongLighting, false);
    gl.uniform4f(scale, 0.08, 0.08, 0.08, 1);
    gl.uniform4f(translation, 0, 0, -3.9, 0.0);
    gl.uniform4fv(sColor, flatten(black));
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    // //---------------Arms----------------//
    for (var i = 0; i < 120; i++) {
        gl.useProgram( program2 );

        gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
        gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
        gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
        gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

        gl.uniform1i(isPhongLighting, false);
        gl.uniform4f(scale, 0.08, 0.08, 0.08, 1);
        gl.uniform4f(translation, 6-(i*.10), 1, 0, 0.0);
        gl.uniform4fv(sColor, flatten(brown));
        gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
        gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
        gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

        gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);
    }
    // gl.useProgram( program2 );

    // gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    // gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    // gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    // gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    // gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    // gl.uniform1i(isPhongLighting, false);
    // gl.uniform4f(scale, 0.08, 0.08, 0.08, 1);
    // gl.uniform4f(translation, 0, 1.5, -3.6, 0.0);
    // gl.uniform4fv(sColor, flatten(black));
    // gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    // gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    // gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    // gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    // //---------------Sphere 1----------------//
    gl.useProgram( program2 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    gl.uniform4fv( gl.getUniformLocation(program2,"ambientProduct"),flatten(ambientProduct) );
    gl.uniform4fv( gl.getUniformLocation(program2,"diffuseProduct"),flatten(diffuseProduct) );
    gl.uniform4fv( gl.getUniformLocation(program2,"specularProduct"),flatten(specularProduct) );
    gl.uniform4fv( gl.getUniformLocation(program2,"lightPosition"),flatten(lightPosition) );
    gl.uniform1f( gl.getUniformLocation(program2,"shininess"),materialShininess );

    gl.uniform1i(isPhongLighting, true);
    gl.uniform4f(scale, 0.5, 0.5, 0.5, 1);
    gl.uniform4f(translation, 0, 5, 0, 0.0);
    gl.uniform4fv(sColor, flatten(black));
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    // //---------------Sphere 2----------------//
    gl.useProgram( program2 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    gl.uniform1i(isPhongLighting, true);
    gl.uniform4f(scale, 0.8, 0.8, 0.8, 1);
    gl.uniform4f(translation, 0, 0, 0, 0.0);
    gl.uniform4fv(sColor, flatten(black));
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );
    gl.uniformMatrix3fv(normalMatrixLoc, false, flatten(normalMatrix) );

    gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    // //---------------Sphere 3----------------//
    gl.useProgram( program2 );

    gl.bindBuffer( gl.ARRAY_BUFFER, vBufferS);
    gl.vertexAttribPointer( vPositionS, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bindBuffer( gl.ARRAY_BUFFER, nBuffer);
    gl.vertexAttribPointer( vNormal, 4, gl.FLOAT, false, 0, 0 );

    gl.uniform1i(isPhongLighting, true);
    gl.uniform4f(scale, 1, 1, 1, 1);
    gl.uniform4f(translation, 0, -7, 0, 0.0);
    gl.uniform4fv(sColor, flatten(black));
    gl.uniformMatrix4fv( modelViewMatrixLoc2, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc2, false, flatten(projectionMatrix) );

    gl.drawElements(gl.TRIANGLES, indexsArraySphere.length, gl.UNSIGNED_SHORT, 0);

    //----------------floor-----------------//
    gl.useProgram( program );

    gl.bindBuffer( gl.ARRAY_BUFFER, cBuffer);
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.bindBuffer( gl.ARRAY_BUFFER, vBuffer);
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );

    gl.uniformMatrix4fv( modelViewMatrixLoc, false, flatten(modelViewMatrix) );
    gl.uniformMatrix4fv( projectionMatrixLoc, false, flatten(projectionMatrix) );

    gl.drawArrays( gl.TRIANGLES, 0, 6 );

    //SwapBuffers
    requestAnimFrame(render);
}
