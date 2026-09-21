import { useState, useEffect } from "react";

//import { isSaneGuess } from "@/utils/wordValidator";

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

  const [keyboardColors, setKeyboardColors] = useState({});

  const [currentColumn, setCurrentColumn] = useState(0);
  const [currentRow, setCurrentRow] = useState(0);

  const [gameStatus, setGameStatus] = useState("PLAYING");

  const [secretWord, setSecretWord] = useState(null);

  const WORD_LENGTH = 5;
  const MAX_ATTEMPTS = 6;

  const LAST_LETTER_INDEX = WORD_LENGTH - 1;
  const LAST_ROW_INDEX = MAX_ATTEMPTS - 1;

  const [invalidSubmitAttempt, setInvalidSubmitAttempt] = useState(0);

  const [gameId, setGameId] = useState(null);
  const [gameReady, setGameReady] = useState(false);

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

  async function submitWord() {
    if (!gameReady || gameId === null) {
      return;
    }

    const hasEmptyTile = board[currentRow].some((letter) => letter === "");
    const currentWord = board[currentRow].join("");

    // if (hasEmptyTile || !isSaneGuess(currentWord)) {
    //   setInvalidSubmitAttempt((prev) => prev + 1);
    //   return;
    // }

    if (hasEmptyTile) {
      setInvalidSubmitAttempt((prev) => prev + 1);
      return;
    }

    const response = await fetch("/api/game/guess", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        guess: currentWord,
        gameId,
      }),
    });

    const data = await response.json();

    console.log("GUESS RESPONSE:", data);

    console.log("History:", data.history);

    if (data.result === "INVALID_WORD") {
      setInvalidSubmitAttempt((prev) => prev + 1);
      return;
    }

    if (data.result === "CORRECT") {
      setGameStatus("WON");
    } else if (data.result === "LOST") {
      setSecretWord(data.secretWord);
      setGameStatus("LOST");
    }

    const resultColors = data.colors;

    const newKeyboardColors = { ...keyboardColors };

    for (let i = 0; i < WORD_LENGTH; i++) {
      const existingColor = newKeyboardColors[currentWord[i]];
      const newColor = resultColors[i];

      if (existingColor === "GREEN") {
        continue;
      }

      if (existingColor === "YELLOW" && newColor === "GRAY") {
        continue;
      }

      newKeyboardColors[currentWord[i]] = newColor;
    }
    setKeyboardColors(newKeyboardColors);

    const newColors = colors.map((row) => {
      return [...row];
    });

    newColors[currentRow] = resultColors;

    setColors(newColors);

    if (data.result === "INCORRECT") {
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
    } else if (letter === "⏎") {
      submitWord();
    } else {
      addLetter(letter);
    }
  }

  useEffect(() => {
    async function loadTodayGame() {
      const response = await fetch("/api/game/today");
      const data = await response.json();

      console.log("Today's game:", data);

      const newBoard = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
      ];

      const newColors = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
      ];

      const newKeyboardColors = {};

      data.history.forEach((historyEntry) => {
        const rowIndex = historyEntry.attempt - 1;

        newBoard[rowIndex] = historyEntry.word.split("");
        newColors[rowIndex] = historyEntry.colors;

        for (let i = 0; i < WORD_LENGTH; i++) {
          const letter = historyEntry.word[i];
          const newColor = historyEntry.colors[i];

          const existingColor = newKeyboardColors[letter];

          if (existingColor === "GREEN") {
            continue;
          }

          if (existingColor === "YELLOW" && newColor === "GRAY") {
            continue;
          }

          newKeyboardColors[letter] = newColor;
        }
      });

      console.log("RECONSTRUCTED BOARD:", newBoard);
      console.log("RECONSTRUCTED COLORS:", newColors);

      setBoard(newBoard);
      setColors(newColors);
      setCurrentRow(data.history.length);
      setKeyboardColors(newKeyboardColors);

      const lastHistoryEntry = data.history[data.history.length - 1];

      if (lastHistoryEntry?.status === "LOST") {
        setSecretWord(data.secretWord);
      }

      if (lastHistoryEntry) {
        setGameStatus(
          lastHistoryEntry.status === "WON"
            ? "WON"
            : lastHistoryEntry.status === "LOST"
              ? "LOST"
              : "PLAYING",
        );
      }
      console.log("STATE COLORS:", colors);

      setGameId(data.gameId);
      setGameReady(true);
    }

    loadTodayGame();
  }, []);

  useEffect(() => {
    console.log("COLORS STATE CHANGED:", colors);
  }, [colors]);

  return {
    board,
    colors,
    currentRow,
    currentColumn,
    gameStatus,
    handleKeyPress,
    secretWord,
    invalidSubmitAttempt,
    keyboardColors,
  };
}
