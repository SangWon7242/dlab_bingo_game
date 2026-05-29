(function () {
  const boardElement = document.querySelector('#board');
  const bingoCountElement = document.querySelector('#bingo-count');
  const startButton = document.querySelector('#start-button');
  const endButton = document.querySelector('#end-button');
  const resetButton = document.querySelector('#reset-button');
  const overlay = document.querySelector('#bingo-overlay');
  const messageElement = document.querySelector('#message');
  const goalInputs = Array.from(document.querySelectorAll('input[name="goal"]'));

  let board = createEmptyBoard();
  let isPlaying = false;
  let bingoReached = false;

  function getGoal() {
    return Number(goalInputs.find((input) => input.checked).value);
  }

  function getSelectedGrid() {
    return Array.from({ length: BOARD_SIZE }, (_, row) =>
      Array.from({ length: BOARD_SIZE }, (_, column) => {
        const index = row * BOARD_SIZE + column;
        return board[index].selected;
      })
    );
  }

  function syncControls() {
    startButton.disabled = isPlaying;
    endButton.disabled = !isPlaying;
    goalInputs.forEach((input) => {
      input.disabled = isPlaying;
    });
  }

  function showMessage(message) {
    messageElement.textContent = message;
    messageElement.classList.toggle('is-visible', Boolean(message));
  }

  function syncBingoState() {
    const bingoCount = countBingos(getSelectedGrid());
    const goal = getGoal();
    bingoCountElement.textContent = String(bingoCount);
    bingoReached = isPlaying && bingoCount >= goal;
    overlay.classList.toggle('is-visible', bingoReached);
    overlay.setAttribute('aria-hidden', String(!bingoReached));
    resetButton.classList.toggle('is-visible', bingoReached);
  }

  function renderBoard() {
    boardElement.innerHTML = '';

    board.forEach((cell, index) => {
      const cellButton = document.createElement('div');
      const input = document.createElement('div');

      cellButton.className = 'cell';
      cellButton.tabIndex = 0;
      cellButton.setAttribute('role', 'button');
      cellButton.setAttribute('aria-label', `${index + 1}번 빙고 칸`);
      cellButton.setAttribute('aria-pressed', String(cell.selected));
      cellButton.classList.toggle('is-selected', cell.selected);
      cellButton.classList.toggle('is-locked', isPlaying);

      input.className = 'cell-input';
      input.contentEditable = String(!isPlaying);
      input.dataset.placeholder = `${index + 1}`;
      input.textContent = cell.text;

      input.addEventListener('input', () => {
        const nextText = input.textContent.replace(/\n/g, '').trim();

        if (!isCellTextValid(nextText)) {
          showMessage('10자 미만으로 입력해 주세요.');
          board[index].text = nextText.slice(0, MAX_TEXT_LENGTH);
          input.textContent = board[index].text;

          const range = document.createRange();
          const selection = window.getSelection();
          range.selectNodeContents(input);
          range.collapse(false);
          selection.removeAllRanges();
          selection.addRange(range);
          return;
        }

        board[index].text = nextText;
        showMessage('');
      });

      input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
        }
      });

      cellButton.addEventListener('click', () => {
        if (!isPlaying || bingoReached) {
          return;
        }

        board[index].selected = !board[index].selected;
        renderBoard();
      });

      cellButton.addEventListener('keydown', (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') {
          return;
        }

        event.preventDefault();
        cellButton.click();
      });

      cellButton.append(input);
      boardElement.append(cellButton);
    });

    syncControls();
    syncBingoState();
  }

  function startGame() {
    if (!isBoardComplete(board)) {
      showMessage('빈칸을 모두 채워주세요.');
      return;
    }

    isPlaying = true;
    bingoReached = false;
    showMessage('');
    renderBoard();
  }

  function endGame() {
    isPlaying = false;
    showMessage('');
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
    resetButton.classList.remove('is-visible');
    renderBoard();
  }

  function resetGame() {
    board = createEmptyBoard();
    isPlaying = false;
    bingoReached = false;
    showMessage('');
    renderBoard();
  }

  startButton.addEventListener('click', startGame);
  endButton.addEventListener('click', endGame);
  resetButton.addEventListener('click', resetGame);
  goalInputs.forEach((input) => input.addEventListener('change', syncBingoState));

  renderBoard();
})();
