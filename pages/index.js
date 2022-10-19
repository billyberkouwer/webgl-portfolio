import HomeMenu from "../components/HomeMenu/HomeMenu";
import { createNoise2D } from "simplex-noise";
import { useRef } from "react";
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
