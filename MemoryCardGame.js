const gridContainer = document.querySelector(".grid-container");
let cards = [];
let finalMessageElement;
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let flippedPairs = [];

const pairMessages = {
  "1": "Julie's favorite moment captured!",
  "2": "Lenny's treasured memory!",
  "3": "Tejon Outlets road trip!",
  "4": "Celebrating at Lenny's cousin's wedding!",
  "5": "Making memories at the Kern County Fair!",
  "6": "Aftermath of Lenny's aunt's wedding!",
  "7": "A beautiful celebration at Lenny's mom's wedding!",
  "8": "Our new favorite ice cream spot!",
  "9": "UNO and crafts night!",
};

document.querySelector(".score").textContent = score;

cards = [
  {
    "image": "./assets/1.JPEG",
    "name": "1"
  },
  {
    "image": "./assets/2.JPG",
    "name": "2"
  },
  {
    "image": "./assets/3.jpg",
    "name": "3"
  },
  {
    "image": "./assets/4.jpeg",
    "name": "4"
  },
  {
    "image": "./assets/5.JPEG",
    "name": "5"
  },
  {
    "image": "./assets/6.JPEG",
    "name": "6"
  },
  {
    "image": "./assets/7.jpg",
    "name": "7"
  },
  {
    "image": "./assets/8.jpg",
    "name": "8"
  },
  {
    "image": "./assets/9.jpg",
    "name": "9"
  },
  {
    "image": "./assets/1.JPEG",
    "name": "1"
  },
  {
    "image": "./assets/2.JPG",
    "name": "2"
  },
  {
    "image": "./assets/3.jpg",
    "name": "3"
  },
  {
    "image": "./assets/4.jpeg",
    "name": "4"
  },
  {
    "image": "./assets/5.JPEG",
    "name": "5"
  },
  {
    "image": "./assets/6.JPEG",
    "name": "6"
  },
  {
    "image": "./assets/7.jpg",
    "name": "7"
  },
  {
    "image": "./assets/8.jpg",
    "name": "8"
  },
  {
    "image": "./assets/9.jpg",
    "name": "9"
  }
];
shuffleCards();
generateCards();

function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}

function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  score++;
  document.querySelector(".score").textContent = score;
  lockBoard = true;

  checkForMatch();
}

function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  let message = pairMessages[firstCard.dataset.name];

  console.log(message)

  if (isMatch) {
    disableCards();
    displayMatchMessage(message);
  } else {
    unflipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);
  flippedPairs.push(firstCard, secondCard);

  if (flippedPairs.length === cards.length) {
    displayFinalMessage("Now let's make more memories together!");
  }

  resetBoard();
}

function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;
}

function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  flippedPairs = [];
  gridContainer.innerHTML = "";
  generateCards();

  // Reset the attempts counter
  const attemptsCounter = document.querySelector('.attempts-counter');
  attemptsCounter.textContent = 'Attempts: ';
  attemptsCounter.classList.remove('final-message-counter');
  const scoreSpan = document.createElement('span');
  scoreSpan.className = 'score';
  scoreSpan.textContent = '0';
  attemptsCounter.appendChild(scoreSpan);

  if (finalMessageElement) {
    finalMessageElement.style.display = 'none';
    finalMessageElement = null;
  }
}

function displayMatchMessage(message) {
  const matchMessage = document.createElement('div');
  matchMessage.className = 'match-message';
  matchMessage.textContent = message;

  const closeButton = document.createElement('button');
  closeButton.textContent = 'x';
  closeButton.addEventListener('click', () => {
    matchMessage.style.display = 'none';
  });

  matchMessage.appendChild(closeButton);
  document.body.appendChild(matchMessage);

  setTimeout(() => {
    matchMessage.style.display = 'none';
  }, 5000);
}

function displayFinalMessage(message) {
  playShootingStars();

  const attemptsCounter = document.querySelector('.attempts-counter');
  attemptsCounter.textContent = `You did it in ${score} attempts! ${message}`;
  attemptsCounter.classList.add('final-message-counter');
}

function playShootingStars() {
	for (let i = 0; i < 30; i++) {
		setTimeout(() => {
			const star = document.createElement('div');
			star.style.position = 'fixed';
			star.style.height = '2px';
			star.style.width = Math.random() * 100 + 60 + 'px';
			star.style.background = 'linear-gradient(90deg, rgba(255, 182, 255, 1), rgba(182, 182, 255, 0.8), transparent)';
			
			// Start from anywhere along the top and right edges
			star.style.left = Math.random() * 120 + 20 + '%';
			star.style.top = Math.random() * 60 - 20 + '%';
			
			star.style.pointerEvents = 'none';
			star.style.zIndex = '9999';
			star.style.transformOrigin = 'left center';
			star.style.boxShadow = '0 0 8px rgba(255, 182, 255, 0.9)';
			
			const angle = Math.random() * -15 - 40;
			star.style.transform = `rotate(${angle}deg)`;
			
			document.body.appendChild(star);

			const fall = star.animate([
				{ 
					transform: `translate(0, 0) rotate(${angle}deg)`, 
					opacity: 1 
				},
				{ 
					transform: `translate(-1500px, 1500px) rotate(${angle}deg)`, // Travel farther to cover entire page
					opacity: 0 
				}
			], {
				duration: 3500 + Math.random() * 1500, // Longer duration for full coverage
				easing: 'cubic-bezier(0.4, 0, 1, 1)'
			});

			fall.onfinish = () => star.remove();
		}, i * 100);
	}

}
