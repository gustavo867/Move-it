import { useContext } from "react";
import { isPrimitive } from "util";
import { ChallengeContext } from "../context/ChallengeContext";

import styles from "../styles/components/LevelUpModal.module.css";

export function LevelUpModal() {
  const { level, closeLevelUpModal } = useContext(ChallengeContext);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <header>{level}</header>
        <strong>Parabéns</strong>
        <p>Você alcançou um novo level.</p>

        <button onClick={() => closeLevelUpModal()} type="button">
          <img src="/icons/close.svg" alt="Fechar Modal" />
        </button>
      </div>
    </div>
  );
}
