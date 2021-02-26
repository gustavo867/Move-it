import { useContext } from "react";
import { ChallengeContext } from "../context/ChallengeContext";
import styles from "../styles/components/Profile.module.css";

export function Profile() {
  const { level } = useContext(ChallengeContext);

  return (
    <div className={styles.profileContainer}>
      <img src="https://github.com/gustavo867.png" alt="Gustavo" />
      <div>
        <strong>Gustavo Santana</strong>
        <p>
          <img src="icons/level.svg" alt="icon" />
          Level {level}
        </p>
      </div>
    </div>
  );
}
