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
    // const hasEmptyTile = board[currentRow].some((letter) => {
    //   if(letter === "") return true;
    //   else return false;
    // })
    const hasEmptyTile = board[currentRow].some(letter => letter === "");
    if(currentRow === maxNumRows){
      return;
    }
    if(hasEmptyTile){
      console.log("Enter was clicked, but the current row has empty tile(s), so must enter 5 letters. Just return.");
      return;
    }
    else {
      setCurrentRow((prev) => prev + 1);
      setCurrentColumn(0);
      console.log("Enter was clicked. Let's submit the word.");
    }
}

  function handleKeyPress(letter) {
    console.log(letter);
    if(letter === "⌫"){
      removeLetter();
    }
    else if(letter === "ENTER"){
      submitWord();
    }
    else{
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
