import { useContext } from "react";
import styles from "./DarkMode.module.scss";
import { ThemeContext } from "../../context/ThemeContext";


const DarkMode = () => {
  const theme = useContext(ThemeContext);

  if (!theme) {
    return null; // або якийсь fallback
  }

  const { toggle, mode } = theme;

  return (
    <div className={styles.container} onClick={toggle}>
      <div className={styles.icon}>🌙</div>
      <div className={styles.icon}>🔆</div>
      <div
        className={styles.ball}
        style={mode === "light" ? { left: "2px" } : { right: "2px" }}
      ></div>
    </div>
  );
};

export default DarkMode;
