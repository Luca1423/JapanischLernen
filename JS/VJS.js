// Beispielvokabeln (Diese können durch tatsächliche Vokabeln ersetzt werden)
        var defaultVocabulary = {
            "Grundlegende Vokabeln": [
                { japanese: "猫", reading: "ねこ", meaning: "Katze" },
                { japanese: "犬", reading: "いぬ", meaning: "Hund" },
                { japanese: "本", reading: "ほん", meaning: "Buch" },
                { japanese: "水", reading: "みず", meaning: "Wasser" },
                { japanese: "食べる", reading: "たべる", meaning: "essen" }
            ],
            "Zahlen": [
                { japanese: "一", reading: "いち", meaning: "eins" },
                { japanese: "二", reading: "に", meaning: "zwei" },
                { japanese: "三", reading: "さん", meaning: "drei" },
                { japanese: "四", reading: "よん/し", meaning: "vier" },
                { japanese: "五", reading: "ご", meaning: "fünf" }
            ],
            "Begrüßungen": [
                { japanese: "こんにちは", reading: "こんにちは", meaning: "Hallo" },
                { japanese: "おはようございます", reading: "おはようございます", meaning: "Guten Morgen" },
                { japanese: "こんばんは", reading: "こんばんは", meaning: "Guten Abend" },
                { japanese: "さようなら", reading: "さようなら", meaning: "Auf Wiedersehen" },
                { japanese: "ありがとうございます", reading: "ありがとうございます", meaning: "Vielen Dank" }
            ]
        };

        // Vokabeln aus dem lokalen Speicher laden oder Standardvokabeln verwenden
        var vocabulary = JSON.parse(localStorage.getItem('vocabulary')) || defaultVocabulary;

        var selectedVocabulary = [];
        var currentWord = {};
        var totalQuestions = 0;
        var correctAnswers = 0;
        var incorrectAnswers = 0;
        var timeLimit = 10;
        var timerInterval;
        var isMultipleChoice = false;
        var learningMode = 'practice';
        var remainingWords = [];
        var incorrectWords = [];
        var totalWords = 0;
        var correctlyAnsweredWords = [];
        var currentCategory = '';

        function populateCategoryButtons() {
            var categoryButtonsDiv = document.getElementById('categoryButtons');
            categoryButtonsDiv.innerHTML = '';
            for (var category in vocabulary) {
                var button = document.createElement('button');
                button.innerText = category;
                button.onclick = (function(cat) {
                    return function() {
                        startLearning(cat);
                    }
                })(category);
                categoryButtonsDiv.appendChild(button);
            }
        }

        function addNewVocabulary() {
            var japanese = document.getElementById('newJapanese').value.trim();
            var reading = document.getElementById('newReading').value.trim();
            var meaning = document.getElementById('newMeaning').value.trim();
            var category = document.getElementById('newCategory').value.trim();

            if (japanese && reading && meaning && category) {
                if (!vocabulary[category]) {
                    vocabulary[category] = [];
                }
                vocabulary[category].push({
                    japanese: japanese,
                    reading: reading,
                    meaning: meaning
                });
                // Vokabeln im lokalen Speicher speichern
                localStorage.setItem('vocabulary', JSON.stringify(vocabulary));

                // Formular zurücksetzen
                document.getElementById('newJapanese').value = '';
                document.getElementById('newReading').value = '';
                document.getElementById('newMeaning').value = '';
                document.getElementById('newCategory').value = '';

                // Kategorie-Buttons aktualisieren
                populateCategoryButtons();

                alert('Vokabel erfolgreich hinzugefügt!');
            } else {
                alert('Bitte fülle alle Felder aus.');
            }
        }

        function startLearning(category) {
            currentCategory = category;
            selectedVocabulary = vocabulary[category];

            if (!selectedVocabulary || selectedVocabulary.length === 0) {
                alert('Keine Vokabeln in dieser Kategorie gefunden.');
                return;
            }

            learningMode = document.getElementById('learningModeSelect').value;
            var timeLimitEnabled = document.getElementById('timeLimitCheck').checked;
            timeLimit = parseInt(document.getElementById('timeLimit').value);

            document.getElementById('selection').style.display = 'none';
            document.getElementById('learning').style.display = 'block';

            totalQuestions = 0;
            correctAnswers = 0;
            incorrectAnswers = 0;
            correctlyAnsweredWords = [];

            if (learningMode === 'practice') {
                remainingWords = shuffleArray(selectedVocabulary.slice());
                incorrectWords = [];
                totalWords = selectedVocabulary.length;
                document.getElementById('progress-container').style.display = 'block';
                updateProgressBar();
            } else {
                remainingWords = [];
                document.getElementById('progress-container').style.display = 'none';
            }

            isMultipleChoice = (learningMode === 'multipleChoice');

            nextWord();
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
            var progressBar = document.getElementById('progress-bar');
            var progressPercent = (correctlyAnsweredWords.length / totalWords) * 100;
            progressBar.style.width = progressPercent + '%';
        }

        function nextWord() {
            clearInterval(timerInterval);
            document.getElementById('timer').innerText = '';
            if (learningMode === 'practice') {
                if (remainingWords.length === 0 && incorrectWords.length === 0) {
                    alert('Du hast alle Vokabeln korrekt beantwortet! Gute Arbeit!');
                    goToStart();
                    return;
                }
                if (remainingWords.length === 0 && incorrectWords.length > 0) {
                    remainingWords = shuffleArray(incorrectWords.slice());
                    incorrectWords = [];
                }
                currentWord = remainingWords.shift();
            } else {
                var randomIndex = Math.floor(Math.random() * selectedVocabulary.length);
                currentWord = selectedVocabulary[randomIndex];
            }

            totalQuestions++;
            updateScore();

            document.getElementById('question').innerText = 'Was bedeutet: ' + currentWord.japanese + ' (' + currentWord.reading + ')';
            document.getElementById('answer').value = '';
            document.getElementById('answer').focus();
            document.getElementById('correctAnswer').innerText = '';

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
            var userAnswer = document.getElementById('answer').value.trim().toLowerCase();
            var correctAnswer = currentWord.meaning.toLowerCase();
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

                // Hinzugefügt: Wort zu korrekt beantworteten hinzufügen
                if (!correctlyAnsweredWords.includes(currentWord.japanese)) {
                    correctlyAnsweredWords.push(currentWord.japanese);
                }
            } else {
                incorrectAnswers++;
                var feedbackMessage = 'Falsch! Die richtige Antwort war: ' + currentWord.meaning;
                document.getElementById('correctAnswer').innerText = feedbackMessage;
                document.getElementById('correctAnswer').className = 'incorrect';
                if (learningMode === 'practice') {
                    incorrectWords.push(currentWord);
                }
            }
            updateScore();
            if (learningMode === 'practice') {
                updateProgressBar();
            }

            setTimeout(function() {
                nextWord();
            }, 2000);
        }

        function showAnswer() {
            document.getElementById('correctAnswer').innerText = 'Die richtige Antwort ist: ' + currentWord.meaning;
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
                }
            }, 1000);
        }
        function generateMultipleChoiceOptions() {
            var choicesDiv = document.getElementById('choices');
            choicesDiv.innerHTML = '';
            var options = [currentWord.meaning];
            while (options.length < 4) {
                var randomWord = selectedVocabulary[Math.floor(Math.random() * selectedVocabulary.length)].meaning;
                if (!options.includes(randomWord)) {
                    options.push(randomWord);
                }
            }
            shuffleArray(options);
            for (var i = 0; i < options.length; i++) {
                var button = document.createElement('button');
                button.innerText = options[i];
                button.onclick = function() {
                    if (this.innerText === currentWord.meaning) {
                        markAnswer(true);
                    } else {
                        markAnswer(false, this.innerText);
                    }
                };
                choicesDiv.appendChild(button);
            }
            choicesDiv.style.display = 'block';
            document.getElementById('answer').style.display = 'none';
        }

        function goToStart() {
            document.getElementById('learning').style.display = 'none';
            selectedVocabulary = [];
            currentWord = {};
            totalQuestions = 0;
            correctAnswers = 0;
            incorrectAnswers = 0;
            remainingWords = [];
            incorrectWords = [];
            totalWords = 0;
            correctlyAnsweredWords = [];
            clearInterval(timerInterval);
            document.getElementById('timer').innerText = '';

            document.getElementById('selection').style.display = 'block';
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
            populateCategoryButtons();
        };