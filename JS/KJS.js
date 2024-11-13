// Initialisiere die Kanji-Liste
let kanjiList = [];

// Funktion zum Laden der Kanji aus LocalStorage
function loadKanjiList() {
    const storedKanji = localStorage.getItem('kanjiList');
    if (storedKanji) {
        kanjiList = JSON.parse(storedKanji);
    } else {
        // Wenn nichts gespeichert ist, initialisiere mit Standard-Kanji
        kanjiList = [
            { kanji: '日', meaning: 'Tag, Sonne' },
            { kanji: '月', meaning: 'Mond, Monat' },
            { kanji: '山', meaning: 'Berg' },
            // Weitere Kanji hier hinzufügen
        ];
        saveKanjiList(); // Speichere die Standardliste in LocalStorage
    }
}

// Funktion zum Speichern der Kanji-Liste in LocalStorage
function saveKanjiList() {
    localStorage.setItem('kanjiList', JSON.stringify(kanjiList));
}

let currentKanjiIndex = 0;
let score = 0;
let isAnswerChecked = false;
let isEditing = false;
let currentEditIndex = null;

// Elemente auswählen
const startButton = document.getElementById('startButton');
const selectionDiv = document.getElementById('selection');
const learningDiv = document.getElementById('learning');
const addKanjiForm = document.getElementById('addKanjiForm');
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
const formTitle = document.getElementById('formTitle');

// Event Listener
startButton.addEventListener('click', startLearning);
submitButton.addEventListener('click', function() {
    if (!isAnswerChecked) {
        checkAnswer();
    } else {
        showKanji();
    }
});
backButton.addEventListener('click', goBack);
backButton2.addEventListener('click', goBack);
addKanjiButton.addEventListener('click', addKanji);
addKanjiLink.addEventListener('click', showAddKanjiForm);

// Event Listener für Enter-Taste im Antwortfeld
answerInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (!isAnswerChecked) {
            checkAnswer();
        } else {
            showKanji();
        }
    }
});

// Funktionen
function startLearning() {
    selectionDiv.style.display = 'none';
    learningDiv.style.display = 'block';
    currentKanjiIndex = 0;
    score = 0;
    isAnswerChecked = false;
    showKanji();
}

function showKanji() {
    isAnswerChecked = false;
    if (currentKanjiIndex < kanjiList.length) {
        questionDiv.textContent = kanjiList[currentKanjiIndex].kanji;
        answerInput.value = '';
        correctAnswerDiv.textContent = '';
        updateProgressBar();
        answerInput.focus();
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

    isAnswerChecked = true;
    currentKanjiIndex++;
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
    isAnswerChecked = false;

    if (isEditing) {
        isEditing = false;
        currentEditIndex = null;
        formTitle.textContent = 'Neues Kanji hinzufügen';
        addKanjiButton.textContent = 'Kanji hinzufügen';
        document.getElementById('kanjiInput').value = '';
        document.getElementById('meaningInput').value = '';
    }
}

function showAddKanjiForm() {
    selectionDiv.style.display = 'none';
    addKanjiForm.style.display = 'block';
    learningDiv.style.display = 'none';
}

function addKanji() {
    const kanjiInputValue = document.getElementById('kanjiInput').value.trim();
    const meaningInputValue = document.getElementById('meaningInput').value.trim();

    if (kanjiInputValue && meaningInputValue) {
        if (isEditing) {
            // Update existing Kanji
            kanjiList[currentEditIndex] = { kanji: kanjiInputValue, meaning: meaningInputValue };
            alert('Kanji aktualisiert!');
            isEditing = false;
            currentEditIndex = null;
            formTitle.textContent = 'Neues Kanji hinzufügen';
            addKanjiButton.textContent = 'Kanji hinzufügen';
        } else {
            // Add new Kanji
            kanjiList.push({ kanji: kanjiInputValue, meaning: meaningInputValue });
            alert('Kanji hinzugefügt!');
        }
        document.getElementById('kanjiInput').value = '';
        document.getElementById('meaningInput').value = '';
        saveKanjiList(); // Speichere die aktualisierte Liste
        displayKanjiList();
        // Zurück zur Auswahlseite
        goBack();
    } else {
        alert('Bitte sowohl Kanji als auch Bedeutung eingeben.');
    }
}

function displayKanjiList() {
    const kanjiListDisplay = document.getElementById('kanjiListDisplay');
    kanjiListDisplay.innerHTML = '';
    kanjiList.forEach((kanjiItem, index) => {
        const li = document.createElement('li');

        // Kanji Text
        const kanjiText = document.createElement('span');
        kanjiText.className = 'kanji-text';
        kanjiText.textContent = `${kanjiItem.kanji} - ${kanjiItem.meaning}`;

        // Button Gruppe
        const buttonGroup = document.createElement('div');
        buttonGroup.className = 'button-group';

        // Edit Button
        const editButton = document.createElement('button');
        editButton.textContent = 'Bearbeiten';
        editButton.className = 'edit-button';
        editButton.addEventListener('click', () => {
            editKanji(index);
        });

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.className = 'delete-button';
        deleteButton.addEventListener('click', () => {
            deleteKanji(index);
        });

        buttonGroup.appendChild(editButton);
        buttonGroup.appendChild(deleteButton);

        li.appendChild(kanjiText);
        li.appendChild(buttonGroup);
        kanjiListDisplay.appendChild(li);
    });
}

function editKanji(index) {
    isEditing = true;
    currentEditIndex = index;

    const kanjiItem = kanjiList[index];

    // Pre-fill the form with existing data
    document.getElementById('kanjiInput').value = kanjiItem.kanji;
    document.getElementById('meaningInput').value = kanjiItem.meaning;

    // Update form title and button text
    formTitle.textContent = 'Kanji bearbeiten';
    addKanjiButton.textContent = 'Kanji aktualisieren';

    // Show the form
    selectionDiv.style.display = 'none';
    addKanjiForm.style.display = 'block';
    learningDiv.style.display = 'none';
}

function deleteKanji(index) {
    if (confirm('Möchtest du dieses Kanji wirklich löschen?')) {
        kanjiList.splice(index, 1);
        saveKanjiList(); // Speichere die aktualisierte Liste
        displayKanjiList();
    }
}

// Kanji-Liste beim Laden der Seite anzeigen
window.onload = function() {
    loadKanjiList();
    displayKanjiList();
};
