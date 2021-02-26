import { useCallback, useContext } from "react";
import { ChallengeContext } from "../context/ChallengeContext";
import { CountDownContext } from "../context/CountDownContext";
import styles from "../styles/components/ChallengeBox.module.css";

export function ChallengeBox() {
  const { activeChallenge, resetChallenge, completeChallenge } = useContext(
    ChallengeContext
  );
  const { resetCountDown } = useContext(CountDownContext);

  const handleChallengeSucceeded = useCallback(() => {
    resetCountDown();
    completeChallenge();
  }, [completeChallenge, resetCountDown]);

  const handleChallengeFailed = useCallback(() => {
    resetCountDown();
    resetChallenge();
  }, [resetChallenge, resetCountDown]);

  return (
    <div className={styles.challengeBoxContainer}>
      {activeChallenge ? (
        <div className={styles.challengeActive}>
          <header>Ganhe {activeChallenge.amount}xp</header>

          <main>
            <img src={`icons/${activeChallenge.type}.svg`} />
            <strong>Novo desafio</strong>
            <p>{activeChallenge.description}</p>
          </main>

          <footer>
            <button
              type="button"
              onClick={() => handleChallengeFailed()}
              className={styles.challengeFailedButton}
            >
              Falhei
            </button>
            <button
              onClick={() => handleChallengeSucceeded()}
              type="button"
              className={styles.challengeSucceededButton}
            >
              Completei
            </button>
          </footer>
        </div>
      ) : (
        <div className={styles.challengeNotActive}>
          <strong>Finalize um ciclo para receber um desafio</strong>
          <p>
            <img src="icons/level-up.svg " alt="Level Up" />
            Avance de level completando desafios
          </p>
        </div>
      )}
    </div>
  );
}
