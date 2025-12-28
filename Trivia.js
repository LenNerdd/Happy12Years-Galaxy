//References
let timeLeft = document.querySelector(".time-left");
let quizContainer = document.getElementById("container");
let nextBtn = document.getElementById("next-button");
let countOfQuestion = document.querySelector(".number-of-question");
let displayContainer = document.getElementById("display-container");
let scoreContainer = document.querySelector(".score-container");
let restart = document.getElementById("restart");
let userScore = document.getElementById("user-score");
let userResults = document.getElementById("user-results");
let finalImage = document.getElementById("PrincessandPeanut");
let startScreen = document.querySelector(".start-screen");
let startButton = document.getElementById("start-button");
let questionCount;
let scoreCount = 0;
let count = 16;
let countdown;

//Questions and Options array
const quizArray = [
    {
        id: "0",
        question: "What impressive feat did Julie accomplish at John's Incredible Pizza?",
        options: ["Won the jackpot on an arcade game first try", "Won a claw machine prize first try", "Beat Lenny's high score at mini basketball", "Got a hole-in-one first try at mini golf"],
        correct: "Got a hole-in-one first try at mini golf",
    },
    {
        id: "1",
        question: "What happened at the start of Lenny and Julie's South Carolina beach trip?",
        options: ["Lenny got sick", "It was raining and thundering", "They drove to the wrong state", "The hotel lost their reservation"],
        correct: "It was raining and thundering",
    },
    {
        id: "2",
        question: "Which words does Julie say in a funny way that makes Lenny laugh?",
        options: ["'Blaack' and 'Copper Penny'", "'Yeah' and 'Copper Penny'", "'Princess' and 'Peanut'", "'Yeah' and 'Blaack'"],
        correct: "'Blaack' and 'Copper Penny'",
    },
    {
        id: "3",
        question: "What was the first scary movie Lenny and Julie watched together in theaters?",
        options: ["The Conjuring", "A Quiet Place", "The Woman in the Yard", "Insidious"],
        correct: "The Woman in the Yard",
    },
    {
        id: "4",
        question: "What show or movie does each person talk about as their current favorite?",
        options: ["Julie: Stranger Things, Lenny: Stranger Things", "Julie: Start-Up, Lenny: Four Lions", "Julie: Stranger Things, Lenny: Four Lions", "Julie: Start-Up, Lenny: Stranger Things"],
        correct: "Julie: Start-Up, Lenny: Four Lions",
    },
    {
        id: "5",
        question: "What is each person's favorite video game currently?",
        options: ["Julie: Wizard101, Lenny: Grand Theft Auto 5", "Julie: Roblox, Lenny: Grand Theft Auto 5", "Julie: Wizard101, Lenny: Schedule I", "Julie: Fortnite, Lenny: Fortnite"],
        correct: "Julie: Wizard101, Lenny: Schedule I",
    },
    {
        id: "6",
        question: "As of December 28, 2025, how many years will Lenny and Julie have been together?",
        options: ["11", "13", "16", "12"],
        correct: "12",
    },
    {
        id: "7",
        question: "What was Julie and Lenny's first order from Pelican's Snoballs?",
        options: ["Julie: Pretty Princess, Lenny: Dinosaur", "Julie: Butterfly Kiss, Lenny: Shark Attack", "Julie: Butterfly Kiss, Lenny: Super Hero", "Julie: Unicorn, Lenny: Shark Attack"],
        correct: "Julie: Unicorn, Lenny: Shark Attack",
    },
    {
        id: "8",
        question: "How many games and prizes did Lenny win at the Kern County Fair?",
        options: ["1", "2", "3", "4"],
        correct: "3",
    },
    {
        id: "9",
        question: "What game did Julie play first and what prize did she win at the Kern County Fair?",
        options: ["Balloon Pop - Squirtle Plushie", "Mini Basketball - Little Pig Plushie", "Floating Bowl Toss - Little Snake Plushie", "Mini Basketball - Little Fish Plushie"],
        correct: "Mini Basketball - Little Pig Plushie",
    },
];

//Restart Quiz
restart.addEventListener("click", () => {
    initial();
    displayContainer.style.display = "block";
    scoreContainer.classList.add("hide");

    // Remove quiz-done class when restarting
    document.querySelector("h1").classList.remove("quiz-done");
});

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

