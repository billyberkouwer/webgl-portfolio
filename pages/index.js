import Ellipse from "../components/Ellipse/Ellipse";
import HomeMenu from "../components/HomeMenu/HomeMenu";
import useMouse from "@react-hook/mouse-position";
import { useRef } from "react";

export default function Home({width, height}) {
  const pageRef = useRef();
  const mousePosition = useMouse(pageRef, {
    enterDelay: 100,
    leaveDelay: 100,
  });

  return (
    <div ref={pageRef}>
      <Ellipse mousePosition={mousePosition}/>
      <HomeMenu width={width} height={height}/>
    </div>
  );
}
