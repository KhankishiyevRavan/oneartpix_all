import { useEffect } from "react";

export const useIdleLogout = (onIdle: () => void, timeout = 5 * 60 * 1000) => {
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe") === "true";

    if (rememberMe) {
      return; // "Məni yadda saxla" seçilibsə, idle logout etmə
    }

    let timeoutId: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(onIdle, timeout);
    };

    const events = ["mousemove", "keydown", "click", "scroll"];

    for (const event of events) {
      window.addEventListener(event, resetTimer);
    }

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      for (const event of events) {
        window.removeEventListener(event, resetTimer);
      }
    };
  }, [onIdle, timeout]);
};
