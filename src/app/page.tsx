"use client";
import { useEffect, useState } from "react";
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

  const [colors, setColors] = useState([
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

  const [submittedWords, setSubmittedWords] = useState([]);
  const [submittedRows, setSubmittedRows] = useState([]);

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
    addSubmittedWords(currentWord);
    setSubmittedRows(prev => [...prev, currentRow]);
    // if (currentWord === secretWord) {
    //   console.log("ПОБЕДА");
    // } else {
    //   console.log("ГРЕШЕН ЗБОР. ПРОДОЛЖИ!");
    // }

    const newColors = colors.map((row) => {
      return [...row];
    });

    for(let i=0; i<=maxNumColumns; i++){
      if(currentWord[i]===secretWord[i]){
        newColors[currentRow][i]='GREEN'
      }
      else{
        newColors[currentRow][i]='GRAY'
      }
    }
    setColors(newColors);

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

  function addSubmittedWords(word) {
    setSubmittedWords((prev) => [...prev, word]);
  }

  useEffect(() => {
    console.log(submittedWords);
  }, [submittedWords]);

  useEffect(() => {
    console.log(submittedRows);
  }, [submittedRows]);

  useEffect(() => {
    console.log(colors);
  }, [colors]);

  return (
    <main>
      <h1>ЗБОРЧЕ</h1>

      <GameBoard board={board} colors={colors} row={currentRow} tile={currentColumn} />
      <Keyboard onKeyPress={handleKeyPress} />
    </main>
  );
}
