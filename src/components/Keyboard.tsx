"use client";

import { getColor } from "@/utils/getColor";

export default function Keyboard({ keyboardColors, onKeyPress }) {
  const macedonianKeyboard = [
    ["Љ", "Њ", "Е", "Р", "Т", "Ѕ", "У", "И", "О", "П", "Ш"],
    ["А", "С", "Д", "Ф", "Г", "Х", "Ј", "К", "Л", "Ч", "Ќ"],
    ["⏎", "З", "Џ", "Ц", "В", "Б", "Н", "М", "Ѓ", "Ж", "⌫"],
  ];

  return (
    <div className="w-full lg:w-fit lg:mx-auto md:w-fit md:mx-auto">
      <div className="flex flex-col gap-1.5 md:gap-2 lg:gap-3">
        {macedonianKeyboard.map((row, rowIndex) => (
          <div key={rowIndex} className="w-full lg:w-fit lg:mx-auto md:w-fit md:mx-auto flex gap-1.5 md:gap-2 lg:gap-3">
            {row.map((letter, letterIndex) => (
              <button
                onClick={() => onKeyPress(letter)}
                key={letterIndex}
                className={`flex-1 md:flex-none lg:flex-none md:w-10 lg:w-12 md:items-center md:justify-center lg:items-center lg:justify-center h-12 border border-gray-400 rounded-sm cursor-pointer transition hover:bg-black hover:text-white active:scale-95 ${getColor(keyboardColors[letter])}`}
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
