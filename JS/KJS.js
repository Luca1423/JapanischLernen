// Initialisiere die Kanji-Liste und Gruppen
let kanjiList = [];
let groupList = [];

// Variable für die zufällig gemischte Kanji-Warteschlange während des Lernens
let kanjiQueue = [];

// Funktion zum Laden der Kanji aus der JSON-Datei
async function loadKanjiData() {
    try {
        const response = await fetch('JS/Json/kanjiData.json');
        if (!response.ok) {
            throw new Error(`HTTP-Fehler! Status: ${response.status}`);
        }
        const data = await response.json();
        kanjiList = data.kanji;
        generateGroupList();
        displayGroupCheckboxes();
        displayKanjiList();
    } catch (error) {
        console.error('Error loading Data:', error);
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
        checkbox.checked = true;

        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(' ' + group));

        groupCheckboxesDiv.appendChild(label);
    });
}

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

// EVENT Listener
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

// ENTER -> check oder nächstes Kanji
answerInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        if (!isAnswerChecked) {
            checkAnswer();
        } else {
            showKanji();
        }
    }
});

// Shuffle Array
function shuffleArray(array) {
    let currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

// Learning
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
    score = 0;
    isAnswerChecked = false;

    answerInput.style.display = 'inline-block';
    submitButton.style.display = 'inline-block';

    // Erstelle gemischte Warteschlange
    kanjiQueue = shuffleArray(filteredKanjiList.slice());

    progressBar.style.width = '0%';
    totalKanjiCount = kanjiQueue.length;

    showKanji();
}

let totalKanjiCount = 0;

function showKanji() {
    isAnswerChecked = false;
    if (kanjiQueue.length > 0) {
        const currentKanji = kanjiQueue[0];
        questionDiv.textContent = currentKanji.kanji;
        answerInput.value = '';
        correctAnswerDiv.textContent = '';

        answerInput.style.display = 'inline-block';
        submitButton.style.display = 'inline-block';
        answerInput.focus();
    } else {
        questionDiv.textContent = 'Lernsession abgeschlossen!';
        answerInput.style.display = 'none';
        submitButton.style.display = 'none';
        correctAnswerDiv.textContent = '';
        progressBar.style.width = '100%';
    }
    scoreDiv.textContent = `Punkte: ${score} / ${totalKanjiCount}`;
}

function checkAnswer() {
    const currentKanji = kanjiQueue.shift();
    const userAnswer = answerInput.value.trim();
    const correctAnswer = currentKanji.meaning;

    if (userAnswer === correctAnswer) {
        correctAnswerDiv.textContent = 'Richtig!';
        correctAnswerDiv.className = 'correct';
        score++;
        correctSound.currentTime = 0;
        correctSound.play();
    } else {
        correctAnswerDiv.textContent = `Falsch! Die richtige Antwort ist: ${correctAnswer}`;
        correctAnswerDiv.className = 'incorrect';
        kanjiQueue.push(currentKanji);
        wrongSound.currentTime = 0;
        wrongSound.play();
    }

    isAnswerChecked = true;
    updateProgressBar();
}

function updateProgressBar() {
    const answeredKanjiCount = totalKanjiCount - kanjiQueue.length;
    const progress = (answeredKanjiCount / totalKanjiCount) * 100;
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
        formTitle.textContent = 'Add new Kanji';
        addKanjiButton.textContent = 'Add Kanji';
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
            // Update
            kanjiList[currentEditIndex] = { kanji: kanjiInputValue, meaning: meaningInputValue, group: groupInputValue };
            alert('Kanji aktualisiert!');
            isEditing = false;
            currentEditIndex = null;
            formTitle.textContent = 'Add new Kanji';
            addKanjiButton.textContent = 'Add Kanji';
        } else {
            // Neu
            kanjiList.push({ kanji: kanjiInputValue, meaning: meaningInputValue, group: groupInputValue });
            alert('Kanji hinzugefügt!');
        }
        document.getElementById('kanjiInput').value = '';
        document.getElementById('meaningInput').value = '';
        document.getElementById('groupInput').value = '';
        updateKanjiData();
        generateGroupList();
        displayGroupCheckboxes();
        displayKanjiList();
        goBack();
    } else {
        alert('Bitte alle Felder ausfüllen.');
    }
}

// Gruppen-Zustände speichern/laden
function saveGroupStates(groupStates) {
    localStorage.setItem('groupStates', JSON.stringify(groupStates));
}
function loadGroupStates() {
    const states = localStorage.getItem('groupStates');
    return states ? JSON.parse(states) : {};
}

