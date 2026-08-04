import { useState, useEffect, useRef } from "react";

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
        attempt: currentRow,
      }),
    });

    const data = await response.json();

    console.log(data);

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

  const gameState = {
    board: board,
    colors: colors,
    keyboardColors: keyboardColors,
    currentRow: currentRow,
    currentColumn: currentColumn,
    gameStatus: gameStatus,
    date: new Date().toDateString(),
  };

  const hasLoaded = useRef(false);

  function saveGameState() {
    //let newGameState = JSON.stringify(gameState);
    //localStorage.setItem("zborche-game", newGameState);

    //localStorage.setItem("zborche-game", JSON.stringify(gameState));

    if (hasLoaded.current) {
      localStorage.setItem("zborche-game", JSON.stringify(gameState));
    }
  }

  function loadGameState() {
    const savedGame = localStorage.getItem("zborche-game");

    if (savedGame !== null) {
      const parsedGame = JSON.parse(savedGame);
      const today = new Date().toDateString();

      if (parsedGame.date === today) {
        //restore
        setBoard(parsedGame.board);
        setColors(parsedGame.colors);
        setKeyboardColors(parsedGame.keyboardColors);
        setCurrentRow(parsedGame.currentRow);
        setCurrentColumn(parsedGame.currentColumn);
        setGameStatus(parsedGame.gameStatus);
      }
    }
  }

  useEffect(() => {
    saveGameState();
  }, [board, colors, keyboardColors, currentRow, currentColumn, gameStatus]);

  useEffect(() => {
    loadGameState();
    hasLoaded.current = true;
  }, []);

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
