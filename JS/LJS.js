// Arrays für Hiragana und Katakana Zeichen (inklusive Kombinationen)
var hiraganaBasic = [
    { char: "あ", romaji: "a" }, { char: "い", romaji: "i" }, { char: "う", romaji: "u" },
    { char: "え", romaji: "e" }, { char: "お", romaji: "o" }, { char: "か", romaji: "ka" },
    { char: "き", romaji: "ki" }, { char: "く", romaji: "ku" }, { char: "け", romaji: "ke" },
    { char: "こ", romaji: "ko" }, { char: "さ", romaji: "sa" }, { char: "し", romaji: "shi" },
    { char: "す", romaji: "su" }, { char: "せ", romaji: "se" }, { char: "そ", romaji: "so" },
    { char: "た", romaji: "ta" }, { char: "ち", romaji: "chi" }, { char: "つ", romaji: "tsu" },
    { char: "て", romaji: "te" }, { char: "と", romaji: "to" }, { char: "な", romaji: "na" },
    { char: "に", romaji: "ni" }, { char: "ぬ", romaji: "nu" }, { char: "ね", romaji: "ne" },
    { char: "の", romaji: "no" }, { char: "は", romaji: "ha" }, { char: "ひ", romaji: "hi" },
    { char: "ふ", romaji: "fu" }, { char: "へ", romaji: "he" }, { char: "ほ", romaji: "ho" },
    { char: "ま", romaji: "ma" }, { char: "み", romaji: "mi" }, { char: "む", romaji: "mu" },
    { char: "め", romaji: "me" }, { char: "も", romaji: "mo" }, { char: "や", romaji: "ya" },
    { char: "ゆ", romaji: "yu" }, { char: "よ", romaji: "yo" }, { char: "ら", romaji: "ra" },
    { char: "り", romaji: "ri" }, { char: "る", romaji: "ru" }, { char: "れ", romaji: "re" },
    { char: "ろ", romaji: "ro" }, { char: "わ", romaji: "wa" }, { char: "を", romaji: "wo" },
    { char: "ん", romaji: "n" }
];

var hiraganaDakuten = [
    { char: "が", romaji: "ga" }, { char: "ぎ", romaji: "gi" }, { char: "ぐ", romaji: "gu" },
    { char: "げ", romaji: "ge" }, { char: "ご", romaji: "go" }, { char: "ざ", romaji: "za" },
    { char: "じ", romaji: "ji" }, { char: "ず", romaji: "zu" }, { char: "ぜ", romaji: "ze" },
    { char: "ぞ", romaji: "zo" }, { char: "だ", romaji: "da" }, { char: "ぢ", romaji: "ji" },
    { char: "づ", romaji: "zu" }, { char: "で", romaji: "de" }, { char: "ど", romaji: "do" },
    { char: "ば", romaji: "ba" }, { char: "び", romaji: "bi" }, { char: "ぶ", romaji: "bu" },
    { char: "べ", romaji: "be" }, { char: "ぼ", romaji: "bo" }, { char: "ぱ", romaji: "pa" },
    { char: "ぴ", romaji: "pi" }, { char: "ぷ", romaji: "pu" }, { char: "ぺ", romaji: "pe" },
    { char: "ぽ", romaji: "po" }
];

var hiraganaCombinations = [
    { char: "きゃ", romaji: "kya" }, { char: "きゅ", romaji: "kyu" }, { char: "きょ", romaji: "kyo" },
    { char: "しゃ", romaji: "sha" }, { char: "しゅ", romaji: "shu" }, { char: "しょ", romaji: "sho" },
    { char: "ちゃ", romaji: "cha" }, { char: "ちゅ", romaji: "chu" }, { char: "ちょ", romaji: "cho" },
    { char: "にゃ", romaji: "nya" }, { char: "にゅ", romaji: "nyu" }, { char: "にょ", romaji: "nyo" },
    { char: "ひゃ", romaji: "hya" }, { char: "ひゅ", romaji: "hyu" }, { char: "ひょ", romaji: "hyo" },
    { char: "みゃ", romaji: "mya" }, { char: "みゅ", romaji: "myu" }, { char: "みょ", romaji: "myo" },
    { char: "りゃ", romaji: "rya" }, { char: "りゅ", romaji: "ryu" }, { char: "りょ", romaji: "ryo" },
    { char: "ぎゃ", romaji: "gya" }, { char: "ぎゅ", romaji: "gyu" }, { char: "ぎょ", romaji: "gyo" },
    { char: "じゃ", romaji: "ja" }, { char: "じゅ", romaji: "ju" }, { char: "じょ", romaji: "jo" },
    { char: "びゃ", romaji: "bya" }, { char: "びゅ", romaji: "byu" }, { char: "びょ", romaji: "byo" },
    { char: "ぴゃ", romaji: "pya" }, { char: "ぴゅ", romaji: "pyu" }, { char: "ぴょ", romaji: "pyo" }
];

