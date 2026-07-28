"use client";
import { useState } from "react";

function getColor(color){
  if (color === "GREEN") return "bg-green-400";
  if (color === "GRAY") return "bg-gray-300";
  if (color === "YELLOW") return "bg-yellow-200";
  return "bg-white"
}

export default function GameBoard({board, colors, row, tile}) {
  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5">
            {row.map((tile, tileIndex) => (
              <div key={tileIndex} className={`w-12 h-12 border border-gray-400 ${getColor(colors[rowIndex][tileIndex])}`}>
                {tile}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
