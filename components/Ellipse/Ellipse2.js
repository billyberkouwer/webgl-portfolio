import styles from "./ellipse.module.scss";

export default function Ellipse2({ mousePosition }) {

  return (
    <div
      style={{
        position: "absolute",
        background: 'radial-gradient(50% 50% at 50% 50%, rgba(148, 27, 70, 0.5) 0%, rgba(217, 217, 217, 0) 100%)',
        width: '50vw',
        height: '50vw',
        transform: 'translate(50%, -50%)',
        top: mousePosition.y ? `calc(60% + ${50 + (mousePosition.y / 10)}px)` : "60%",
        right: mousePosition.x ? `calc(25% + ${ 50 - (mousePosition.x / 10)}px)` : "25%",
      }}
    ></div>
  );
}