"use client";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";
import { useZborcheGame } from "@/hooks/useZborcheGame";

export default function Home() {
  const secretWord = "КУЌАА";

   const {
    board,
    colors,
    currentRow,
    currentColumn,
    handleKeyPress
  } = useZborcheGame(secretWord);

  return (
    <main>
      <h1>ЗБОРЧЕ</h1>

      <GameBoard
        board={board}
        colors={colors}
        row={currentRow}
        tile={currentColumn}
      />
      <Keyboard onKeyPress={handleKeyPress} />
    </main>
  );
}
