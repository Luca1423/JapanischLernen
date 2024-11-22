// Initialisiere die Kanji-Liste und Gruppen
let kanjiList = [];
let groupList = [];

// Variable für die zufällig gemischte Kanji-Liste während des Lernens
let shuffledKanjiList = [];

// Funktion zum Laden der Kanji aus der JSON-Datei
async function loadKanjiData() {
    try {
        const response = await fetch('Json/kanjiData.json');
        const data = await response.json();
        kanjiList = data.kanji;
        generateGroupList();
        displayGroupCheckboxes();
        displayKanjiList();
    } catch (error) {
        console.error('Fehler beim Laden der Kanji-Daten:', error);
    }
}

// Funktion zum Generieren der Gruppenliste
function generateGroupList() {
    const groups = new Set();
    kanjiList.forEach(item => {
        if (item.group) {
            groups.add(item.group);
        }
    });
    groupList = Array.from(groups);
}

// Funktion zum Anzeigen der Gruppen-Checkboxen
function displayGroupCheckboxes() {
    const groupCheckboxesDiv = document.getElementById('groupCheckboxes');
    groupCheckboxesDiv.innerHTML = '';

    groupList.forEach(group => {
        const label = document.createElement('label');
        label.style.display = 'block';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = group;
        checkbox.checked = true; // Standardmäßig ausgewählt

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + group));

        groupCheckboxesDiv.appendChild(label);
    });
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

// Funktion zum Mischen eines Arrays (Fisher-Yates-Algorithmus)
function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // Solange es noch Elemente gibt
    while (0 !== currentIndex) {

        // Wähle ein verbleibendes Element
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // Und tausche es mit dem aktuellen Element
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Funktionen
function startLearning() {
    const selectedGroups = Array.from(document.querySelectorAll('#groupCheckboxes input[type="checkbox"]:checked')).map(cb => cb.value);

    if (selectedGroups.length === 0) {
        alert('Bitte wähle mindestens eine Gruppe aus.');
        return;
    }

    // Filtere die Kanji-Liste nach den ausgewählten Gruppen
    const filteredKanjiList = kanjiList.filter(item => selectedGroups.includes(item.group));

    if (filteredKanjiList.length === 0) {
        alert('Keine Kanji in den ausgewählten Gruppen gefunden.');
        return;
    }

    selectionDiv.style.display = 'none';
    learningDiv.style.display = 'block';
    currentKanjiIndex = 0;
    score = 0;
    isAnswerChecked = false;

    // Stelle sicher, dass das Eingabefeld und der Button sichtbar sind
    answerInput.style.display = 'inline-block';
    submitButton.style.display = 'inline-block';

    // Erstelle eine gemischte Kopie der Kanji-Liste
    shuffledKanjiList = shuffleArray(filteredKanjiList.slice());
    showKanji();
}

function showKanji() {
    isAnswerChecked = false;
    if (currentKanjiIndex < shuffledKanjiList.length) {
        questionDiv.textContent = shuffledKanjiList[currentKanjiIndex].kanji;
        answerInput.value = '';
        correctAnswerDiv.textContent = '';

        // Stelle sicher, dass das Eingabefeld und der Button sichtbar sind
        answerInput.style.display = 'inline-block';
        submitButton.style.display = 'inline-block';

        updateProgressBar();
        answerInput.focus();
    } else {
        questionDiv.textContent = 'Lernsession abgeschlossen!';
        answerInput.style.display = 'none';
        submitButton.style.display = 'none';
        correctAnswerDiv.textContent = '';
    }
    scoreDiv.textContent = `Punkte: ${score} / ${shuffledKanjiList.length}`;
}

function checkAnswer() {
    const userAnswer = answerInput.value.trim();
    const correctAnswer = shuffledKanjiList[currentKanjiIndex].meaning;

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
    const progress = (currentKanjiIndex / shuffledKanjiList.length) * 100;
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
        document.getElementById('groupInput').value = '';
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
    const groupInputValue = document.getElementById('groupInput').value.trim();

    if (kanjiInputValue && meaningInputValue && groupInputValue) {
        if (isEditing) {
            // Update existing Kanji
            kanjiList[currentEditIndex] = { kanji: kanjiInputValue, meaning: meaningInputValue, group: groupInputValue };
            alert('Kanji aktualisiert!');
            isEditing = false;
            currentEditIndex = null;
            formTitle.textContent = 'Neues Kanji hinzufügen';
            addKanjiButton.textContent = 'Kanji hinzufügen';
        } else {
            // Add new Kanji
            kanjiList.push({ kanji: kanjiInputValue, meaning: meaningInputValue, group: groupInputValue });
            alert('Kanji hinzugefügt!');
        }
        document.getElementById('kanjiInput').value = '';
        document.getElementById('meaningInput').value = '';
        document.getElementById('groupInput').value = '';
        updateKanjiData(); // Speichere die aktualisierte Liste
        generateGroupList();
        displayGroupCheckboxes();
        displayKanjiList();
        // Zurück zur Auswahlseite
        goBack();
    } else {
        alert('Bitte alle Felder ausfüllen.');
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
        kanjiText.textContent = `${kanjiItem.kanji} (${kanjiItem.group}) - ${kanjiItem.meaning}`;

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
    document.getElementById('groupInput').value = kanjiItem.group;

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
        updateKanjiData(); // Speichere die aktualisierte Liste
        generateGroupList();
        displayGroupCheckboxes();
        displayKanjiList();
    }
}

// Funktion zum Speichern der aktualisierten Kanji-Daten in die JSON-Datei (nur möglich mit Server)
function updateKanjiData() {
    // In einer realen Anwendung müssten hier API-Aufrufe gemacht werden, um die Daten auf dem Server zu aktualisieren.
    // Für lokale Tests speichern wir die Daten in localStorage.
    localStorage.setItem('kanjiData', JSON.stringify(kanjiList));
}

// Kanji-Liste beim Laden der Seite anzeigen
window.onload = function() {
    const storedKanjiData = localStorage.getItem('kanjiData');
    if (storedKanjiData) {
        kanjiList = JSON.parse(storedKanjiData);
        generateGroupList();
        displayGroupCheckboxes();
        displayKanjiList();
    } else {
        loadKanjiData();
    }
};
