import { animate, useMotionValue } from "framer-motion";
import { useEffect, useState } from "react";

export function useAnimatedText(text: string, speed: number = 2) {
    let animatedCursor = useMotionValue(0);
    let [cursor, setCursor] = useState(0);
    let [prevText, setPrevText] = useState(text);
    let [isSameText, setIsSameText] = useState(true);
  
    if (prevText !== text) {
      setPrevText(text);
      setIsSameText(text.startsWith(prevText));
  
      if (!text.startsWith(prevText)) {
        setCursor(0);
      }
    }
  
    useEffect(() => {
      if (!isSameText) {
        animatedCursor.jump(0);
      }
  
      const words = text.split(' ');
      
      let controls = animate(animatedCursor, words.length, {
        duration: Math.max(words.length * 0.1, speed),
        ease: "easeOut",
        onUpdate(latest) {
          setCursor(Math.floor(latest));
        },
      });
  
      return () => controls.stop();
    }, [animatedCursor, isSameText, text, speed]);
  
    const words = text.split(' ');
    return words.slice(0, cursor).join(' ');
  }
  