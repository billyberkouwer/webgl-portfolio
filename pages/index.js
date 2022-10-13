import useMouse from "@react-hook/mouse-position";
import { useEffect, useRef } from "react";
import Ellipse from "../components/Ellipse/Ellipse";
import Ellipse2 from "../components/Ellipse/Ellipse2";
import Header from "../components/Header/Header";
import HomeMenu from "../components/HomeMenu/HomeMenu";

export default function Home() {
  const pageRef = useRef();
  const mousePosition = useMouse(pageRef, {
    enterDelay: 100,
    leaveDelay: 100,
  });

  return (
    <div ref={pageRef} className="pageContainer">
      <Header />
      <Ellipse mousePosition={mousePosition}/>
      <HomeMenu />
    </div>
  );
}
