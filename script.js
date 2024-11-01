'use strict';

const emojis = [
  '😀',
  '😃',
  '😄',
  '😁',
  '😆',
  '😅',
  '😂',
  '🤣',
  '😊',
  '😇',
  '🙂',
  '🙃',
  '😉',
  '😌',
  '😍',
  '🥰',
  '😘',
  '😗',
  '😙',
  '😚',
  '😋',
  '😜',
  '🤪',
  '😝',
  '🤑',
  '🤗',
  '🤭',
  '🤫',
  '🤔',
  '🤐',
  '🤨',
  '😐',
  '😑',
  '😶',
  '😏',
  '😒',
  '🙄',
  '😬',
  '🤥',
  '😌',
  '😔',
  '😪',
  '😴',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🤧',
  '🥵',
  '🥶',
];

let numberOfCards = 0;
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let timer = 0;

function startGame() {
  const width = parseInt(document.getElementById('width').value);
  const height = parseInt(document.getElementById('height').value);

  document.querySelectorAll('.level-of-game').forEach((el) => {
    if (el.checked) {
      timer = setLevelOfGame(el.id);
    }
  });

  if (isOutOfRange(width, 4, 11)) {
    alert('The width should be between 5 and 10');
    return;
  }

  if (isOutOfRange(height, 3, 6)) {
    alert('The height should be between 3 and 6');
    return;
  }

  reset();
  setUpBoard(width, height);
}

function setUpBoard(width, height) {
  const board = document.getElementById('board');
  board.innerHTML = '';

  board.style.gridTemplateColumns = `repeat(${width}, 100px)`;
  board.style.gridTemplateRows = `repeat(${height}, 100px)`;

  numberOfCards = width * height;
  const selectedEmojis = shuffleArray(emojis).slice(0, numberOfCards / 2);
  const doubleEmojis = [...selectedEmojis, ...selectedEmojis];

  if (numberOfCards % 2 !== 0) {
    doubleEmojis.push('');
  }

  const gameEmojis = shuffleArray(doubleEmojis);

  gameEmojis.forEach((emoji) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.emoji = emoji;

    const emojiElement = document.createElement('span');
    emojiElement.textContent = emoji;
    emojiElement.style.visibility = 'hidden';
    card.appendChild(emojiElement);

    card.addEventListener('click', () => {
      flipCard(card, emojiElement);
    });

    board.appendChild(card);
  });
}

function setLevelOfGame(level) {
  switch (level) {
    case 'easy':
      return 1000;
    case 'medium':
      return 600;
    case 'hard':
      return 300;
  }
}

function flipCard(card, emojiElement) {
  if (lockBoard === true || card === firstCard || card.classList.contains('matched')) {
    return;
  }

  card.classList.add('flipped');
  emojiElement.style.visibility = 'visible';

  if (firstCard === null) {
    firstCard = card;
  } else {
    secondCard = card;
    checkForMatch();
  }
}

function checkForMatch() {
  const isMatch = firstCard.dataset.emoji === secondCard.dataset.emoji;

  if (isMatch) {
    disableCards();
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.classList.add('matched');
  secondCard.classList.add('matched');

  const adjustedTotal = numberOfCards % 2 === 0 ? numberOfCards : numberOfCards - 1;

  if (document.querySelectorAll('.card.matched').length === numberOfCards) {
    setTimeout(() => {
      alert('Congratulations! You win!');
    }, 500);
  }
  reset();
}

function unflipCards() {
  lockBoard = true;
  setTimeout(() => {
    firstCard.classList.remove('flipped');
    secondCard.classList.remove('flipped');

    firstCard.firstChild.style.visibility = 'hidden';
    secondCard.firstChild.style.visibility = 'hidden';

    reset();
  }, timer);
}

function reset() {
  [firstCard, secondCard] = [null, null];
  lockBoard = false;
}

function isOutOfRange(val, minVal, maxVal) {
  return val < minVal || val > maxVal;
}

function shuffleArray(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

document.getElementById('start-button').addEventListener('click', startGame);

// to do
// 1. timer
// 2. modal
// 3. list of records
