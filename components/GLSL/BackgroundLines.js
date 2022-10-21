import { forwardRef, useEffect, useRef } from "react";
import { mat4, vec3 } from "gl-matrix";
import useMouse from "@react-hook/mouse-position";

const BackgroundLines = forwardRef(({width, height, noiseDisplacement}, ref) => {
  const canvas = useRef();
  const newRef = useRef();
  const time = useRef(0);
  const mousePositionRef = useRef({x: 0, y: 0})
  const mousePosition = useMouse(ref, {
    enterDelay: 0,
    leaveDelay: 0,
  });

  useEffect(() => {
    let vertexData;
    let colorData;
    const canvas = document.querySelector("canvas");
    const gl = canvas.getContext("webgl");
    var loop;

    function generatePointVertex(time) {
      const points = [];
      const X = 149;
      const Y = 149;
      const Z = 0;
      let [x_X, y_X, z_X] = [-0.5, -0.5, -0.5];
      let x_Y, y_Y, z_Y, x_Z, y_Z, z_Z;

      for (let pointX = 0; pointX < X; pointX++) {
        [x_X, y_X, z_X] = [
          (x_X +=
            1 / X +
            Math.abs(noiseDisplacement((pointX * time / 30) / X, 0) / (X * 4))),
          (y_X += noiseDisplacement((pointX * time / 30) / X, 0) / (X * 4)),
          (z_X += noiseDisplacement((pointX * time / 30) / X, 0) / (X * 4)),
        ];
        const xVertex = (vec3.create(), [x_X, y_X, z_X]);
        points.push(...xVertex);
        [x_Y, y_Y, z_Y] = [x_X, y_X, z_X];

        for (let pointY = 0; pointY < Y; pointY++) {
          [x_Y, y_Y, z_Y] = [
            (x_Y += noiseDisplacement((pointY * time / 30) / Y, 0) / (Y * 6)),
            (y_Y +=
              1 / X +
              Math.abs(
                noiseDisplacement((pointY * time / 30) / Y, 0) / (Y * 4)
              )),
            (z_Y += noiseDisplacement((pointY * time / 30) / Y, 0) / (Y * 6)),
          ];
          const yVertex = (vec3.create(), [x_Y, y_Y, z_Y]);
          points.push(...yVertex);
          [x_Z, y_Z, z_Z] = [x_Y, y_Y, z_Y];

          for (let pointZ = 0; pointZ < Z; pointZ++) {
            [x_Z, y_Z, z_Z] = [x_Z, y_Z, (z_Z += 1 / X)];
            const zVertex = (vec3.create(), [x_Z, y_Z, z_Z]);
            points.push(...zVertex);
          }
        }
      }
      return points;
    }

    vertexData = generatePointVertex(1);

    function randomColor(i) {
      return [
        Math.abs(noiseDisplacement(0, i)) + 0.2,
        Math.abs(noiseDisplacement(0, i)) + 0.2,
        Math.abs(noiseDisplacement(0, i)) + 0.8,
      ];
    }

    let colorIndex = 1;

    const createColor = (colorIndex) => {
      let colors = [];
      for (let i = 0; i < vertexData.length; i++) {
        colorData = colors.push(...randomColor(colorIndex + i / 2000));
      }
      colorData = colors;
    };

    createColor(0, colorIndex);

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

  uniform mat4 matrix;

  void main() {
      vColor = color;
      gl_Position = matrix * vec4(position, 1);
      gl_PointSize = 20.0;
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
      gl_FragColor = vec4(vColor, 1);
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
    mat4.translate(modelMatrix, modelMatrix, [0, 0, 0]);
    // mat4.rotateX(modelMatrix, modelMatrix, Math.PI / 1.4);
    mat4.translate(viewMatrix, viewMatrix, [0, 0, 0]);
    mat4.invert(viewMatrix, viewMatrix);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    let mousePos = 0;

    if (mousePosition.x !== null) {
      mousePositionRef.current.x = mousePosition.x;
    }
    if (mousePosition.y !== null) {
      mousePositionRef.current.y = mousePosition.y;
    }

    function animate() {
      loop = requestAnimationFrame(animate);
      time.current+=1;
      mousePos = (-mousePositionRef.current.y/30 ) + (-mousePositionRef.current.x/30 ) + (time.current/100);
      console.log(mousePos)
      createColor(time.current / 200);
      let displacedVertexes = generatePointVertex(mousePos);
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(displacedVertexes),
        gl.DYNAMIC_DRAW
      );

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(colorData),
        gl.DYNAMIC_DRAW
      );
      // ROTATE
      // mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2 / ((mouseLocation.x - mouseLocation.x / 2) + 100));
      // mat4.rotateY(modelMatrix, modelMatrix, Math.PI / 2 / 300);

      //  Projection Matrix (p), Model Matrix (m)
      // p * m
      mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
      mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
      gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
      gl.drawArrays(gl.LINE_STRIP, 0, displacedVertexes.length / 3);
    }

    animate();

    return () => {
      cancelAnimationFrame(loop);
    };
    
  }, [width, height, mousePosition, noiseDisplacement]);

  return (
    <div ref={newRef} style={{height: '100vh', position: 'absolute', zIndex: 0}}>
      <canvas
        ref={canvas}
        style={{
          backgroundColor: 'darkblue',
          height: "100vh",
          width: "100vw",
          padding: 0,
          margin: 0,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        width={width * 1.5}
        height={height * 1.5}
      ></canvas>
    </div>
  );
});

BackgroundLines.displayName = "BackgroundLines";

export default BackgroundLines;
