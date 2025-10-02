import React, { createContext, useContext, useState, ReactNode } from "react";

export interface Flashcard {
  id: number;
  front: string;
  back: string;
  department: string;
  year: string;
  phase: string;
}

export interface CreateFlashcard {
  front: string;
  back: string;
  department: string;
  year: string;
  phase: string;
}

interface FlashcardsContextType {
  cards: Flashcard[];
  addCard: (card: CreateFlashcard) => void;
  deleteCard: (id: number) => void;
}

const FlashcardsContext = createContext<FlashcardsContextType | undefined>(
  undefined
);

export const FlashcardsProvider = ({ children }: { children: ReactNode }) => {
  const [cards, setCards] = useState<Flashcard[]>([]);

  const addCard = (card: CreateFlashcard) => {
    const newCard: Flashcard = {
      ...card,
      id: Date.now(), // generate id here instead of page
    };
    setCards((prev) => [...prev, newCard]);
  };

  const deleteCard = (id: number) => {
    setCards((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <FlashcardsContext.Provider value={{ cards, addCard, deleteCard }}>
      {children}
    </FlashcardsContext.Provider>
  );
};

export const useFlashcards = () => {
  const context = useContext(FlashcardsContext);
  if (!context) {
    throw new Error("useFlashcards must be used within a FlashcardsProvider");
  }
  return context;
};