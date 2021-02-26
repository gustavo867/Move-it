import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ChallengeContext } from "./ChallengeContext";

type CountDownContextData = {
  minutes: number;
  seconds: number;
  hasFinished: boolean;
  isActive: boolean;
  startCountDown: () => void;
  stopCountDown: () => void;
  resetCountDown: () => void;
};

export const CountDownContext = createContext({} as CountDownContextData);

let countDownTimeout: NodeJS.Timeout;

export function CountDownProvider({ children }) {
  const { startNewChallenge } = useContext(ChallengeContext);

  const [time, setTime] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [hasFinished, setHasFinished] = useState(false);

  const minutes = Math.floor(time / 60);
  const seconds = time % 60;

  const stopCountDown = useCallback(() => {
    clearTimeout(countDownTimeout);
    setIsActive(false);
    setTime(0.1 * 60);
  }, []);

  const startCountDown = useCallback(() => {
    setIsActive(true);
  }, []);

  function resetCountDown() {
    clearTimeout(countDownTimeout);
    setIsActive(false);
    setHasFinished(false);
    setTime(25 * 60);
  }

  useEffect(() => {
    if (isActive && time > 0) {
      countDownTimeout = setTimeout(() => {
        setTime((state) => state - 1);
      }, 1000);
    } else if (isActive && time === 0) {
      setHasFinished(true);
      setIsActive(false);
      startNewChallenge();
    }
  }, [isActive, time]);

  const values = useMemo(
    () => ({
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountDown,
      stopCountDown,
      resetCountDown,
    }),
    [
      minutes,
      seconds,
      hasFinished,
      isActive,
      startCountDown,
      stopCountDown,
      resetCountDown,
    ]
  );

  return (
    <CountDownContext.Provider value={values}>
      {children}
    </CountDownContext.Provider>
  );
}
