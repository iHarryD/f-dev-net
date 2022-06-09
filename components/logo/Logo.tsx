import { useEffect, useRef, useState } from "react";
import logoStyles from "./Logo.module.css";

export default function Logo() {
  const [currentWord, setCurrentWord] = useState<string>("");
  const currentLetterIndex = useRef<number>(0);
  const logoWord = "Devnet";

  useEffect(() => {
    const intervalID = setInterval(() => {
      if (currentLetterIndex.current > logoWord.length + 1) {
        currentLetterIndex.current = 0;
      }
      setCurrentWord(logoWord.slice(0, currentLetterIndex.current));
      currentLetterIndex.current += 1;
    }, 1000);

    return () => clearInterval(intervalID);
  }, []);

  return (
    <div className={logoStyles.logoContainer}>
      <span>{currentWord}</span>
      <span className={logoStyles.typingIndicator}></span>
    </div>
  );
}
