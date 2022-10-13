import { useEffect, useState } from "react";
import { createNoise2D } from "simplex-noise";
import styles from "./HomeMenu.module.scss"
import MenuItems from "./MenuItems";
import { useWindowSize } from "@react-hook/window-size";

const HomeMenu = (props) => {
    const [menuItemPosX, setMenuItemPosX] = useState([])
    const [menuItemPosY, setMenuItemPosY] = useState([])
    const [width, height] = useWindowSize();

    useEffect(() => {
        const noise2d = createNoise2D();
        let time = 1;
        let loop;

        function changeMenuItemPos() {
            loop = requestAnimationFrame(changeMenuItemPos);
            time+=0.0001;
            const randomPosX = MenuItems.map((el, i) => Math.abs((noise2d(time+i, time+i)+0.5) * width));
            const randomPosY = MenuItems.map((el, i) => Math.abs((noise2d(time+i+i, time+i+i)+0.5) * height));
            setMenuItemPosX(randomPosX);
            setMenuItemPosY(randomPosY);
        }

        changeMenuItemPos();

        return () => {
            cancelAnimationFrame(loop)
        }
    }, [width, height])

    return ( 
        <ul>
            {MenuItems.map((el, i) => 
               <li 
                className={styles.menuItem}
                key={`menu-item-${i}`}
                style={{
                    top: menuItemPosY[i],
                    left: menuItemPosX[i]
                }}
               >{el}</li>
            )}
        </ul>
    );
}
 
export default HomeMenu;