var katakanaBasic = [
    { char: "ア", romaji: "a" }, { char: "イ", romaji: "i" }, { char: "ウ", romaji: "u" },
    { char: "エ", romaji: "e" }, { char: "オ", romaji: "o" }, { char: "カ", romaji: "ka" },
    { char: "キ", romaji: "ki" }, { char: "ク", romaji: "ku" }, { char: "ケ", romaji: "ke" },
    { char: "コ", romaji: "ko" }, { char: "サ", romaji: "sa" }, { char: "シ", romaji: "shi" },
    { char: "ス", romaji: "su" }, { char: "セ", romaji: "se" }, { char: "ソ", romaji: "so" },
    { char: "タ", romaji: "ta" }, { char: "チ", romaji: "chi" }, { char: "ツ", romaji: "tsu" },
    { char: "テ", romaji: "te" }, { char: "ト", romaji: "to" }, { char: "ナ", romaji: "na" },
    { char: "ニ", romaji: "ni" }, { char: "ヌ", romaji: "nu" }, { char: "ネ", romaji: "ne" },
    { char: "ノ", romaji: "no" }, { char: "ハ", romaji: "ha" }, { char: "ヒ", romaji: "hi" },
    { char: "フ", romaji: "fu" }, { char: "ヘ", romaji: "he" }, { char: "ホ", romaji: "ho" },
    { char: "マ", romaji: "ma" }, { char: "ミ", romaji: "mi" }, { char: "ム", romaji: "mu" },
    { char: "メ", romaji: "me" }, { char: "モ", romaji: "mo" }, { char: "ヤ", romaji: "ya" },
    { char: "ユ", romaji: "yu" }, { char: "ヨ", romaji: "yo" }, { char: "ラ", romaji: "ra" },
    { char: "リ", romaji: "ri" }, { char: "ル", romaji: "ru" }, { char: "レ", romaji: "re" },
    { char: "ロ", romaji: "ro" }, { char: "ワ", romaji: "wa" }, { char: "ヲ", romaji: "wo" },
    { char: "ン", romaji: "n" }
];

var katakanaDakuten = [
    { char: "ガ", romaji: "ga" }, { char: "ギ", romaji: "gi" }, { char: "グ", romaji: "gu" },
    { char: "ゲ", romaji: "ge" }, { char: "ゴ", romaji: "go" }, { char: "ザ", romaji: "za" },
    { char: "ジ", romaji: "ji" }, { char: "ズ", romaji: "zu" }, { char: "ゼ", romaji: "ze" },
    { char: "ゾ", romaji: "zo" }, { char: "ダ", romaji: "da" }, { char: "ヂ", romaji: "ji" },
    { char: "ヅ", romaji: "zu" }, { char: "デ", romaji: "de" }, { char: "ド", romaji: "do" },
    { char: "バ", romaji: "ba" }, { char: "ビ", romaji: "bi" }, { char: "ブ", romaji: "bu" },
    { char: "ベ", romaji: "be" }, { char: "ボ", romaji: "bo" }, { char: "パ", romaji: "pa" },
    { char: "ピ", romaji: "pi" }, { char: "プ", romaji: "pu" }, { char: "ペ", romaji: "pe" },
    { char: "ポ", romaji: "po" }
];

