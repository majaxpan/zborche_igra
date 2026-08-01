//import { useState } from "react";

export default function EndGameModal({
  gameStatus,
  secretWord,
  isOpen,
  setIsOpen,
}) {
  if (gameStatus === "PLAYING" || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
        <div className="p-2">
          {gameStatus === "LOST"
            ? `Губитник! Тајниот збор е: ${secretWord}`
            : `Честитки. Не си губитник.`}
        </div>
        <div>
            <button onClick={() => setIsOpen(false)} className="border-2 p-2">Во ред</button>
        </div>
      </div>
    </div>
  );
}
