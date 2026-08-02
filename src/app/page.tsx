"use client";
import { useState } from "react";

import EndGameModal from "@/components/EndGameModal";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import { useZborcheGame } from "@/hooks/useZborcheGame";

export default function Home() {
  const {
    board,
    colors,
    currentRow,
    currentColumn,
    gameStatus,
    handleKeyPress,
    secretWord,
    invalidSubmitAttempt,
    keyboardColors,
  } = useZborcheGame();

  const [isModalOpen, setIsModalOpen] = useState(true);

  if (!secretWord) {
    return <div>Се вчитува...</div>;
  }

  return (
    <main className="min-h-screen w-full flex flex-col items-center justify-center gap-5 px-2">
      <h1 className="text-2xl font-bold tracking-wider text-black">ЗБОРЧЕ</h1>

      <GameBoard
        board={board}
        colors={colors}
        row={currentRow}
        tile={currentColumn}
        invalidSubmitAttempt={invalidSubmitAttempt}
      />
      <Keyboard 
        keyboardColors={keyboardColors} 
        onKeyPress={handleKeyPress} />

      <EndGameModal
        gameStatus={gameStatus}
        secretWord={secretWord}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </main>
  );
}
