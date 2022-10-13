import styles from "./ellipse.module.scss";

export default function Ellipse({ mousePosition }) {
  return (
    <div
      style={{
        top: mousePosition.y ? 50 - mousePosition.y / 10 : "0px",
        right: mousePosition.x ? -50 + mousePosition.x / 10 : "0px",
        position: "absolute",
      }}
      className={styles.ellipse}
    ></div>
  );
}