const test = require('node:test');
const assert = require('node:assert/strict');

const {
  BOARD_SIZE,
  MAX_TEXT_LENGTH,
  countBingos,
  createEmptyBoard,
  isBoardComplete,
  isCellTextValid,
} = require('./bingoLogic');

test('counts completed rows, columns, and diagonals on a 4x4 board', () => {
  const selected = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => false)
  );

  for (let index = 0; index < BOARD_SIZE; index += 1) {
    selected[0][index] = true;
    selected[index][1] = true;
    selected[index][index] = true;
  }

  assert.equal(countBingos(selected), 3);
});

test('does not count incomplete lines', () => {
  const selected = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => false)
  );

  selected[0][0] = true;
  selected[0][1] = true;
  selected[0][2] = true;

  assert.equal(countBingos(selected), 0);
});

test('creates an editable empty 4x4 board model', () => {
  const board = createEmptyBoard();

  assert.equal(board.length, 16);
  assert.deepEqual(board[0], { text: '', selected: false });
});

test('requires every bingo cell to be filled before starting', () => {
  const incomplete = createEmptyBoard();
  const complete = createEmptyBoard().map((cell, index) => ({
    ...cell,
    text: `항목${index}`,
  }));

  assert.equal(isBoardComplete(incomplete), false);
  assert.equal(isBoardComplete(complete), true);
});

test('limits each bingo cell to fewer than 10 characters', () => {
  assert.equal(MAX_TEXT_LENGTH, 9);
  assert.equal(isCellTextValid('123456789'), true);
  assert.equal(isCellTextValid('1234567890'), false);
});
