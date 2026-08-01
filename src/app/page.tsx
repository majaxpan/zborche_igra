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
  } = useZborcheGame();

  const [isModalOpen, setIsModalOpen] = useState(true);

  if (!secretWord) {
    return <div>Се вчитува...</div>;
  }

  return (
    <main>
      <h1>ЗБОРЧЕ</h1>
      <h2>{secretWord}</h2>

      <GameBoard
        board={board}
        colors={colors}
        row={currentRow}
        tile={currentColumn}
        invalidSubmitAttempt={invalidSubmitAttempt}
      />
      <Keyboard onKeyPress={handleKeyPress} />

      <EndGameModal
        gameStatus={gameStatus}
        secretWord={secretWord}
        isOpen={isModalOpen}
        setIsOpen={setIsModalOpen}
      />
    </main>
  );
}
