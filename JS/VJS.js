// Standard vocabulary list (initial)
var defaultVocabList = [
    { word: "犬", romaji: "inu", meaning: "dog" },
    { word: "猫", romaji: "neko", meaning: "cat" },
    { word: "水", romaji: "mizu", meaning: "water" },
    { word: "山", romaji: "yama", meaning: "mountain" },
    { word: "本", romaji: "hon", meaning: "book" },
    { word: "友達", romaji: "tomodachi", meaning: "friend" },
    { word: "学校", romaji: "gakkou", meaning: "school" },
    { word: "車", romaji: "kuruma", meaning: "car" },
    { word: "先生", romaji: "sensei", meaning: "teacher" },
    { word: "花", romaji: "hana", meaning: "flower" }
];

// Our "real" vocabulary list
var vocabList = [];

// For tracking which words have been answered correctly at least once
var uniqueCorrectSet = new Set();

// Learning-related variables
var currentWord = null;
var correctStreak = 0;
var highScore = 0;
var highScores = {};
var totalQuestions = 0;
var correctAnswers = 0;
var incorrectAnswers = 0;
var timerInterval = null;
var timeLimit = 10;
var isMultipleChoice = false;
var isAnswerChecked = false;   // For double Enter press
var isEndlessMode = false;     // Normal or Endless mode

// In normal mode we work with a copy (remainingVocab):
var remainingVocab = [];

// Sounds
const correctSound = new Audio('Sounds/right.mp3');
const wrongSound = new Audio('Sounds/wrong.mp3');
correctSound.load();
wrongSound.load();

// ====================
// Initialization
// ====================
window.onload = function() {
    loadVocabListFromStorage();
    loadHighScores();
    displayHighScores();
    loadSettings();
    displayHighScore();
};

// ====================
// Manage Vocabulary
// ====================
function loadVocabListFromStorage() {
    var storedVocab = localStorage.getItem("myVocabList");
    if (storedVocab) {
        vocabList = JSON.parse(storedVocab);
    } else {
        vocabList = defaultVocabList.slice();
    }
}

function saveVocabListToStorage() {
    localStorage.setItem("myVocabList", JSON.stringify(vocabList));
}

function addNewVocab() {
    var newWordElem = document.getElementById('newWord');
    var newRomajiElem = document.getElementById('newRomaji');
    var newMeaningElem = document.getElementById('newMeaning');

    var wordVal = newWordElem.value.trim();
    var romajiVal = newRomajiElem.value.trim();
    var meaningVal = newMeaningElem.value.trim();

    if (wordVal === "" || romajiVal === "" || meaningVal === "") {
        alert("Please fill in all fields!");
        return;
    }

    var newVocabObj = {
        word: wordVal,
        romaji: romajiVal,
        meaning: meaningVal
    };

    vocabList.push(newVocabObj);
    saveVocabListToStorage();

    newWordElem.value = "";
    newRomajiElem.value = "";
    newMeaningElem.value = "";

    alert("Vocabulary added!");
}

// ====================
// Highscores & Settings
// ====================
function loadHighScores() {
    var storedHighScores = localStorage.getItem('vocabHighScores');
    if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);
    } else {
        highScores = {};
    }
}

function saveHighScores() {
    localStorage.setItem('vocabHighScores', JSON.stringify(highScores));
}

function displayHighScores() {
    var tableHTML = '<table><tr><th>Mode</th><th>Highscore</th></tr>';
    var mode = 'vocabMode';
    var score = highScores[mode] || 0;
    tableHTML += '<tr><td>Vocabulary Mode</td><td>' + score + '</td></tr>';
    tableHTML += '</table>';
    document.getElementById('highScoresTable').innerHTML = tableHTML;
}

function resetHighScores() {
    if (confirm('Do you really want to reset all highscores?')) {
        highScores = {};
        saveHighScores();
        displayHighScores();
        alert('All highscores have been reset.');
    }
}

function displayHighScore() {
    var mode = 'vocabMode';
    highScore = highScores[mode] || 0;
    updateScore();
}

function saveSettings() {
    localStorage.setItem("timeLimit", document.getElementById('timeLimit').value);
    localStorage.setItem("learningModeSelect", document.getElementById('learningModeSelect').value);
    localStorage.setItem("timeLimitCheck", document.getElementById('timeLimitCheck').checked);
    localStorage.setItem("endlessMode", document.getElementById('endlessMode').checked);
}

function loadSettings() {
    document.getElementById('timeLimit').value = localStorage.getItem("timeLimit") || 10;
    var storedMode = localStorage.getItem("learningModeSelect") || "normal";
    document.getElementById('learningModeSelect').value = storedMode;
    document.getElementById('timeLimitCheck').checked = (localStorage.getItem("timeLimitCheck") === "true");
    document.getElementById('endlessMode').checked = (localStorage.getItem("endlessMode") === "true");
}

