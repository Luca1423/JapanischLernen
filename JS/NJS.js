// Initialisiere ein Array zum Speichern der Notizen
let notes = [];

// Funktion zum Laden der Notizen aus dem lokalen Speicher
function loadNotes() {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
        notes = JSON.parse(savedNotes);
    }
    displayNotes();
}

// Funktion zum Speichern der Notizen im lokalen Speicher
function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}

// Funktion zum Anzeigen der Notizen
function displayNotes() {
    const noteList = document.getElementById('noteList');
    noteList.innerHTML = '';

    notes.forEach((note, index) => {
        const noteDiv = document.createElement('div');
        noteDiv.className = 'note-item';

        const title = document.createElement('h3');
        title.textContent = note.title;

        const content = document.createElement('p');
        content.textContent = note.content;

        const editButton = document.createElement('button');
        editButton.textContent = 'Bearbeiten';
        editButton.onclick = () => editNote(index);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Löschen';
        deleteButton.onclick = () => deleteNote(index);

        noteDiv.appendChild(title);
        noteDiv.appendChild(content);
        noteDiv.appendChild(editButton);
        noteDiv.appendChild(deleteButton);

        noteList.appendChild(noteDiv);
    });
}

// Funktion zum Hinzufügen oder Aktualisieren einer Notiz
function addOrUpdateNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();

    if (title && content) {
        // Überprüfen, ob die Notiz bereits existiert
        const existingIndex = notes.findIndex(note => note.title === title);

        if (existingIndex >= 0) {
            // Notiz aktualisieren
            notes[existingIndex].content = content;
        } else {
            // Neue Notiz hinzufügen
            notes.push({ title, content });
        }

        saveNotes();
        displayNotes();
        titleInput.value = '';
        contentInput.value = '';
    } else {
        alert('Bitte gib einen Titel und Inhalt für die Notiz ein.');
    }
}

// Funktion zum Bearbeiten einer Notiz
function editNote(index) {
    const note = notes[index];
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
}

// Funktion zum Löschen einer Notiz
function deleteNote(index) {
    if (confirm('Möchtest du diese Notiz wirklich löschen?')) {
        notes.splice(index, 1);
        saveNotes();
        displayNotes();
    }
}

// Event Listener für den Speichern-Button
document.getElementById('saveNote').addEventListener('click', addOrUpdateNote);

// Notizen beim Laden der Seite anzeigen
window.onload = loadNotes;