function displayKanjiList() {
    const kanjiListDisplay = document.getElementById('kanjiListDisplay');
    kanjiListDisplay.innerHTML = '';

    const groupMap = {};
    kanjiList.forEach((kanjiItem, index) => {
        if (!groupMap[kanjiItem.group]) {
            groupMap[kanjiItem.group] = [];
        }
        groupMap[kanjiItem.group].push({ ...kanjiItem, index });
    });

    const groupStates = loadGroupStates();

    for (const groupName in groupMap) {
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';
        groupHeader.textContent = groupName;

        const kanjiListDiv = document.createElement('ul');
        kanjiListDiv.className = 'kanji-group-list';

        if (groupStates[groupName] === 'expanded') {
            kanjiListDiv.style.display = 'block';
        } else {
            kanjiListDiv.style.display = 'none';
        }

        groupHeader.addEventListener('click', function() {
            if (kanjiListDiv.style.display === 'none') {
                kanjiListDiv.style.display = 'block';
                groupStates[groupName] = 'expanded';
            } else {
                kanjiListDiv.style.display = 'none';
                groupStates[groupName] = 'collapsed';
            }
            saveGroupStates(groupStates);
        });

        groupMap[groupName].forEach((kanjiItem) => {
            const li = document.createElement('li');
            const kanjiText = document.createElement('span');
            kanjiText.className = 'kanji-text';
            kanjiText.textContent = `${kanjiItem.kanji} - ${kanjiItem.meaning}`;

            const buttonGroup = document.createElement('div');
            buttonGroup.className = 'button-group';

            // Edit
            const editButton = document.createElement('button');
            editButton.textContent = 'Bearbeiten';
            editButton.className = 'edit-button';
            editButton.addEventListener('click', () => {
                editKanji(kanjiItem.index);
            });

            // Delete
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Löschen';
            deleteButton.className = 'delete-button';
            deleteButton.addEventListener('click', () => {
                deleteKanji(kanjiItem.index);
            });

            buttonGroup.appendChild(editButton);
            buttonGroup.appendChild(deleteButton);

            li.appendChild(kanjiText);
            li.appendChild(buttonGroup);
            kanjiListDiv.appendChild(li);
        });

        kanjiListDisplay.appendChild(groupHeader);
        kanjiListDisplay.appendChild(kanjiListDiv);
    }
}

function editKanji(index) {
    isEditing = true;
    currentEditIndex = index;

    const kanjiItem = kanjiList[index];
    document.getElementById('kanjiInput').value = kanjiItem.kanji;
    document.getElementById('meaningInput').value = kanjiItem.meaning;
    document.getElementById('groupInput').value = kanjiItem.group;

    formTitle.textContent = 'Kanji bearbeiten';
    addKanjiButton.textContent = 'Kanji aktualisieren';

    selectionDiv.style.display = 'none';
    addKanjiForm.style.display = 'block';
    learningDiv.style.display = 'none';
}

function deleteKanji(index) {
    if (confirm('Möchtest du dieses Kanji wirklich löschen?')) {
        const deletedKanji = kanjiList.splice(index, 1)[0];
        updateKanjiData();
        generateGroupList();
        displayGroupCheckboxes();
        displayKanjiList();

        const groupStates = loadGroupStates();
        const groupName = deletedKanji.group;
        const groupExists = kanjiList.some(item => item.group === groupName);
        if (!groupExists) {
            delete groupStates[groupName];
            saveGroupStates(groupStates);
        }
    }
}

function updateKanjiData() {
    localStorage.setItem('kanjiData', JSON.stringify(kanjiList));
}

// Laden der Kanji-Liste beim Start
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

// =======================
// === SOUND-LOGIK ====
// =======================
const correctSound = new Audio('Sounds/right.mp3');
const wrongSound = new Audio('Sounds/wrong.mp3');
correctSound.load();
wrongSound.load();

document.addEventListener("DOMContentLoaded", function() {
    let isSoundOn = localStorage.getItem("muteSound") !== "true";
    const muteContainer = document.getElementById("muteContainer");

    // Anfangszustand
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

// =======================
// === DARK MODE LOGIK ===
// =======================
document.addEventListener("DOMContentLoaded", function() {
    const darkModeSwitch = document.getElementById("darkModeSwitch");
    const darkModeStatusText = document.getElementById("darkModeStatusText");
    const body = document.body;

    let isDarkModeOn = (localStorage.getItem("darkMode") === "true");

    body.classList.toggle("dark-mode", isDarkModeOn);
    body.classList.toggle("dark-on", isDarkModeOn);
    body.classList.toggle("dark-off", !isDarkModeOn);
    updateDarkModeStatusText(isDarkModeOn);

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