// ====================
// Start Learning
// ====================
function startLearning() {
    // Save current settings
    saveSettings();
    timeLimit = parseInt(document.getElementById('timeLimit').value);
    var selectedMode = document.getElementById('learningModeSelect').value;
    isMultipleChoice = (selectedMode === 'multipleChoice');

    isEndlessMode = document.getElementById('endlessMode').checked;

    // Switch view
    document.getElementById('selection').style.display = 'none';
    document.getElementById('learning').style.display = 'block';

    // Reset counters
    correctStreak = 0;
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    uniqueCorrectSet.clear();
    isAnswerChecked = false;

    // Show progress bar
    document.getElementById('progress-container').style.display = 'block';
    document.getElementById('progress-bar').style.width = '0%';

    // For normal mode: create a copy of vocabList and shuffle it
    if (!isEndlessMode) {
        remainingVocab = shuffleArray(vocabList.slice());
    }

    nextWord();
}

// ====================
// Next Vocabulary
// ====================
function nextWord() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';
    document.getElementById('correctAnswer').innerText = '';
    isAnswerChecked = false;

    // Normal mode: if no more words are left -> done
    if (!isEndlessMode) {
        if (remainingVocab.length === 0) {
            alert('Great! You have gone through all vocabulary once.');
            goToStart();
            return;
        }
        // Take the first from remainingVocab
        currentWord = remainingVocab.shift();
    } else {
        // Endless mode: pick a random word from the entire vocabList
        if (vocabList.length === 0) {
            alert('No vocabulary available! Please add new vocabulary.');
            goToStart();
            return;
        }
        var randomIndex = Math.floor(Math.random() * vocabList.length);
        currentWord = vocabList[randomIndex];
    }

    // Show question
    document.getElementById('question').innerText = currentWord.word;
    document.getElementById('answer').value = '';

    // Increment question count
    totalQuestions++;
    updateScore();

    // Multiple choice or normal input?
    if (isMultipleChoice) {
        generateMultipleChoiceOptions();
    } else {
        document.getElementById('choices').style.display = 'none';
        document.getElementById('answer').style.display = 'inline-block';
    }

    // Timer if checkbox is checked
    if (document.getElementById('timeLimitCheck').checked) {
        startTimer();
    }
}

// ====================
// Timer
// ====================
function startTimer() {
    var timeLeft = timeLimit;
    document.getElementById('timer').innerText = 'Time: ' + timeLeft + 's';
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').innerText = 'Time: ' + timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            markAnswer(false, "(timeout)");
            isAnswerChecked = true;
        }
    }, 1000);
}

// ====================
// Check Answer
// ====================
function markAnswer(isCorrect, userAnswer = '') {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';

    if (isCorrect) {
        correctStreak++;
        correctAnswers++;
        // Add to set if not already present
        if (!uniqueCorrectSet.has(currentWord.word)) {
            uniqueCorrectSet.add(currentWord.word);
        }
        document.getElementById('correctAnswer').innerText =
            'Correct! ' + currentWord.word + ' = ' + currentWord.meaning;
        document.getElementById('correctAnswer').className = 'correct';
        correctSound.currentTime = 0;
        correctSound.play();

        // Update highscore
        if (correctStreak > highScore) {
            highScore = correctStreak;
            highScores['vocabMode'] = highScore;
            saveHighScores();
        }
    } else {
        correctStreak = 0;
        incorrectAnswers++;
        let feedback = 'Wrong! ' + currentWord.word + ' = ' + currentWord.meaning;
        if (userAnswer && getSimilarity(userAnswer, currentWord.meaning) > 0.7) {
            feedback += ' (Typo?)';
        }
        document.getElementById('correctAnswer').innerText = feedback;
        document.getElementById('correctAnswer').className = 'incorrect';
        wrongSound.currentTime = 0;
        wrongSound.play();
    }

    updateScore();
    updateProgressBar();
}

// ====================
// Input field: Double Enter
// ====================
document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (!isAnswerChecked) {
            var userAnswer = this.value.trim().toLowerCase();
            // Correct if meaning matches
            var correct = (userAnswer === currentWord.meaning.toLowerCase());
            markAnswer(correct, userAnswer);
            isAnswerChecked = true;
        } else {
            // Proceed to next word
            nextWord();
        }
    }
});

