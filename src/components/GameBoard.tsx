"use client";
import { useState } from "react";

export default function GameBoard() {
  const [board, setBoard] = useState([
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
  ]);

  const [currentColumn, setCurrentColumn] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);

  //0 based index
  const maxNumColumns = 4; //5 columns
  const maxNumRows = 5; //6 rows

  function updatePosition() {
    if (currentRow === maxNumRows && currentColumn === maxNumColumns) {
      return;
    }

    if (currentColumn != maxNumColumns) {
      setCurrentColumn((prev) => prev + 1);
    } else {
      setCurrentColumn(0);
      setCurrentRow((prev) => prev + 1);
    }
  }

  function addLetter(letter) {
    const newBoard = [...board];

    newBoard[currentRow][currentColumn] = letter;

    updatePosition();

    setBoard(newBoard);
  }

  return (
    <div>
      <button onClick={() => addLetter("A")} className="border bodred-black flex">Add A</button>
      <button onClick={() => addLetter("B")} className="border bodred-black flex">Add B</button>
      <button onClick={() => addLetter("C")} className="border bodred-black flex">Add C</button>
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
