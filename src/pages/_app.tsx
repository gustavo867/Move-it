import { ChallengesProvider } from "../context/ChallengeContext";
import { CountDownProvider } from "../context/CountDownContext";
import "../styles/global.css";

function MyApp({ Component, pageProps }) {
  return (
    <ChallengesProvider>
      <CountDownProvider>
        <Component {...pageProps} />
      </CountDownProvider>
    </ChallengesProvider>
  );
}

export default MyApp;