var katakanaCombinations = [
    { char: "キャ", romaji: "kya" }, { char: "キュ", romaji: "kyu" }, { char: "キョ", romaji: "kyo" },
    { char: "シャ", romaji: "sha" }, { char: "シュ", romaji: "shu" }, { char: "ショ", romaji: "sho" },
    { char: "チャ", romaji: "cha" }, { char: "チュ", romaji: "chu" }, { char: "チョ", romaji: "cho" },
    { char: "ニャ", romaji: "nya" }, { char: "ニュ", romaji: "nyu" }, { char: "ニョ", romaji: "nyo" },
    { char: "ヒャ", romaji: "hya" }, { char: "ヒュ", romaji: "hyu" }, { char: "ヒョ", romaji: "hyo" },
    { char: "ミャ", romaji: "mya" }, { char: "ミュ", romaji: "myu" }, { char: "ミョ", romaji: "myo" },
    { char: "リャ", romaji: "rya" }, { char: "リュ", romaji: "ryu" }, { char: "リョ", romaji: "ryo" },
    { char: "ギャ", romaji: "gya" }, { char: "ギュ", romaji: "gyu" }, { char: "ギョ", romaji: "gyo" },
    { char: "ジャ", romaji: "ja" }, { char: "ジュ", romaji: "ju" }, { char: "ジョ", romaji: "jo" },
    { char: "ビャ", romaji: "bya" }, { char: "ビュ", romaji: "byu" }, { char: "ビョ", romaji: "byo" },
    { char: "ピャ", romaji: "pya" }, { char: "ピュ", romaji: "pyu" }, { char: "ピョ", romaji: "pyo" }
];

var selectedAlphabet = [];
var currentChar = {};
var correctStreak = 0;
var highScore = 0;
var highScores = {};
var selectedBasic = [];
var selectedDakuten = [];
var selectedCombinations = [];
var includeDakuten = false;
var includeCombinations = false;
var checkingMode = 'self';
var waitingForNext = false;
var selectedAlphabetName = '';
var modeKey = '';
var learningMode = 'endless';
var remainingCharacters = [];
var incorrectCharacters = [];
var totalQuestions = 0;
var correctAnswers = 0;
var incorrectAnswers = 0;
var timeLimit = 10;
var timerInterval;
var isMultipleChoice = false;
var totalCharacters = 0; // Für die Fortschrittsleiste
var correctlyAnsweredCharacters = []; // Für einzigartige korrekt beantwortete Zeichen

var modes = [];
var alphabets = ['hiragana', 'katakana'];
var dakutenOptions = [false, true];
var combinationsOptions = [false, true];

for (var i = 0; i < alphabets.length; i++) {
    for (var j = 0; j < dakutenOptions.length; j++) {
        for (var k = 0; k < combinationsOptions.length; k++) {
            var key = alphabets[i] + '_' + (dakutenOptions[j] ? 'dakuten' : 'no_dakuten') + '_' + (combinationsOptions[k] ? 'combinations' : 'no_combinations');
            var name = (alphabets[i] === 'hiragana' ? 'Hiragana' : 'Katakana') + ', ' +
                (dakutenOptions[j] ? 'mit Dakuten' : 'ohne Dakuten') + ', ' +
                (combinationsOptions[k] ? 'mit Kombinationen' : 'ohne Kombinationen');
            modes.push({ key: key, name: name });
        }
    }
}

function loadHighScores() {
    var storedHighScores = localStorage.getItem('highScores');
    if (storedHighScores) {
        highScores = JSON.parse(storedHighScores);
    } else {
        highScores = {};
    }
}

function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function displayHighScores() {
    var highScoresTable = document.getElementById('highScoresTable');
    var tableHTML = '<table><tr><th>Modus</th><th>Highscore</th></tr>';

    for (var i = 0; i < modes.length; i++) {
        var mode = modes[i];
        var score = highScores[mode.key] || 0;
        tableHTML += '<tr><td>' + mode.name + '</td><td>' + score + '</td></tr>';
    }

    tableHTML += '</table>';
    highScoresTable.innerHTML = tableHTML;
}

function resetHighScores() {
    if (confirm('Möchtest du wirklich alle Highscores zurücksetzen?')) {
        highScores = {};
        saveHighScores();
        displayHighScores();
        alert('Alle Highscores wurden zurückgesetzt.');
    }
}

function saveSettings() {
    var settings = {
        includeDakuten: document.getElementById('includeDakuten').checked,
        includeCombinations: document.getElementById('includeCombinations').checked,
        endlessMode: document.getElementById('endlessMode').checked,
        autoCheck: document.getElementById('autoCheck').checked,
        timeLimitCheck: document.getElementById('timeLimitCheck').checked,
        timeLimit: document.getElementById('timeLimit').value,
        learningModeSelect: document.getElementById('learningModeSelect').value
    };
    localStorage.setItem('settings', JSON.stringify(settings));
}

