import { useLayoutEffect, useRef, useState } from "react";
import { createNoise2D } from "simplex-noise";
import styles from "./HomeMenu.module.scss";
import MenuItems from "./MenuItems";
import Link from "next/link";

const HomeMenu = ({ width, height }) => {
  const [menuItemPosX, setMenuItemPosX] = useState([]);
  const [menuItemPosY, setMenuItemPosY] = useState([]);
  const [menuItemRot, setMenuItemRot] = useState([]);
  const menuItemRef = useRef([]);

  useLayoutEffect(() => {
    const noise2d = createNoise2D();
    let time = 1;
    let rotTime = 1;
    let loop;

    function changeMenuItemPos() {
      loop = requestAnimationFrame(changeMenuItemPos);
      time += 0.00005;
      rotTime += 0.005;
      const randomPosX = MenuItems.map(
        (el, i) => Math.abs(noise2d(time + i, time + i)) * width
      );
      const randomPosY = MenuItems.map(
        (el, i) => Math.abs(noise2d(time + (i + 10), time + (i + 10))) * height
      );
      const randomRot = MenuItems.map(
        (el, i) => noise2d(rotTime + (i + 20), rotTime + (i + 20)) * 5
      );
      setMenuItemPosX(randomPosX);
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
            left: menuItemPosX[i],
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
