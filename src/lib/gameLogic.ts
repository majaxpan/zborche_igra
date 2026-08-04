export function checkWord(currentWord, secretWord) {
  const used = Array(secretWord.length).fill(false);
  const rowColors = Array(secretWord.length).fill("GRAY");

  for (let i = 0; i < secretWord.length; i++) {
    if (currentWord[i] === secretWord[i]) {
      rowColors[i] = "GREEN";
      used[i] = true;
    }
  }

  for (let i = 0; i < secretWord.length; i++) {
    if (rowColors[i] === "GREEN") continue;

    let found = false;

    for (let k = 0; k < secretWord.length; k++) {
      if (!used[k] && currentWord[i] === secretWord[k]) {
        found = true;
        used[k] = true;
        break;
      }
    }

    if (found) {
      rowColors[i] = "YELLOW";
    }
  }
  return rowColors;
}
