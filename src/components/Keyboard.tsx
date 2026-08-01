"use client";
import { useState } from "react";

function getColor(color) {
  if (color === "GREEN") return "bg-green-400";
  if (color === "GRAY") return "bg-gray-300";
  if (color === "YELLOW") return "bg-yellow-200";
  return "bg-white";
}

export default function Keyboard({ keyboardColors, onKeyPress }) {
  const macedonianKeyboard = [
    ["Љ", "Њ", "Е", "Р", "Т", "Ѕ", "У", "И", "О", "П", "Ш"],
    ["А", "С", "Д", "Ф", "Г", "Х", "Ј", "К", "Л", "Ч", "Ќ"],
    ["ENTER", "З", "Џ", "Ц", "В", "Б", "Н", "М", "Ѓ", "Ж", "⌫"],
  ];

  return (
    <div>
      <div className="flex flex-col gap-1.5">
        {macedonianKeyboard.map((row, rowIndex) => (
          <div key={rowIndex} className="flex gap-1.5">
            {row.map((letter, letterIndex) => (
              <button
                onClick={() => onKeyPress(letter)}
                key={letterIndex}
                className={`w-8 h-12 border border-gray-400 ${getColor(keyboardColors[letter])}`}
              >
                {letter}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
