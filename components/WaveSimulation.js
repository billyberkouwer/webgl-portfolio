import { useEffect, useRef, useState } from 'react'
import { createNoise3D } from 'simplex-noise'
import { mat4 } from 'gl-matrix'

export default function WaveSimulation(props) {
  const canvas = useRef();
  const [init, setInit] = useState(1)
  
  useEffect(() => {
        if (init) {
        let vertexData;
        let colorData;
        const noise3d = createNoise3D();
        const canvas = document.querySelector("canvas");
        const gl = canvas.getContext("webgl");
        var loop;
        console.log(init)

        function generatePointVertex(time) {
        const points = [];
        const colorArr = [];
        const X = 100;
        const Y = 100;

        for (let pointX = 0; pointX < X; pointX++) {
            const strip = [];
            for (let pointY = 0; pointY < Y; pointY++) {
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
            const smallNoiseVal = noise3d(pointX * 0.2, i / (X / 2), (time + 1) / 100) / 6;
            const bigNoiseVal = Math.abs(noise3d(pointX * 0.05, i / (X / 0.5), (time + 1) / 50) / 4);
            const massiveNoiseVal = noise3d(pointX * 0.009, i / (X / 0.09), (time + 1) / 100);
            const sinWave = Math.sin(((time) / 20) + pointX * 0.07)
            const enhancedSinWave = (sinWave * 1.5);
            const noiseSin = createWave();
            function createWave() {
                if (smallNoiseVal + sinWave <= -1) {
                return enhancedSinWave + (smallNoiseVal/3) + massiveNoiseVal;
                } else {
                return enhancedSinWave + (smallNoiseVal/4) + (bigNoiseVal*1.25) + massiveNoiseVal;
                }
            }
            colorArr.push(noiseSin)
            }
        }
        return {vertices: points, colors: colorArr};
        }

        vertexData = generatePointVertex(1).vertices;
        colorData = generatePointVertex(1).colors;

        const positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.DYNAMIC_DRAW);

        const colorBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.DYNAMIC_DRAW);

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
            vColor = color * vec3(0.6, 0.9, 0.4);
            vPosition = position + (color * vec3(0.01, 0.05, 0.05));
            gl_Position = matrix * vec4(vPosition, 1);
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
            gl_FragColor = vec4(0.0 - vColor.r, 0.0 - vColor.g, 1.0 - vColor.b, 1.0);
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
        mat4.rotateX(modelMatrix, modelMatrix, Math.PI/1.5)
        mat4.rotateZ(modelMatrix, modelMatrix, Math.PI/2)
        mat4.translate(viewMatrix, viewMatrix, [-0.5, -0.3, 2]);
        mat4.invert(viewMatrix, viewMatrix);

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
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.DYNAMIC_DRAW);
        // ROTATE
        // mat4.rotateX(modelMatrix, modelMatrix, Math.PI/2 / ((mouseLocation.x - mouseLocation.x / 2) + 100));
        // mat4.rotateY(viewMatrix, viewMatrix, Math.PI / 2 / 300);

        //  Projection Matrix (p), Model Matrix (m)
        // p * m
        mat4.multiply(mvMatrix, viewMatrix, modelMatrix);
        mat4.multiply(mvpMatrix, projectionMatrix, mvMatrix);
        gl.uniformMatrix4fv(uniformLocations.matrix, false, mvpMatrix);
        gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
        }

        animate();
        }

        return () => {
            cancelAnimationFrame(loop);
        }
  }, [init])

  return (
    <canvas ref={canvas} style={{backgroundColor: 'blue', height: '100vh', width: '100%', padding: 0, margin: 0, position: 'absolute', top: 0, left: 0}} width={4000} height={2000}></canvas>
  )
}