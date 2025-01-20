// Standard-Vokabelliste (Initial)
var defaultVocabList = [
    { word: "犬", romaji: "inu", meaning: "Hund" },
    { word: "猫", romaji: "neko", meaning: "Katze" },
    { word: "水", romaji: "mizu", meaning: "Wasser" },
    { word: "山", romaji: "yama", meaning: "Berg" },
    { word: "本", romaji: "hon", meaning: "Buch" },
    { word: "友達", romaji: "tomodachi", meaning: "Freund" },
    { word: "学校", romaji: "gakkou", meaning: "Schule" },
    { word: "車", romaji: "kuruma", meaning: "Auto" },
    { word: "先生", romaji: "sensei", meaning: "Lehrer" },
    { word: "花", romaji: "hana", meaning: "Blume" }
];

// Unsere "echte" Vokabelliste
var vocabList = [];

// Für das Tracking, welche Vokabeln schon min. einmal richtig beantwortet wurden
var uniqueCorrectSet = new Set();

// Lern-Variablen
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
var isAnswerChecked = false;   // Für das Doppel-Enter
var isEndlessMode = false;     // Normal oder Endlos-Modus

// Im Normalmodus arbeiten wir mit einer Kopie (remainingVocab):
var remainingVocab = [];

// Sounds
const correctSound = new Audio('Sounds/right.mp3');
const wrongSound = new Audio('Sounds/wrong.mp3');

// ====================
// Initialisierung
// ====================
window.onload = function() {
    loadVocabListFromStorage();
    loadHighScores();
    displayHighScores();
    loadSettings();
    displayHighScore();
};

// ====================
// Vokabeln verwalten
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
        alert("Bitte alle Felder ausfüllen!");
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

    alert("Vokabel hinzugefügt!");
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
    var tableHTML = '<table><tr><th>Modus</th><th>Highscore</th></tr>';
    var mode = 'vocabMode'; 
    var score = highScores[mode] || 0;
    tableHTML += '<tr><td>Vokabel-Modus</td><td>' + score + '</td></tr>';
    tableHTML += '</table>';
    document.getElementById('highScoresTable').innerHTML = tableHTML;
}

function resetHighScores() {
    if (confirm('Möchtest du wirklich alle Highscores zurücksetzen?')) {
        highScores = {};
        saveHighScores();
        displayHighScores();
        alert('Alle Highscores wurden zurückgesetzt.');
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
// Lernen starten
// ====================
function startLearning() {
    // Einstellungen laden
    saveSettings();
    timeLimit = parseInt(document.getElementById('timeLimit').value);
    var selectedMode = document.getElementById('learningModeSelect').value;
    isMultipleChoice = (selectedMode === 'multipleChoice');

    isEndlessMode = document.getElementById('endlessMode').checked;

    // Ansicht wechseln
    document.getElementById('selection').style.display = 'none';
    document.getElementById('learning').style.display = 'block';

    // Werte zurücksetzen
    correctStreak = 0;
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    uniqueCorrectSet.clear();
    isAnswerChecked = false;

    // Fortschrittsleiste anzeigen
    document.getElementById('progress-container').style.display = 'block';
    document.getElementById('progress-bar').style.width = '0%';

    // Falls normaler Modus: Kopie von vocabList erstellen und mischen
    if (!isEndlessMode) {
        remainingVocab = shuffleArray(vocabList.slice());
    }

    nextWord();
}

// ====================
// Nächste Vokabel
// ====================
function nextWord() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';
    document.getElementById('correctAnswer').innerText = '';
    isAnswerChecked = false;

    // Normalmodus: Wenn keine mehr übrig -> Fertig
    if (!isEndlessMode) {
        if (remainingVocab.length === 0) {
            alert('Super! Du hast alle Vokabeln einmal durch.');
            goToStart();
            return;
        }
        // Nimm die erste aus remainingVocab
        currentWord = remainingVocab.shift();
    } else {
        // Endlosmodus: Zufälliger Pick aus kompletter Vokabelliste
        if (vocabList.length === 0) {
            alert('Keine Vokabeln verfügbar! Bitte füge neue Vokabeln hinzu.');
            goToStart();
            return;
        }
        var randomIndex = Math.floor(Math.random() * vocabList.length);
        currentWord = vocabList[randomIndex];
    }

    // Frage anzeigen
    document.getElementById('question').innerText = currentWord.word;
    document.getElementById('answer').value = '';

    // Zähler
    totalQuestions++;
    updateScore();

    // Multiple Choice oder normale Eingabe
    if (isMultipleChoice) {
        generateMultipleChoiceOptions();
    } else {
        document.getElementById('choices').style.display = 'none';
        document.getElementById('answer').style.display = 'inline-block';
    }

    // Zeitlimit
    if (document.getElementById('timeLimitCheck').checked) {
        startTimer();
    }
}

// ====================
// Timer
// ====================
function startTimer() {
    var timeLeft = timeLimit;
    document.getElementById('timer').innerText = 'Zeit: ' + timeLeft + 's';
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').innerText = 'Zeit: ' + timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            markAnswer(false, "(timeout)");
            isAnswerChecked = true;
        }
    }, 1000);
}

