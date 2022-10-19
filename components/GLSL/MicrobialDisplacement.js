import { useEffect, useRef } from "react";
import { createNoise3D } from "simplex-noise";
import { mat4 } from "gl-matrix";

const MicrobialDisplacement = ({ width, height }) => {
  const canvas = useRef();

  useEffect(() => {
    let vertexData;
    let colorData;
    const noise3d = createNoise3D();
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl");
    var loop;

    function generatePointVertex(time) {
      const points = [];
      const colorArr = [];
      const X = 100;
      const Y = 100;
    
      for (let pointX = -100; pointX < X; pointX++) {
        const strip = [];
        for (let pointY = -100; pointY < Y; pointY++) {
          const aX = (pointY / Y);
          const aY = (pointX / X);
          const aZ = 0;
          const bX = aX;
          const bY = ((pointX + 1) / X);
          const bZ = 0;
          const cX = ((pointY + 1) / Y);
          const cY = aY;
          const cZ = 0;
          const [dX, dY, dZ] = [cX, cY, 0];
          const [eX, eY, eZ] = [bX, bY, 0];
          const fX = cX;
          const fY = bY;
          const fZ = 0;
          strip.push(
            aX,
            aY,
            aZ,
            bX,
            bY,
            bZ,
            cX,
            cY,
            cZ,
            dX,
            dY,
            dZ,
            eX,
            eY,
            eZ,
            fX,
            fY,
            fZ
          );
        }
        points.push(...strip)
    
        for (let i = 0; i < strip.length; i++) {
          const noiseVal = noise3d(pointX * 0.04, (i / (X / 0.2)), (time + 1) / 20);
          colorArr.push(Math.abs(noiseVal))
        }
      }
    
      return {vertices: points, colors: colorArr};
    }

    vertexData = generatePointVertex(1).vertices;
    colorData = generatePointVertex(1).colors;

    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexData),
      gl.DYNAMIC_DRAW
    );

    const colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(colorData),
      gl.DYNAMIC_DRAW
    );

    const vertexShader = gl.createShader(gl.VERTEX_SHADER);

gl.shaderSource(
  vertexShader,
  `
  precision highp float;

  attribute vec3 position;
  attribute vec3 color;
  varying vec3 vColor;
  varying vec3 vPosition;

  uniform mat4 matrix;

  void main() {
      vColor = color;
      vPosition = vec3(position.r, position.g, position.b - sqrt(color.b) / 14.0);
      if (vPosition.b < -0.049) {
        vPosition.b /= vColor.r;
        vColor = vec3(2.0, 0.9, 0.4);
      };
      gl_Position = (matrix) * vec4(vPosition, 1.0);
  }
`
);

gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(
  fragmentShader,
  `
  precision highp float;

  varying vec3 vColor;

  void main() {
      gl_FragColor = abs(vec4(1.1 - vColor.r, 0.09 - vColor.g, 0.09 - vColor.b, 1.0));
  }
`
);
gl.compileShader(fragmentShader);

    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    const positionLocation = gl.getAttribLocation(program, `position`);
    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

    const colorLocation = gl.getAttribLocation(program, `color`);
    gl.enableVertexAttribArray(colorLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    // always do this after linking and using program
    const uniformLocations = {
      matrix: gl.getUniformLocation(program, `matrix`),
    };

    const modelMatrix = mat4.create();
    const viewMatrix = mat4.create();
    const projectionMatrix = mat4.create();
    mat4.perspective(
      projectionMatrix,
      (50 * Math.PI) / 180, // vertical field of view (angle in rad)
      canvas.width / canvas.height, // aspect ratio
      1e-4, // near cull distance
      1e4 // far cull distance
    );

    const mvMatrix = mat4.create();
    const mvpMatrix = mat4.create();

    mat4.translate(viewMatrix, viewMatrix, [0, -0.125, 1.0]);
    mat4.rotateX(modelMatrix, modelMatrix, Math.PI / 1.35);
    mat4.rotateZ(modelMatrix, modelMatrix, Math.PI / 1);
    // mat4.rotateX(viewMatrix, viewMatrix, Math.PI/2)
    mat4.invert(viewMatrix, viewMatrix);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let time = 0;

    function animate() {
      loop = requestAnimationFrame(animate);
      time += 1;
      const meshData = generatePointVertex(time);
      vertexData = meshData.vertices;
      colorData = meshData.colors;
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(vertexData),
        gl.DYNAMIC_DRAW
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colorData),
        gl.DYNAMIC_DRAW
      );
      // ROTATE
    //   mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2 / 100);
    // mat4.rotateZ(modelMatrix, modelMatrix, ((Math.PI / 2 / -200)));

      //  Projection Matrix (p), Model Matrix (m)
      // p * m
      mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
      mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
      gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
      gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
    }

    animate();

    return () => {
      cancelAnimationFrame(loop);
    };
  }, [width, height]);

  return (
    <>
      <canvas
        ref={canvas}
        style={{
          backgroundColor: "black",
          height: "100vh",
          width: "100%",
          padding: 0,
          margin: 0,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        width={width*1.5}
        height={height*1.5}
      ></canvas>
    </>
  );
};

export default MicrobialDisplacement;