// ====================
// Multiple Choice
// ====================
function generateMultipleChoiceOptions() {
    var choicesDiv = document.getElementById('choices');
    choicesDiv.style.display = 'block';
    choicesDiv.innerHTML = '';

    document.getElementById('answer').style.display = 'none';

    var options = [currentWord.meaning];
    while (options.length < 4) {
        var randomMeaning = vocabList[Math.floor(Math.random() * vocabList.length)].meaning;
        if (!options.includes(randomMeaning)) {
            options.push(randomMeaning);
        }
    }
    shuffleArray(options);

    options.forEach(option => {
        var btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = function() {
            let correct = (option === currentWord.meaning);
            markAnswer(correct, option);
            isAnswerChecked = true;
            // In multiple choice mode, automatically proceed after 2s
            setTimeout(function() {
                nextWord();
            }, 2000);
        };
        choicesDiv.appendChild(btn);
    });
}

// ====================
// Progress
// ====================
function updateScore() {
    document.getElementById('score').innerText = 'Streak: ' + correctStreak;
    document.getElementById('highscore').innerText = 'Highscore: ' + highScore;
    document.getElementById('statistics').innerText =
        'Questions: ' + totalQuestions +
        ' | Correct: ' + correctAnswers +
        ' | Incorrect: ' + incorrectAnswers;
}

function updateProgressBar() {
    // Total number of words
    var totalCount = vocabList.length;
    var solvedCount = uniqueCorrectSet.size;
    var percent = (solvedCount / totalCount) * 100;
    document.getElementById('progress-bar').style.width = percent + '%';
}

// ====================
// Back to Start
// ====================
function goToStart() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';
    document.getElementById('selection').style.display = 'block';
    document.getElementById('learning').style.display = 'none';
    displayHighScores();
    displayHighScore();
}

// ====================
// Helper Functions
// ====================
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Levenshtein distance for checking typos
function getSimilarity(a, b) {
    var longer = a.length > b.length ? a : b;
    var shorter = a.length > b.length ? b : a;
    var longerLength = longer.length;
    if (longerLength === 0) return 1.0;
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function editDistance(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    var costs = [];
    for (var i = 0; i <= a.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= b.length; j++) {
            if (i === 0) {
                costs[j] = j;
            } else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (a.charAt(i - 1) !== b.charAt(j - 1)) {
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    }
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0) {
            costs[b.length] = lastValue;
        }
    }
    return costs[b.length];
}

// ====================
// Sound Mute/Unmute
// ====================
document.addEventListener("DOMContentLoaded", function() {
    let isSoundOn = localStorage.getItem("muteSound") !== "true";
    const muteContainer = document.getElementById("muteContainer");

    // Set the initial visual state
    muteContainer.classList.toggle("sound-on", isSoundOn);
    muteContainer.classList.toggle("sound-muted", !isSoundOn);
    updateSoundStatus(isSoundOn);

    // Click on switch
    document.getElementById("soundSwitch").addEventListener("click", function() {
        let newIsSoundOn = !muteContainer.classList.contains("sound-on");
        muteContainer.classList.toggle("sound-on", newIsSoundOn);
        muteContainer.classList.toggle("sound-muted", !newIsSoundOn);
        updateSoundStatus(newIsSoundOn);
        localStorage.setItem("muteSound", !newIsSoundOn);
    });
});

function updateSoundStatus(isSoundOn) {
    correctSound.muted = !isSoundOn;
    wrongSound.muted = !isSoundOn;
    document.getElementById("soundStatusText").innerText = isSoundOn ? "Sound is on" : "Sound is off";
}

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// +++++++++++++   NEUER DARK-MODE-SCHALTER (Switch)  +++++++++
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
document.addEventListener("DOMContentLoaded", function() {
    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const darkModeStatusText = document.getElementById("darkModeStatusText");
    const body = document.body;

    // Dark-Mode-Zustand aus Local Storage lesen
    let isDarkModeOn = (localStorage.getItem("darkMode") === "true");

    // Klassen beim Laden setzen
    body.classList.toggle("dark-mode", isDarkModeOn);
    body.classList.toggle("dark-on", isDarkModeOn);
    body.classList.toggle("dark-off", !isDarkModeOn);
    updateDarkModeStatusText(isDarkModeOn);

    // Klick-Event zum Umschalten
    darkModeSwitch.addEventListener("click", function() {
        isDarkModeOn = !isDarkModeOn;
        localStorage.setItem("darkMode", isDarkModeOn);

        body.classList.toggle("dark-mode", isDarkModeOn);
        body.classList.toggle("dark-on", isDarkModeOn);
        body.classList.toggle("dark-off", !isDarkModeOn);

        updateDarkModeStatusText(isDarkModeOn);
    });

    function updateDarkModeStatusText(isOn) {
        darkModeStatusText.innerText = isOn ? "Dark Mode is on" : "Dark Mode is off";
    }
});
