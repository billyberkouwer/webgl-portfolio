import Ellipse from "../components/Ellipse/Ellipse";
import HomeMenu from "../components/HomeMenu/HomeMenu";
import useMouse from "@react-hook/mouse-position";
import { createNoise2D } from "simplex-noise";

import { useRef, createRef } from "react";
import BackgroundLines from "../components/GLSL/BackgroundLines";

export default function Home({width, height}) {
  const pageRef = useRef();
  const noiseDisplacement = createNoise2D();
  
  return (
    <div ref={pageRef}>
      <BackgroundLines width={width} height={height} noiseDisplacement={noiseDisplacement} ref={pageRef}/>
      <HomeMenu width={width} height={height}  />
    </div>
  );
}
