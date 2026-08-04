"use client";
import { useEffect, useState } from "react";
import { getColor } from "@/utils/getColor";

export default function GameBoard({
  board,
  colors,
  row,
  tile,
  invalidSubmitAttempt,
}) {
  const [isShaking, setIsShaking] = useState(false);
  const [revealedTiles, setRevealedTiles] = useState([]);

  const submittedRow = colors.findLastIndex((row) =>
    row.some((color) => color !== ""),
  );

  useEffect(() => {
    console.log("invalid attempt:", invalidSubmitAttempt);
    setIsShaking(true);

    setTimeout(() => {
      setIsShaking(false);
    }, 500);
  }, [invalidSubmitAttempt]);

  useEffect(() => {
    const submittedRow = colors.findLastIndex((row) =>
      row.some((color) => color !== ""),
    );

    if (submittedRow === -1) {
      return;
    }

    colors[submittedRow].forEach((color, tileIndex) => {
      if (!color) return;

      setTimeout(
        () => {
          setRevealedTiles((prev) => [...prev, `${submittedRow}-${tileIndex}`]);
        },
        tileIndex * 150 + 300,
      );
    });
  }, [colors]);

  return (
    <div>
      <div className="flex flex-col gap-2 sm:gap-2 md:gap-3 lg:gap-4">
        {board.map((boardRow, rowIndex) => (
          <div
            key={rowIndex}
            className={`flex gap-2 sm:gap-2 md:gap-3 lg:gap-4 ${
              rowIndex === row && isShaking ? "shake" : ""
            }`}
          >
            {boardRow.map((tile, tileIndex) => {
              const color = colors[rowIndex][tileIndex];

              return (
                <div
                  key={tileIndex}
                  className={`
                    w-10 h-10
                    sm:w-12 sm:h-12
                    md:w-14 md:h-14
                    lg:w-15 lg:h-15
                    text-10 text-m md:text-xl lg:text-2xl
                    border border-gray-400
                    flex items-center justify-center
                    ${
                      revealedTiles.includes(`${rowIndex}-${tileIndex}`)
                        ? getColor(color)
                        : "bg-white"
                    }
                    ${color ? "flip" : ""}
                  `}
                  style={{
                    animationDelay: `${tileIndex * 0.15}s`,
                  }}
                >
                  {tile}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