function loadSettings() {
    var storedSettings = localStorage.getItem('settings');
    if (storedSettings) {
        var settings = JSON.parse(storedSettings);
        document.getElementById('includeDakuten').checked = settings.includeDakuten;
        document.getElementById('includeCombinations').checked = settings.includeCombinations;
        document.getElementById('endlessMode').checked = settings.endlessMode;
        document.getElementById('autoCheck').checked = settings.autoCheck;
        document.getElementById('timeLimitCheck').checked = settings.timeLimitCheck;
        document.getElementById('timeLimit').value = settings.timeLimit;
        document.getElementById('learningModeSelect').value = settings.learningModeSelect;
    } else {
        document.getElementById('includeDakuten').checked = false;
        document.getElementById('includeCombinations').checked = false;
        document.getElementById('endlessMode').checked = false;
        document.getElementById('autoCheck').checked = true;
        document.getElementById('timeLimitCheck').checked = false;
        document.getElementById('timeLimit').value = 10;
        document.getElementById('learningModeSelect').value = 'practice';
    }
}

function startLearning(alphabet) {
    selectedAlphabetName = alphabet;
    if (alphabet === 'hiragana') {
        selectedBasic = hiraganaBasic.slice();
        selectedDakuten = hiraganaDakuten.slice();
        selectedCombinations = hiraganaCombinations.slice();
    } else if (alphabet === 'katakana') {
        selectedBasic = katakanaBasic.slice();
        selectedDakuten = katakanaDakuten.slice();
        selectedCombinations = katakanaCombinations.slice();
    } else if (alphabet === 'both') {
        selectedBasic = hiraganaBasic.concat(katakanaBasic);
        selectedDakuten = hiraganaDakuten.concat(katakanaDakuten);
        selectedCombinations = hiraganaCombinations.concat(katakanaCombinations);
    }

    includeDakuten = document.getElementById('includeDakuten').checked;
    includeCombinations = document.getElementById('includeCombinations').checked;
    checkingMode = document.getElementById('autoCheck').checked ? 'auto' : 'self';
    learningMode = document.getElementById('endlessMode').checked ? 'endless' : 'practice';
    var selectedLearningMode = document.getElementById('learningModeSelect').value;
    var timeLimitEnabled = document.getElementById('timeLimitCheck').checked;
    timeLimit = parseInt(document.getElementById('timeLimit').value);

    saveSettings();

    selectedAlphabet = selectedBasic.slice();
    if (includeDakuten) {
        selectedAlphabet = selectedAlphabet.concat(selectedDakuten);
    }
    if (includeCombinations) {
        selectedAlphabet = selectedAlphabet.concat(selectedCombinations);
    }

    if (selectedAlphabet.length === 0) {
        alert('Bitte wähle mindestens einen Zeichensatz aus.');
        return;
    }

    document.getElementById('selection').style.display = 'none';
    document.getElementById('learning').style.display = 'block';
    correctStreak = 0;
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    correctlyAnsweredCharacters = [];

    modeKey = selectedAlphabetName + '_' + (includeDakuten ? 'dakuten' : 'no_dakuten') + '_' + (includeCombinations ? 'combinations' : 'no_combinations');

    highScore = highScores[modeKey] || 0;

    updateScore();

    if (learningMode === 'practice') {
        remainingCharacters = shuffleArray(selectedAlphabet.slice());
        incorrectCharacters = [];
        totalCharacters = selectedAlphabet.length; // Für die Fortschrittsleiste
        document.getElementById('progress-container').style.display = 'block';
        updateProgressBar();
    } else {
        remainingCharacters = [];
        document.getElementById('progress-container').style.display = 'none';
    }

    if (selectedLearningMode === 'multipleChoice') {
        isMultipleChoice = true;
    } else {
        isMultipleChoice = false;
    }

    nextCharacter();

    var answerInput = document.getElementById('answer');
    answerInput.onkeydown = null;

    if (checkingMode === 'auto') {
        document.getElementById('correctButton').style.display = 'none';
        document.getElementById('incorrectButton').style.display = 'none';

        waitingForNext = false;

        answerInput.onkeydown = function(event) {
            if (event.key === 'Enter') {
                if (!waitingForNext) {
                    var userAnswer = document.getElementById('answer').value.trim().toLowerCase();
                    var correctAnswer = currentChar.romaji.toLowerCase();
                    if (isAnswerCorrect(userAnswer, correctAnswer)) {
                        markAnswer(true);
                    } else {
                        markAnswer(false, userAnswer);
                    }
                    waitingForNext = true;
                } else {
                    waitingForNext = false;
                    nextCharacter();
                }
            }
        };
    } else {
        document.getElementById('correctButton').style.display = 'inline-block';
        document.getElementById('incorrectButton').style.display = 'inline-block';

        answerInput.onkeydown = function(event) {
            if (event.key === 'Enter') {
                showAnswer();
            }
        };
    }
    answerInput.focus();
}