// ====================
// Antwort prüfen
// ====================
function markAnswer(isCorrect, userAnswer = '') {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';

    if (isCorrect) {
        correctStreak++;
        correctAnswers++;
        // Eintragen in Set, falls noch nicht drin
        if (!uniqueCorrectSet.has(currentWord.word)) {
            uniqueCorrectSet.add(currentWord.word);
        }
        document.getElementById('correctAnswer').innerText = 
            'Richtig! ' + currentWord.word + ' = ' + currentWord.meaning;
        document.getElementById('correctAnswer').className = 'correct';
        correctSound.currentTime = 0;
        correctSound.play();

        // Highscore
        if (correctStreak > highScore) {
            highScore = correctStreak;
            highScores['vocabMode'] = highScore;
            saveHighScores();
        }
    } else {
        correctStreak = 0;
        incorrectAnswers++;
        let feedback = 'Falsch! ' + currentWord.word + ' = ' + currentWord.meaning;
        if (userAnswer && getSimilarity(userAnswer, currentWord.meaning) > 0.7) {
            feedback += ' (Tippfehler?)';
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
// Eingabefeld: Doppel-Enter
// ====================
document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (!isAnswerChecked) {
            var userAnswer = this.value.trim().toLowerCase();
            // Korrekt, wenn meaning passt
            var correct = (userAnswer === currentWord.meaning.toLowerCase());
            markAnswer(correct, userAnswer);
            isAnswerChecked = true;
        } else {
            // Nächste Vokabel
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
            // Im Multiple-Choice starten wir nach 2s automatisch die nächste
            setTimeout(function() {
                nextWord();
            }, 2000);
        };
        choicesDiv.appendChild(btn);
    });
}

// ====================
// Fortschritt
// ====================
function updateScore() {
    document.getElementById('score').innerText = 'Streak: ' + correctStreak;
    document.getElementById('highscore').innerText = 'Highscore: ' + highScore;
    document.getElementById('statistics').innerText =
        'Fragen: ' + totalQuestions +
        ' | Richtig: ' + correctAnswers +
        ' | Falsch: ' + incorrectAnswers;
}

function updateProgressBar() {
    // Gesamtanzahl Vokabeln
    var totalCount = vocabList.length;
    var solvedCount = uniqueCorrectSet.size;
    var percent = (solvedCount / totalCount) * 100;
    document.getElementById('progress-bar').style.width = percent + '%';
}

// ====================
// Zurück
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
// Hilfsfunktionen
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

// Levenshtein für Tippfehler-Check
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

    // Setze die optische Darstellung
    muteContainer.classList.toggle("sound-on", isSoundOn);
    muteContainer.classList.toggle("sound-muted", !isSoundOn);
    updateSoundStatus(isSoundOn);

    // Klick auf Switch
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
