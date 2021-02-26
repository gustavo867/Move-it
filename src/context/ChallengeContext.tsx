import {
  createContext,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import Cookies from "js-cookie";
import challenges from "../../challenges.json";
import { LevelUpModal } from "../components/LevelUpModal";

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
  closeLevelUpModal: () => void;
};

type ChallengesProviderProps = {
  children: ReactNode;
  level: number;
  currentExperience: number;
  challengesCompleted: number;
};

export const ChallengeContext = createContext({} as IContext);

export function ChallengesProvider(props: ChallengesProviderProps) {
  const [level, setLevel] = useState(props.level ?? 1);
  const [currentExperience, setCurrentExperience] = useState(
    props.currentExperience ?? 0
  );
  const [challengesCompleted, setChallengeCompleted] = useState(
    props.challengesCompleted ?? 0
  );
  const [activeChallenge, setActiveChallenge] = useState<Challenge | null>(
    null
  );
  const [isLevelUpModalOpen, setIsLevelUpModalOpen] = useState(false);

  const experienceToNextlevel = Math.pow((level + 1) * 4, 2);

  const levelUp = useCallback(() => {
    setLevel((state) => state + 1);
    setIsLevelUpModalOpen(true);
  }, []);

  function closeLevelUpModal() {
    setIsLevelUpModalOpen(false);
  }

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

  useEffect(() => {
    Cookies.set("level", String(level));
    Cookies.set("currentExperience", String(currentExperience));
    Cookies.set("challengesCompleted", String(challengesCompleted));
  }, [level, currentExperience, challengesCompleted]);

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
      closeLevelUpModal,
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
      closeLevelUpModal,
    ]
  );

  return (
    <ChallengeContext.Provider value={values}>
      {props.children}
      {isLevelUpModalOpen && <LevelUpModal />}
    </ChallengeContext.Provider>
  );
}
