import { useEffect, useRef, useState } from "react";
import { createNoise2D } from "simplex-noise";
import styles from "./HomeMenu.module.scss";
import MenuItems from "./MenuItems";
import Link from "next/link";

const HomeMenu = ({ width, height }) => {
  const [menuItemPosY, setMenuItemPosY] = useState([]);
  const [menuItemRot, setMenuItemRot] = useState([]);
  const menuItemRef = useRef([]);

  useEffect(() => {
    const noise2d = createNoise2D();
    let time = 1;
    let rotTime = 1;
    let loop;

    function changeMenuItemPos() {
      loop = requestAnimationFrame(changeMenuItemPos);
      time += 0.0001;
      rotTime += 0.005;
      const randomPosY = MenuItems.map(
        (el, i) => {
          const yPos = Math.abs(noise2d(time + (i + 10), time + (i + 10))) * height;
          if (yPos <= height) {return yPos} else {return yPos - 20}}
      );
      const randomRot = MenuItems.map(
        (el, i) => noise2d(rotTime + (i + 10), rotTime + (i + 10)) * 20
      );
      setMenuItemPosY(randomPosY);
      setMenuItemRot(randomRot);
    }

    changeMenuItemPos();

    return () => {
      cancelAnimationFrame(loop);
    };
  }, [width, height, menuItemRef]);

  return (
    <ul className={styles.menuContainer}>
      {MenuItems.map((el, i) => (
        <li
          className={styles.menuItem}
          key={`menu-item-${i}`}
          style={{
            top: menuItemPosY[i],
            transform: `rotate(${menuItemRot[i]}deg)`,
          }}
          ref={(el) => (menuItemRef.current[i] = el)}
        >
          <Link href={el.url}>
            <a className="link">{el.title}</a>
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default HomeMenu;
