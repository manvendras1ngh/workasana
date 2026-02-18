import { useState, useEffect } from "react";

const messages = [
  "Spinning up the server...",
  "Free tier problems, hang tight...",
  "Waking up the backend from its nap...",
  "Establishing connection, please wait...",
  "Almost there, the server is stretching...",
  "Still warming up, thanks for your patience...",
  "The app isn't slow, Render free tier is just... cozy...",
];

export function ColdStartLoader() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [dots, setDots] = useState("");

  useEffect(() => {
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 3000);
    return () => clearInterval(msgInterval);
  }, []);

  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-6 bg-background">
      <div className="flex gap-1.5">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-3 w-3 rounded-full bg-primary animate-bounce"
            style={{ animationDelay: `${i * 150}ms` }}
          />
        ))}
      </div>
      <p className="text-muted-foreground text-sm min-w-[320px] text-center transition-opacity duration-300">
        {messages[messageIndex]}
        {dots}
      </p>
    </div>
  );
}
