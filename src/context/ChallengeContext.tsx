import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import challenges from "../../challenges.json";

type Challenge = {
  type: "body" | "eye";
  description: string;
  amount: number;
};

type IContext = {
  level: number;
  currentExperience: number;
  challengesCompleted: number;
  activeChallenge: Challenge;
  experienceToNextlevel: number;
  levelUp: () => void;
  startNewChallenge: () => void;
  resetChallenge: () => void;
  completeChallenge: () => void;
};

type ChallengesProviderProps = {
  children: ReactNode;
};

export const ChallengeContext = createContext({} as IContext);

export function ChallengesProvider({ children }: ChallengesProviderProps) {
  const [level, setLevel] = useState(1);
  const [currentExperience, setCurrentExperience] = useState(0);
  const [challengesCompleted, setChallengeCompleted] = useState(0);
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null
  );

  const experienceToNextlevel = Math.pow((level + 1) * 4, 2);

  const levelUp = useCallback(() => {
    setLevel((state) => state + 1);
  }, []);

  const startNewChallenge = useCallback(() => {
    const randomChallengeIndex = Math.floor(Math.random() * challenges.length);
    const challenge = challenges[randomChallengeIndex];

    setActiveChallenge(challenge as Challenge);

    new Audio("/notification.mp3").play();

    if (Notification.permission === "granted") {
      new Notification("Novo desafio 🎉", {
        body: `Valendo ${challenge.amount}xp!`,
      });
    }
  }, []);

  function completeChallenge() {
    if (!activeChallenge) {
      return;
    }

    const { amount } = activeChallenge;

    let finalExperience = currentExperience + amount;

    if (finalExperience >= experienceToNextlevel) {
      finalExperience = finalExperience - experienceToNextlevel;
      levelUp();
    }

    setCurrentExperience(finalExperience);
    setActiveChallenge(null);
    setChallengeCompleted((state) => state + 1);
  }

  useEffect(() => {
    Notification.requestPermission();
  }, []);

  const resetChallenge = useCallback(() => {
    setActiveChallenge(null);
  }, []);

  const values = useMemo(
    () => ({
      level,
      currentExperience,
      challengesCompleted,
      levelUp,
      startNewChallenge,
      activeChallenge,
      resetChallenge,
      experienceToNextlevel,
      completeChallenge,
    }),
    [
      level,
      currentExperience,
      challengesCompleted,
      levelUp,
      startNewChallenge,
      activeChallenge,
      resetChallenge,
      experienceToNextlevel,
      completeChallenge,
    ]
  );

  return (
    <ChallengeContext.Provider value={values}>
      {children}
    </ChallengeContext.Provider>
  );
}