//Next Button
nextBtn.addEventListener(
    "click",
    (displayNext = () => {
        //increment questionCount
        questionCount += 1;
        //if last question
        if (questionCount == quizArray.length) {
            //hide question container and display score
            displayContainer.style.display = "none";
            scoreContainer.classList.remove("hide");

            // Add quiz-done class to h1 when quiz finishes
            document.querySelector("h1").classList.add("quiz-done");

            //user score
            userScore.innerHTML = "Your score is " + scoreCount + " out of " + questionCount;
            if (scoreCount == 10) {
                playShootingStars();
                userResults.innerHTML = "You did it! Princess and Peanut are proud!";
                finalImage.innerHTML = "<img class ='finishing-img' src='assets/HappyDogs.png'>";
            } else if (scoreCount <= 9 && scoreCount >= 7) {
                userResults.innerHTML = "So close! Princess and Peanut want you to try again!";
                finalImage.innerHTML = "<img class ='finishing-img' src='assets/CalmDogs.png'>";
            }
            else {
                userResults.innerHTML = "Damn. Princess and Peanut are disappointed.";
                finalImage.innerHTML = "<img class ='finishing-img' src='assets/SadDogs.png'>";
            }

        } else {
            //display questionCount
            countOfQuestion.innerHTML =
                questionCount + 1 + " of " + quizArray.length + " Questions";
            //display quiz
            quizDisplay(questionCount);
            count = 16;
            clearInterval(countdown);
            timerDisplay();
        }
    })
);

//Timer
const timerDisplay = () => {
    countdown = setInterval(() => {
        count--;
        timeLeft.innerHTML = `${count}s`;
        if (count == 0) {
            clearInterval(countdown);
            displayNext();
        }
    }, 1000);
};

//Display quiz
const quizDisplay = (questionCount) => {
    let quizCards = document.querySelectorAll(".container-mid");
    //Hide other cards
    quizCards.forEach((card) => {
        card.classList.add("hide");
    });
    //display current question card
    quizCards[questionCount].classList.remove("hide");
};

//Quiz Creation
function quizCreator() {
    //randomly sort questions
    quizArray.sort(() => Math.random() - 0.5);
    //generate quiz
    for (let i of quizArray) {
        //randomly sort options
        i.options.sort(() => Math.random() - 0.5);
        //quiz card creation
        let div = document.createElement("div");
        div.classList.add("container-mid", "hide");
        //question number
        countOfQuestion.innerHTML = 1 + " of " + quizArray.length + " Question";
        //question
        let question_DIV = document.createElement("p");
        question_DIV.classList.add("question");
        question_DIV.innerHTML = i.question;
        div.appendChild(question_DIV);
        // options
        let numOfOptions = i.options.length;
        if (numOfOptions == 2) {
            div.innerHTML += `
            <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
             <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
            `;
        } else {
            div.innerHTML += `
            <button class="option-div" onclick="checker(this)">${i.options[0]}</button>
             <button class="option-div" onclick="checker(this)">${i.options[1]}</button>
              <button class="option-div" onclick="checker(this)">${i.options[2]}</button>
               <button class="option-div" onclick="checker(this)">${i.options[3]}</button>
            `;
        }
        quizContainer.appendChild(div);
    }
}

//Checker Function to check if option is correct or not
function checker(userOption) {
    let userSolution = userOption.innerText;
    let question =
        document.getElementsByClassName("container-mid")[questionCount];
    let options = question.querySelectorAll(".option-div");

    //if user clicked answer == correct option stored in object
    if (userSolution === quizArray[questionCount].correct) {
        userOption.classList.add("correct");
        scoreCount++;
    } else {
        userOption.classList.add("incorrect");
        //For marking the correct option
        options.forEach((element) => {
            if (element.innerText == quizArray[questionCount].correct) {
                element.classList.add("correct");
            }
        });
    }

    //clear interval(stop timer)
    clearInterval(countdown);
    //disable all options
    options.forEach((element) => {
        element.disabled = true;
    });
}

//initial setup
function initial() {
    quizContainer.innerHTML = "";
    questionCount = 0;
    scoreCount = 0;
    count = 16;
    clearInterval(countdown);
    timerDisplay();
    quizCreator();
    quizDisplay(questionCount);
}

//when user click on start button
startButton.addEventListener("click", () => {
    startScreen.classList.add("hide");
    quizContainer.innerHTML = "";
    displayContainer.style.display = "block";

    initial();
});

//display start screen
window.onload = () => {
    startScreen.classList.remove("hide");
};