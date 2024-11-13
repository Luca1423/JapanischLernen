// Liste der Kanji-Zeichen
let kanjiList = [
    { kanji: '日', meaning: 'Tag, Sonne' },
    { kanji: '月', meaning: 'Mond, Monat' },
    { kanji: '山', meaning: 'Berg' },
    // Weitere Kanji hier hinzufügen
];

let currentKanjiIndex = 0;
let score = 0;

// Elemente auswählen
const startButton = document.getElementById('startButton');
const selectionDiv = document.getElementById('selection');
const learningDiv = document.getElementById('learning');
const addKanjiForm = document.getElementById('addKanjiForm');
const learnLink = document.getElementById('learnLink');
const addKanjiLink = document.getElementById('addKanjiLink');
const questionDiv = document.getElementById('question');
const answerInput = document.getElementById('answerInput');
const submitButton = document.getElementById('submitButton');
const correctAnswerDiv = document.getElementById('correctAnswer');
const scoreDiv = document.getElementById('score');
const progressBar = document.getElementById('progress-bar');
const backButton = document.getElementById('backButton');
const backButton2 = document.getElementById('backButton2');
const addKanjiButton = document.getElementById('addKanjiButton');

// Event Listener
startButton.addEventListener('click', startLearning);
submitButton.addEventListener('click', checkAnswer);
backButton.addEventListener('click', goBack);
backButton2.addEventListener('click', goBack);
addKanjiButton.addEventListener('click', addKanji);
learnLink.addEventListener('click', showLearning);
addKanjiLink.addEventListener('click', showAddKanjiForm);

function startLearning() {
    selectionDiv.style.display = 'none';
    learningDiv.style.display = 'block';
    currentKanjiIndex = 0;
    score = 0;
    showKanji();
}

function showKanji() {
    if (currentKanjiIndex < kanjiList.length) {
        questionDiv.textContent = kanjiList[currentKanjiIndex].kanji;
        answerInput.value = '';
        correctAnswerDiv.textContent = '';
        updateProgressBar();
    } else {
        questionDiv.textContent = 'Lernsession abgeschlossen!';
        answerInput.style.display = 'none';
        submitButton.style.display = 'none';
        correctAnswerDiv.textContent = '';
    }
    scoreDiv.textContent = `Punkte: ${score} / ${kanjiList.length}`;
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    const correctAnswer = kanjiList[currentKanjiIndex].meaning;

    if (userAnswer === correctAnswer) {
        correctAnswerDiv.textContent = 'Richtig!';
        correctAnswerDiv.className = 'correct';
        score++;
    } else {
        correctAnswerDiv.textContent = `Falsch! Die richtige Antwort ist: ${correctAnswer}`;
        correctAnswerDiv.className = 'incorrect';
    }

    currentKanjiIndex++;
    setTimeout(showKanji, 2000);
}

function updateProgressBar() {
    const progress = (currentKanjiIndex / kanjiList.length) * 100;
    progressBar.style.width = progress + '%';
}

function goBack() {
    learningDiv.style.display = 'none';
    addKanjiForm.style.display = 'none';
    selectionDiv.style.display = 'block';
    answerInput.style.display = 'block';
    submitButton.style.display = 'inline-block';
}

function showAddKanjiForm() {
    selectionDiv.style.display = 'none';
    addKanjiForm.style.display = 'block';
    learningDiv.style.display = 'none';
}

function showLearning() {
    selectionDiv.style.display = 'none';
    addKanjiForm.style.display = 'none';
    learningDiv.style.display = 'block';
    startLearning();
}

function addKanji() {
    const kanjiInput = document.getElementById('kanjiInput').value.trim();
    const meaningInput = document.getElementById('meaningInput').value.trim();

    if (kanjiInput && meaningInput) {
        kanjiList.push({ kanji: kanjiInput, meaning: meaningInput });
        alert('Kanji hinzugefügt!');
        document.getElementById('kanjiInput').value = '';
        document.getElementById('meaningInput').value = '';
    } else {
        alert('Bitte sowohl Kanji als auch Bedeutung eingeben.');
    }
}
