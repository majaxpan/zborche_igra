"use client";
import { useState } from "react";
import GameBoard from "@/components/GameBoard";
import Keyboard from "@/components/Keyboard";

export default function Home() {
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

  const secretWord = "МАЈКА";

  function updatePosition() {
    if (currentRow === maxNumRows && currentColumn === maxNumColumns) {
      return;
    }

    if (currentColumn != maxNumColumns) {
      setCurrentColumn((prev) => prev + 1);
    }
    // else {
    //   setCurrentColumn(0);
    //   setCurrentRow((prev) => prev + 1);
    // }
  }

  function addLetter(letter) {
    const newBoard = [...board];

    newBoard[currentRow][currentColumn] = letter;

    updatePosition();

    setBoard(newBoard);
  }

  function removeLetter() {
    const newBoard = [...board];

    let newColumn = currentColumn;

    if (currentColumn === 0) {
      return;
    } else {
      newColumn = currentColumn - 1;
    }

    newBoard[currentRow][newColumn] = "";

    setBoard(newBoard);
    setCurrentColumn(newColumn);
  }

  function submitWord() {
    const hasEmptyTile = board[currentRow].some((letter) => letter === "");

    if (hasEmptyTile) {
      console.log("Need 5 letters");
      return;
    }

    const currentWord = board[currentRow].join("");

    if (currentWord === secretWord) {
      console.log("ПОБЕДА");
    } else {
      console.log("ГРЕШЕН ЗБОР. ПРОДОЛЖИ!");
    }

    setCurrentRow((prev) => prev + 1);
    setCurrentColumn(0);
  }

  function handleKeyPress(letter) {
    console.log(letter);
    if (letter === "⌫") {
      removeLetter();
    } else if (letter === "ENTER") {
      submitWord();
    } else {
      addLetter(letter);
    }
  }

  return (
    <main>
      <h1>Zborche</h1>

      <GameBoard board={board} row={currentRow} tile={currentColumn} />
      <Keyboard onKeyPress={handleKeyPress} />
    </main>
  );
}
