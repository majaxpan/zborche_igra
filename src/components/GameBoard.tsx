"use client";
import { useEffect, useState } from "react";

function getColor(color) {
  if (color === "GREEN") return "bg-green-400";
  if (color === "GRAY") return "bg-gray-300";
  if (color === "YELLOW") return "bg-yellow-200";
  return "bg-white";
}

export default function GameBoard({
  board,
  colors,
  row,
  tile,
  invalidSubmitAttempt,
}) {
  const [isShaking, setIsShaking] = useState(false);

  useEffect(() => {
    console.log("invalid attempt:", invalidSubmitAttempt);
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  }, [invalidSubmitAttempt]);

  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {board.map((boardRow, rowIndex) => (
          <div key={rowIndex} className={`flex gap-1.5 ${
          rowIndex === row && isShaking ? "shake" : ""}`}>
            {boardRow.map((tile, tileIndex) => (
              <div
                key={tileIndex}
                className={`w-12 h-12 border border-gray-400 ${getColor(colors[rowIndex][tileIndex])}`}
              >
                {tile}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
