"use client";
import { useState } from "react";

export default function GameBoard({board, setBoard, row, tile}) {
  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5">
            {row.map((tile, tileIndex) => (
              <div key={tileIndex} className="w-12 h-12 border border-gray-400">
                {tile}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
