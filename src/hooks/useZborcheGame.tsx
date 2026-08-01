import { useState, useEffect } from "react";

import { selectRandomWord } from "@/utils/selectRandomWord";

import { checkWord } from "@/utils/wordChecker";
import { isValidWord } from "@/utils/wordValidator";

export function useZborcheGame() {
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

  const [gameStatus, setGameStatus] = useState("PLAYING");

  const [secretWord, setSecretWord] = useState(null);

  useEffect(() => {
    setSecretWord(selectRandomWord());
  }, []);

  const WORD_LENGTH = 5;
  const MAX_ATTEMPTS = 6;

  const LAST_LETTER_INDEX = WORD_LENGTH - 1;
  const LAST_ROW_INDEX = MAX_ATTEMPTS - 1;

  const [invalidSubmitAttempt, setInvalidSubmitAttempt] = useState(0);

  function updatePosition() {
    setCurrentColumn((prev) => Math.min(prev + 1, WORD_LENGTH));
  }

  function addLetter(letter) {
    if (currentColumn > LAST_LETTER_INDEX) {
      return;
    }
    const newBoard = board.map((row) => [...row]);

    newBoard[currentRow][currentColumn] = letter;

    updatePosition();

    setBoard(newBoard);
  }

  function removeLetter() {
    const newBoard = board.map((row) => [...row]);

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
      return;
    }

    const currentWord = board[currentRow].join("");
    if (!isValidWord(currentWord)) {
      setInvalidSubmitAttempt((prev) => prev + 1);
      return;
    }
    if (currentWord === secretWord) {
      setGameStatus("WON");
    } else {
      if (currentRow === LAST_ROW_INDEX) {
        setGameStatus("LOST");
      } else {
      }
    }

    const resultColors = checkWord(currentWord, secretWord);

    const newColors = colors.map((row) => {
      return [...row];
    });

    newColors[currentRow] = resultColors;

    setColors(newColors);

    if (currentWord != secretWord) {
      setCurrentRow((prev) => prev + 1);
      setCurrentColumn(0);
    }
  }

  function handleKeyPress(letter) {
    if (gameStatus !== "PLAYING") {
      return;
    }
    if (letter === "⌫") {
      removeLetter();
    } else if (letter === "ENTER") {
      submitWord();
    } else {
      addLetter(letter);
    }
  }

  return {
    board,
    colors,
    currentRow,
    currentColumn,
    gameStatus,
    handleKeyPress,
    secretWord,
    invalidSubmitAttempt
  };
}