function updateScore() {
    document.getElementById('score').innerText = 'Richtige Antworten hintereinander: ' + correctStreak;
    document.getElementById('highscore').innerText = 'Dein Highscore: ' + highScore;
    if (totalQuestions > 0) {
        document.getElementById('statistics').innerText = 'Fragen beantwortet: ' + totalQuestions +
            ' | Richtig: ' + correctAnswers + ' | Falsch: ' + incorrectAnswers +
            ' | Erfolgsquote: ' + ((correctAnswers / totalQuestions) * 100).toFixed(1) + '%';
    } else {
        document.getElementById('statistics').innerText = '';
    }
}

function updateProgressBar() {
    var progressBar = document.getElementById('progress-bar');
    var progressPercent = (correctlyAnsweredCharacters.length / totalCharacters) * 100;
    progressBar.style.width = progressPercent + '%';
}

function nextCharacter() {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';
    if (learningMode === 'practice') {
        if (remainingCharacters.length === 0 && incorrectCharacters.length === 0) {
            alert('Du hast alle Zeichen korrekt beantwortet! Gute Arbeit!');
            goToStart();
            return;
        }
        if (remainingCharacters.length === 0 && incorrectCharacters.length > 0) {
            remainingCharacters = shuffleArray(incorrectCharacters.slice());
            incorrectCharacters = [];
        }
        currentChar = remainingCharacters.shift();
    } else {
        var randomIndex = Math.floor(Math.random() * selectedAlphabet.length);
        currentChar = selectedAlphabet[randomIndex];
    }

    totalQuestions++;
    updateScore();

    document.getElementById('question').innerText = currentChar.char;
    document.getElementById('answer').value = '';
    document.getElementById('answer').focus();
    document.getElementById('correctAnswer').innerText = '';
    waitingForNext = false;

    if (isMultipleChoice) {
        generateMultipleChoiceOptions();
    } else {
        document.getElementById('choices').style.display = 'none';
        document.getElementById('answer').style.display = 'inline-block';
    }

    if (document.getElementById('timeLimitCheck').checked) {
        startTimer();
    }
}

function isAnswerCorrect(userAnswer, correctAnswer) {
    return userAnswer === correctAnswer;
}

function markAnswer(isCorrect, userAnswer = '') {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';
    if (isCorrect) {
        correctStreak++;
        correctAnswers++;
        if (correctStreak > highScore) {
            highScore = correctStreak;
            highScores[modeKey] = highScore;
            saveHighScores();
        }
        document.getElementById('correctAnswer').innerText = 'Richtig!';
        document.getElementById('correctAnswer').className = 'correct';

        // Hinzugefügt: Zeichen zu korrekt beantworteten hinzufügen
        if (!correctlyAnsweredCharacters.includes(currentChar.char)) {
            correctlyAnsweredCharacters.push(currentChar.char);
        }
    } else {
        correctStreak = 0;
        incorrectAnswers++;
        var feedbackMessage = 'Falsch! Die richtige Antwort war: ' + currentChar.romaji;
        if (userAnswer && getSimilarity(userAnswer, currentChar.romaji) > 0.7) {
            feedbackMessage += ' | Tippfehler?';
        }
        document.getElementById('correctAnswer').innerText = feedbackMessage;
        document.getElementById('correctAnswer').className = 'incorrect';
        if (learningMode === 'practice') {
            incorrectCharacters.push(currentChar);
        }
    }
    updateScore();
    if (learningMode === 'practice') {
        updateProgressBar();
    }

    if (isMultipleChoice || checkingMode === 'self') {
        setTimeout(function() {
            nextCharacter();
        }, 2000);
    }
}

function showAnswer() {
    document.getElementById('correctAnswer').innerText = 'Die richtige Antwort ist: ' + currentChar.romaji;
    document.getElementById('correctAnswer').className = '';
}

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

function generateMultipleChoiceOptions() {
    var choicesDiv = document.getElementById('choices');
    choicesDiv.innerHTML = '';
    var options = [currentChar.romaji];
    while (options.length < 4) {
        var randomChar = selectedAlphabet[Math.floor(Math.random() * selectedAlphabet.length)].romaji;
        if (!options.includes(randomChar)) {
            options.push(randomChar);
        }
    }
    shuffleArray(options);
    for (var i = 0; i < options.length; i++) {
        var button = document.createElement('button');
        button.innerText = options[i];
        button.onclick = function() {
            if (this.innerText === currentChar.romaji) {
                markAnswer(true);
            } else {
                markAnswer(false, this.innerText);
            }
            waitingForNext = true;
        };
        choicesDiv.appendChild(button);
    }
    choicesDiv.style.display = 'block';
    document.getElementById('answer').style.display = 'none';
}

