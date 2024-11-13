(function() {
    'use strict';

    // Beispiel-Kanji (Diese können durch tatsächliche Kanji ersetzt werden)
    const defaultKanji = {
        "N5 Kanji": [
            { kanji: "日", kunReading: "ひ, -び, -か", onReading: "ニチ, ジツ", meaning: "Tag, Sonne" },
            { kanji: "一", kunReading: "ひと-つ", onReading: "イチ", meaning: "eins" },
            { kanji: "国", kunReading: "くに", onReading: "コク", meaning: "Land" },
            { kanji: "人", kunReading: "ひと", onReading: "ジン, ニン", meaning: "Person" },
            { kanji: "年", kunReading: "とし", onReading: "ネン", meaning: "Jahr" }
        ],
        "N4 Kanji": [
            { kanji: "事", kunReading: "こと", onReading: "ジ, ズ", meaning: "Sache, Ereignis" },
            { kanji: "作", kunReading: "つく-る", onReading: "サク, サ", meaning: "machen, herstellen" },
            { kanji: "使", kunReading: "つか-う", onReading: "シ", meaning: "benutzen" },
            { kanji: "動", kunReading: "うご-く", onReading: "ドウ", meaning: "bewegen" },
            { kanji: "多", kunReading: "おお-い", onReading: "タ", meaning: "viel" }
        ]
    };

    // Kanji aus dem lokalen Speicher laden oder Standard-Kanji verwenden
    let kanjiData = JSON.parse(localStorage.getItem('kanjiData')) || defaultKanji;

    let selectedKanji = [];
    let currentKanji = {};
    let totalQuestions = 0;
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let timeLimit = 10;
    let timerInterval;
    let isMultipleChoice = false;
    let learningMode = 'practice';
    let remainingKanji = [];
    let incorrectKanji = [];
    let totalKanji = 0;
    let correctlyAnsweredKanji = [];
    let currentCategory = '';

    function populateCategoryButtons() {
        const categoryButtonsDiv = document.getElementById('categoryButtons');
        categoryButtonsDiv.innerHTML = '';
        for (const category in kanjiData) {
            const button = document.createElement('button');
            button.innerText = category;
            button.addEventListener('click', function() {
                startLearning(category);
            });
            categoryButtonsDiv.appendChild(button);
        }
    }

    function addNewKanji() {
        const kanji = document.getElementById('newKanji').value.trim();
        const kunReading = document.getElementById('newKunReading').value.trim();
        const onReading = document.getElementById('newOnReading').value.trim();
        const meaning = document.getElementById('newMeaning').value.trim();
        const category = document.getElementById('newCategory').value.trim();

        if (kanji && (kunReading || onReading) && meaning && category) {
            if (!kanjiData[category]) {
                kanjiData[category] = [];
            }
            kanjiData[category].push({
                kanji: kanji,
                kunReading: kunReading,
                onReading: onReading,
                meaning: meaning
            });
            // Kanji im lokalen Speicher speichern
            localStorage.setItem('kanjiData', JSON.stringify(kanjiData));

            // Formular zurücksetzen
            document.getElementById('newKanji').value = '';
            document.getElementById('newKunReading').value = '';
            document.getElementById('newOnReading').value = '';
            document.getElementById('newMeaning').value = '';
            document.getElementById('newCategory').value = '';

            // Kategorie-Buttons aktualisieren
            populateCategoryButtons();

            alert('Kanji erfolgreich hinzugefügt!');
        } else {
            alert('Bitte fülle alle erforderlichen Felder aus.');
        }
    }

    function startLearning(category) {
        currentCategory = category;
        selectedKanji = kanjiData[category];

        if (!selectedKanji || selectedKanji.length === 0) {
            alert('Keine Kanji in dieser Kategorie gefunden.');
            return;
        }

        learningMode = document.getElementById('learningModeSelect').value;
        const timeLimitEnabled = document.getElementById('timeLimitCheck').checked;
        timeLimit = parseInt(document.getElementById('timeLimit').value) || 10;

        document.getElementById('selection').style.display = 'none';
        document.getElementById('learning').style.display = 'block';

        totalQuestions = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        correctlyAnsweredKanji = [];

        if (learningMode === 'practice') {
            remainingKanji = shuffleArray([...selectedKanji]);
            incorrectKanji = [];
            totalKanji = selectedKanji.length;
            document.getElementById('progress-container').style.display = 'block';
            updateProgressBar();
        } else {
            remainingKanji = [];
            document.getElementById('progress-container').style.display = 'none';
        }

        isMultipleChoice = (learningMode === 'multipleChoice');

        nextKanji();
    }

    function updateScore() {
        document.getElementById('score').innerText = 'Richtige Antworten: ' + correctAnswers;
        if (totalQuestions > 0) {
            document.getElementById('statistics').innerText = 'Fragen beantwortet: ' + totalQuestions +
                ' | Richtig: ' + correctAnswers + ' | Falsch: ' + incorrectAnswers +
                ' | Erfolgsquote: ' + ((correctAnswers / totalQuestions) * 100).toFixed(1) + '%';
        } else {
            document.getElementById('statistics').innerText = '';
        }
    }

    function updateProgressBar() {
        const progressBar = document.getElementById('progress-bar');
        const progressPercent = (correctlyAnsweredKanji.length / totalKanji) * 100;
        progressBar.style.width = progressPercent + '%';
    }

    function nextKanji() {
        clearInterval(timerInterval);
        document.getElementById('timer').innerText = '';
        if (learningMode === 'practice') {
            if (remainingKanji.length === 0 && incorrectKanji.length === 0) {
                alert('Du hast alle Kanji korrekt beantwortet! Gute Arbeit!');
                goToStart();
                return;
            }
            if (remainingKanji.length === 0 && incorrectKanji.length > 0) {
                remainingKanji = shuffleArray([...incorrectKanji]);
                incorrectKanji = [];
            }
            currentKanji = remainingKanji.shift();
        } else {
            const randomIndex = Math.floor(Math.random() * selectedKanji.length);
            currentKanji = selectedKanji[randomIndex];
        }

        totalQuestions++;
        updateScore();

        document.getElementById('question').innerText = 'Wie lautet die Bedeutung von: ' + currentKanji.kanji +
            '\nKun\'yomi: ' + currentKanji.kunReading +
            '\nOn\'yomi: ' + currentKanji.onReading;
        document.getElementById('answer').value = '';
        document.getElementById('answer').focus();
        document.getElementById('correctAnswer').innerText = '';
        document.getElementById('correctAnswer').className = '';

        if (isMultipleChoice) {
            generateMultipleChoiceOptions();
        } else {
            document.getElementById('choices').style.display = 'none';
            document.getElementById('answer').style.display = 'inline-block';
            document.getElementById('answer').onkeydown = function(event) {
                if (event.key === 'Enter') {
                    checkAnswer();
                }
            };
        }

        if (document.getElementById('timeLimitCheck').checked) {
            startTimer();
        }
    }

    function checkAnswer() {
        const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
        const correctAnswer = currentKanji.meaning.toLowerCase();
        if (userAnswer === correctAnswer) {
            markAnswer(true);
        } else {
            markAnswer(false, userAnswer);
        }
    }

    function markAnswer(isCorrect, userAnswer = '') {
        clearInterval(timerInterval);
        document.getElementById('timer').innerText = '';
        if (isCorrect) {
            correctAnswers++;
            document.getElementById('correctAnswer').innerText = 'Richtig!';
            document.getElementById('correctAnswer').className = 'correct';

            // Kanji zu korrekt beantworteten hinzufügen
            if (!correctlyAnsweredKanji.includes(currentKanji.kanji)) {
                correctlyAnsweredKanji.push(currentKanji.kanji);
            }
        } else {
            incorrectAnswers++;
            const feedbackMessage = 'Falsch! Die richtige Antwort war: ' + currentKanji.meaning;
            document.getElementById('correctAnswer').innerText = feedbackMessage;
            document.getElementById('correctAnswer').className = 'incorrect';
            if (learningMode === 'practice') {
                incorrectKanji.push(currentKanji);
            }
        }
        updateScore();
        if (learningMode === 'practice') {
            updateProgressBar();
        }

        setTimeout(function() {
            nextKanji();
        }, 2000);
    }

    function showAnswer() {
        document.getElementById('correctAnswer').innerText = 'Die richtige Antwort ist: ' + currentKanji.meaning;
        document.getElementById('correctAnswer').className = '';
    }

    function startTimer() {
        let timeLeft = timeLimit;
        document.getElementById('timer').innerText = 'Zeit: ' + timeLeft + 's';
        timerInterval = setInterval(function() {
            timeLeft--;
            document.getElementById('timer').innerText = 'Zeit: ' + timeLeft + 's';
            if (timeLeft <= 0) {
                clearInterval(timerInterval);
                markAnswer(false);
            }
        }, 1000);
    }

    function generateMultipleChoiceOptions() {
        const choicesDiv = document.getElementById('choices');
        choicesDiv.innerHTML = '';
        let options = [currentKanji.meaning];
        while (options.length < 4) {
            const randomKanjiMeaning = selectedKanji[Math.floor(Math.random() * selectedKanji.length)].meaning;
            if (!options.includes(randomKanjiMeaning)) {
                options.push(randomKanjiMeaning);
            }
        }
        shuffleArray(options);
        options.forEach(function(option) {
            const button = document.createElement('button');
            button.innerText = option;
            button.addEventListener('click', function() {
                if (this.innerText === currentKanji.meaning) {
                    markAnswer(true);
                } else {
                    markAnswer(false, this.innerText);
                }
            });
            choicesDiv.appendChild(button);
        });
        choicesDiv.style.display = 'block';
        document.getElementById('answer').style.display = 'none';
    }

    function goToStart() {
        document.getElementById('learning').style.display = 'none';
        selectedKanji = [];
        currentKanji = {};
        totalQuestions = 0;
        correctAnswers = 0;
        incorrectAnswers = 0;
        remainingKanji = [];
        incorrectKanji = [];
        totalKanji = 0;
        correctlyAnsweredKanji = [];
        clearInterval(timerInterval);
        document.getElementById('timer').innerText = '';

        document.getElementById('selection').style.display = 'block';
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Elemente tauschen
        }
        return array;
    }

    window.addEventListener('load', function() {
        populateCategoryButtons();
        document.getElementById('timeLimitCheck').addEventListener('change', function() {
            document.getElementById('timeLimit').disabled = !this.checked;
        });
        document.getElementById('answer').addEventListener('keydown', function(event) {
            if (event.key === 'Enter') {
                checkAnswer();
            }
        });
    });
})();
