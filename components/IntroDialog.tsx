"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/store/useGameStore";

const dialogLines = [
  "Hey there! 👋",
  "I'm Mel, a full-stack developer and musician.",
  "Welcome to my interactive 3D portfolio!",
  "Use WASD or Arrow keys to move around.",
  "Press Space to jump and explore.",
  "Feel free to look around and check out my work!",
  "Click anywhere to continue...",
];

export default function IntroDialog() {
  const { showDialog, currentDialogIndex, closeDialog, nextDialog } = useGameStore();
  const [visible, setVisible] = useState(showDialog);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!showDialog) {
      setVisible(false);
      return;
    }
    setVisible(true);
  }, [showDialog]);

  useEffect(() => {
    if (!showDialog || currentDialogIndex >= dialogLines.length) {
      closeDialog();
      return;
    }

    setDisplayText("");
    setIsTyping(true);
    
    const line = dialogLines[currentDialogIndex];
    let charIndex = 0;
    
    const typingInterval = setInterval(() => {
      if (charIndex < line.length) {
        setDisplayText(line.substring(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setIsTyping(false);
      }
    }, 40);

    return () => clearInterval(typingInterval);
  }, [currentDialogIndex, showDialog, closeDialog]);

  const handleClick = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayText(dialogLines[currentDialogIndex]);
      setIsTyping(false);
    } else {
      nextDialog();
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleClick();
    }
  };

  useEffect(() => {
    if (showDialog) {
      window.addEventListener("keydown", handleKeyDown);
      return () => window.removeEventListener("keydown", handleKeyDown);
    }
  }, [showDialog, isTyping, currentDialogIndex]);

  if (!visible) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={handleClick}
      role="dialog"
      aria-label="Character introduction"
    >
      <div className="relative max-w-2xl mx-4">
        {/* Dialog box */}
        <div className="bg-gradient-to-br from-slate-900/95 to-slate-800/95 border-2 border-amber-400/50 rounded-2xl p-8 shadow-2xl shadow-amber-400/20">
          {/* Character avatar area */}
          <div className="flex items-start gap-6">
            {/* Character sprite/icon */}
            <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center text-4xl shadow-lg">
              🎸
            </div>
            
            {/* Dialog content */}
            <div className="flex-1">
              {/* Character name */}
              <div className="mb-3">
                <span className="text-amber-400 font-bold text-xl tracking-wide">
                  Mel
                </span>
                <span className="text-slate-400 text-sm ml-2">
                  Full-Stack Developer
                </span>
              </div>
              
              {/* Dialog text */}
              <div className="min-h-[80px]">
                <p className="text-slate-100 text-lg leading-relaxed font-medium">
                  {displayText}
                  {isTyping && (
                    <span className="inline-block w-2 h-5 bg-amber-400 animate-pulse ml-1" />
                  )}
                </p>
              </div>
              
              {/* Continue indicator */}
              {!isTyping && (
                <div className="mt-4 flex items-center gap-2 text-slate-500 text-sm">
                  <span className="animate-bounce">▼</span>
                  <span>Click or press Enter to continue</span>
                </div>
              )}
            </div>
          </div>
          
          {/* Progress indicator */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {dialogLines.map((_, index) => (
              <div
                key={index}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentDialogIndex
                    ? "w-6 bg-amber-400"
                    : index < currentDialogIndex
                    ? "w-1.5 bg-amber-400/50"
                    : "w-1.5 bg-slate-600"
                }`}
              />
            ))}
          </div>
        </div>
        
        {/* Decorative corners */}
        <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-amber-400 rounded-tl-lg" />
        <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-amber-400 rounded-tr-lg" />
        <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-amber-400 rounded-bl-lg" />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-amber-400 rounded-br-lg" />
      </div>
    </div>
  );
}