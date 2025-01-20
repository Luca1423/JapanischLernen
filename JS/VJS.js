// Beispiel-Vokabelliste: Du kannst so viele Vokabeln hinzufügen, wie du möchtest.
var vocabList = [
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

// Globale Variablen
var currentWord = {};
var correctStreak = 0;
var highScore = 0;
var highScores = {};  // Wenn du pro Modus verschiedene Scores möchtest
var totalQuestions = 0;
var correctAnswers = 0;
var incorrectAnswers = 0;
var timerInterval;
var timeLimit = 10;
var isMultipleChoice = false;
var waitingForNext = false;

// Sounds laden
const correctSound = new Audio('Sounds/right.mp3');
const wrongSound = new Audio('Sounds/wrong.mp3');

// Beim Laden
window.onload = function() {
    loadHighScores();
    displayHighScores();
    loadSettings();
    displayHighScore();
};

// Einstellungen/Highscores laden und anzeigen
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
    // Für dieses Beispiel gibt es nur einen Modus "Vokabeln", du könntest aber mehrere definieren.
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

// Aktueller Score
function displayHighScore() {
    // Hole den Highscore aus dem globalen Objekt
    var mode = 'vocabMode';
    highScore = highScores[mode] || 0;
    updateScore();
}

// Einstellungen speichern/laden
function saveSettings() {
    localStorage.setItem("timeLimit", document.getElementById('timeLimit').value);
    localStorage.setItem("learningModeSelect", document.getElementById('learningModeSelect').value);
    localStorage.setItem("timeLimitCheck", document.getElementById('timeLimitCheck').checked);
}
function loadSettings() {
    document.getElementById('timeLimit').value = localStorage.getItem("timeLimit") || 10;
    var storedMode = localStorage.getItem("learningModeSelect") || "normal";
    document.getElementById('learningModeSelect').value = storedMode;
    document.getElementById('timeLimitCheck').checked = (localStorage.getItem("timeLimitCheck") === "true");
}

// Lernen starten
function startLearning() {
    // Einstellungen übernehmen
    saveSettings();
    timeLimit = parseInt(document.getElementById('timeLimit').value);
    var selectedMode = document.getElementById('learningModeSelect').value;
    isMultipleChoice = (selectedMode === 'multipleChoice');

    // Sichtbarkeit umschalten
    document.getElementById('selection').style.display = 'none';
    document.getElementById('learning').style.display = 'block';

    // Initialwerte
    correctStreak = 0;
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;

    // Fortschrittsbalken bei jedem Start zurücksetzen
    document.getElementById('progress-container').style.display = 'block';
    document.getElementById('progress-bar').style.width = '0%';

    nextWord();
}

// Nächstes Wort anzeigen
function nextWord() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';

    if (vocabList.length === 0) {
        alert('Keine Vokabeln mehr verfügbar!');
        goToStart();
        return;
    }
    
    // Zufällige Auswahl
    var randomIndex = Math.floor(Math.random() * vocabList.length);
    currentWord = vocabList[randomIndex];

    // Anzeigen
    document.getElementById('question').innerText = currentWord.word;
    document.getElementById('answer').value = '';
    document.getElementById('correctAnswer').innerText = '';
    waitingForNext = false;

    totalQuestions++;
    updateScore();

    // Multiple-Choice vs. Eingabe
    if (isMultipleChoice) {
        generateMultipleChoiceOptions();
    } else {
        document.getElementById('choices').style.display = 'none';
        document.getElementById('answer').style.display = 'inline-block';
    }

    // Timer starten, wenn aktiviert
    if (document.getElementById('timeLimitCheck').checked) {
        startTimer();
    }
}

// Timer-Funktion
function startTimer() {
    var timeLeft = timeLimit;
    document.getElementById('timer').innerText = 'Zeit: ' + timeLeft + 's';
    timerInterval = setInterval(function() {
        timeLeft--;
        document.getElementById('timer').innerText = 'Zeit: ' + timeLeft + 's';
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            markAnswer(false);
            waitingForNext = true;
        }
    }, 1000);
}

