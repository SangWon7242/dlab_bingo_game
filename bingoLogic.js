const BOARD_SIZE = 4;
const MAX_TEXT_LENGTH = 9;

function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE * BOARD_SIZE }, () => ({
    text: '',
    selected: false,
  }));
}

function countBingos(selectedGrid) {
  let total = 0;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    if (selectedGrid[row].every(Boolean)) {
      total += 1;
    }
  }

  for (let column = 0; column < BOARD_SIZE; column += 1) {
    if (selectedGrid.every((row) => row[column])) {
      total += 1;
    }
  }

  if (selectedGrid.every((row, index) => row[index])) {
    total += 1;
  }

  if (selectedGrid.every((row, index) => row[BOARD_SIZE - 1 - index])) {
    total += 1;
  }

  return total;
}

function isCellTextValid(text) {
  return text.trim().length <= MAX_TEXT_LENGTH;
}

function isBoardComplete(board) {
  return board.every((cell) => cell.text.trim().length > 0 && isCellTextValid(cell.text));
}

if (typeof module !== 'undefined') {
  module.exports = {
    BOARD_SIZE,
    MAX_TEXT_LENGTH,
    countBingos,
    createEmptyBoard,
    isBoardComplete,
    isCellTextValid,
  };
}