function getSimilarity(a, b) {
    var longer = a.length > b.length ? a : b;
    var shorter = a.length > b.length ? b : a;
    var longerLength = longer.length;
    if (longerLength === 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / longerLength;
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

function goToStart() {
    document.getElementById('learning').style.display = 'none';
    correctStreak = 0;
    highScore = 0;
    selectedAlphabet = [];
    selectedBasic = [];
    selectedDakuten = [];
    selectedCombinations = [];
    includeDakuten = false;
    includeCombinations = false;
    checkingMode = 'self';
    waitingForNext = false;
    selectedAlphabetName = '';
    modeKey = '';
    learningMode = 'endless';
    remainingCharacters = [];
    incorrectCharacters = [];
    totalQuestions = 0;
    correctAnswers = 0;
    incorrectAnswers = 0;
    timeLimit = 10;
    totalCharacters = 0;
    correctlyAnsweredCharacters = [];
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';

    document.getElementById('selection').style.display = 'block';
    displayHighScores();

    loadSettings();
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

window.onload = function() {
    loadHighScores();
    displayHighScores();

    loadSettings();

    document.getElementById('includeDakuten').addEventListener('change', saveSettings);
    document.getElementById('includeCombinations').addEventListener('change', saveSettings);
    document.getElementById('endlessMode').addEventListener('change', saveSettings);
    document.getElementById('autoCheck').addEventListener('change', saveSettings);
    document.getElementById('timeLimitCheck').addEventListener('change', saveSettings);
    document.getElementById('timeLimit').addEventListener('change', saveSettings);
    document.getElementById('learningModeSelect').addEventListener('change', saveSettings);

    // Hinzufügen des Event-Listeners für Strg + Q
    document.addEventListener('keydown', function(event) {
        if (event.ctrlKey && event.key.toLowerCase() === 'q') {
            if (document.getElementById('selection').style.display !== 'none') {
                startLearning('both');
            }
        }
    });
};
// Sounds laden und vorladen
const correctSound = new Audio('Sounds/right.mp3');
const wrongSound = new Audio('Sounds/wrong.mp3');
correctSound.load();
wrongSound.load();

document.addEventListener("DOMContentLoaded", function() {
    document.body.addEventListener("click", function() {
        correctSound.play().catch(error => console.log("Sound aktiviert nach User-Interaktion"));
        wrongSound.play().catch(error => console.log("Sound aktiviert nach User-Interaktion"));
    }, { once: true });
});

function markAnswer(isCorrect, userAnswer = '') {
    clearInterval(timerInterval);
    document.getElementById('timer').innerText = '';

    if (isCorrect) {
        correctStreak++;
        correctAnswers++;
        if (correctStreak > highScore) {
            highScore = correctStreak;
            highScores[modeKey] = highScore;
            saveHighScores();
        }
        document.getElementById('correctAnswer').innerText = 'Richtig!';
        document.getElementById('correctAnswer').className = 'correct';

        if (!correctlyAnsweredCharacters.includes(currentChar.char)) {
            correctlyAnsweredCharacters.push(currentChar.char);
        }

        // **Sound für richtige Antwort**
        correctSound.currentTime = 0;
        correctSound.play();

    } else {
        correctStreak = 0;
        incorrectAnswers++;
        var feedbackMessage = 'Falsch! Die richtige Antwort war: ' + currentChar.romaji;
        if (userAnswer && getSimilarity(userAnswer, currentChar.romaji) > 0.7) {
            feedbackMessage += ' | Tippfehler?';
        }
        document.getElementById('correctAnswer').innerText = feedbackMessage;
        document.getElementById('correctAnswer').className = 'incorrect';

        if (learningMode === 'practice') {
            incorrectCharacters.push(currentChar);
        }

        // **Sound für falsche Antwort**
        wrongSound.currentTime = 0;
        wrongSound.play();
    }

    updateScore();
    if (learningMode === 'practice') {
        updateProgressBar();
    }

    if (isMultipleChoice || checkingMode === 'self') {
        setTimeout(function() {
            nextCharacter();
        }, 2000);
    }
}


