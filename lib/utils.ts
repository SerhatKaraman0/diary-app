import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import React from "react"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function autoGrow(textAreaRef: React.RefObject<HTMLTextAreaElement | null>) {
  const { current } = textAreaRef;
  if (!current) return;
  current.style.height = "auto"; // Reset the height
  current.style.height = current.scrollHeight + "px"; // Set the new height
}

export const setNewOffset = (card: HTMLElement, mouseMoveDir: { x: number; y: number } = { x: 0, y: 0 }) => {
  const offsetLeft = card.offsetLeft - mouseMoveDir.x;
  const offsetTop = card.offsetTop - mouseMoveDir.y;

  return {
      x: offsetLeft < 0 ? 0 : offsetLeft,
      y: offsetTop < 0 ? 0 : offsetTop,
  };
};

export const setZIndex = (selectedCard: HTMLElement | null) => {
  if (!selectedCard) return;
  selectedCard.style.zIndex = "999";

  Array.from(document.getElementsByClassName("card")).forEach((card) => {
      if (card !== selectedCard && card instanceof HTMLElement) {
          card.style.zIndex = "998";
      }
  });
};