// Antwort prüfen
// (Dieselbe Funktion wird von Multiple-Choice-Buttons und Texteingabe verwendet)
function markAnswer(isCorrect, userAnswer = '') {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';

    if (isCorrect) {
        correctStreak++;
        correctAnswers++;
        document.getElementById('correctAnswer').innerText = 'Richtig! (' + currentWord.romaji + ' = ' + currentWord.meaning + ')';
        document.getElementById('correctAnswer').className = 'correct';
        // Sound
        correctSound.currentTime = 0;
        correctSound.play();

        // Highscore updaten
        if (correctStreak > highScore) {
            highScore = correctStreak;
            highScores['vocabMode'] = highScore;
            saveHighScores();
        }
    } else {
        correctStreak = 0;
        incorrectAnswers++;
        var feedbackMsg = 'Falsch! Richtige Antwort: ' + currentWord.romaji + ' (' + currentWord.meaning + ')';
        // Optional: Tippfehler-Erkennung via getSimilarity()
        if (userAnswer && getSimilarity(userAnswer, currentWord.romaji) > 0.7) {
            feedbackMsg += ' - Tippfehler?';
        }
        document.getElementById('correctAnswer').innerText = feedbackMsg;
        document.getElementById('correctAnswer').className = 'incorrect';
        wrongSound.currentTime = 0;
        wrongSound.play();
    }

    updateScore();
    updateProgressBar();

    // Nach kurzer Zeit das nächste Wort
    setTimeout(function() {
        nextWord();
    }, 2000);
}

// Bei Eingabe Enter drücken
document.getElementById('answer').addEventListener('keydown', function(event) {
    if (event.key === 'Enter' && !waitingForNext && !isMultipleChoice) {
        var userAnswer = this.value.trim().toLowerCase();
        // Vergleich mit .romaji
        markAnswer(userAnswer === currentWord.romaji, userAnswer);
        waitingForNext = true;
    }
});

// Score aktualisieren
function updateScore() {
    document.getElementById('score').innerText = 'Streak: ' + correctStreak;
    document.getElementById('highscore').innerText = 'Highscore: ' + highScore;
    document.getElementById('statistics').innerText = 'Fragen: ' + totalQuestions +
        ' | Richtig: ' + correctAnswers + ' | Falsch: ' + incorrectAnswers;
}

// Fortschrittsleiste aktualisieren
function updateProgressBar() {
    var percent = 0;
    if (totalQuestions > 0) {
        percent = (correctAnswers / totalQuestions) * 100;
    }
    document.getElementById('progress-bar').style.width = percent + '%';
}

// Multiple-Choice-Optionen erzeugen
function generateMultipleChoiceOptions() {
    var choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    choicesDiv.style.display = 'block';

    // Verstecke Eingabefeld im MC-Modus
    document.getElementById('answer').style.display = 'none';

    var options = [currentWord.romaji];
    while (options.length < 4) {
        var randomRomaji = vocabList[Math.floor(Math.random() * vocabList.length)].romaji;
        if (!options.includes(randomRomaji)) {
            options.push(randomRomaji);
        }
    }
    shuffleArray(options);

    options.forEach(option => {
        var btn = document.createElement('button');
        btn.innerText = option;
        btn.onclick = function() {
            markAnswer(option === currentWord.romaji, option);
            waitingForNext = true;
        };
        choicesDiv.appendChild(btn);
    });
}

// Zum Startbildschirm zurück
function goToStart() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';
    document.getElementById('selection').style.display = 'block';
    document.getElementById('learning').style.display = 'none';
    displayHighScores();
    displayHighScore();
}

// Array mischen
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

// Optional: Tippfehler-Erkennung (Levenshtein-Distanz)
function getSimilarity(a, b) {
    var longer = a.length > b.length ? a : b;
    var shorter = a.length > b.length ? b : a;
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength);
}
function editDistance(a, b) {
    a = a.toLowerCase();
    b = b.toLowerCase();
    var costs = [];
    for (var i = 0; i <= a.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= b.length; j++) {
            if (i === 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (a.charAt(i - 1) !== b.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[b.length] = lastValue;
    }
    return costs[b.length];
}

// Sound Mute/Unmute mittels "soundSwitch"
document.addEventListener("DOMContentLoaded", function() {
    // Hole den Status aus LocalStorage
    let isSoundOn = localStorage.getItem("muteSound") !== "true"; // default: Sound an
    // HTML-Body-Klasse anpassen
    document.body.classList.toggle("sound-on", isSoundOn);
    document.body.classList.toggle("sound-muted", !isSoundOn);
    updateSoundStatus(isSoundOn);

    // EventListener für Klick auf den Switch
    document.getElementById("soundSwitch").addEventListener("click", function() {
        let isNowOn = document.body.classList.toggle("sound-on");
        document.body.classList.toggle("sound-muted", !isNowOn);
        updateSoundStatus(isNowOn);
        localStorage.setItem("muteSound", !isNowOn);
    });
});

// Setze Mute-Status sofort um
function updateSoundStatus(isSoundOn) {
    correctSound.muted = !isSoundOn;
    wrongSound.muted = !isSoundOn;
    document.getElementById("soundStatusText").innerText = isSoundOn ? "Sound is on" : "Sound is off";
}
