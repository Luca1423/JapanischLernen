// Initialisiere Arrays zum Speichern der Gruppen und ungruppierten Notizen
let groups = [];
let ungroupedNotes = [];

// Funktion zum Laden der Gruppen und ungruppierten Notizen aus dem lokalen Speicher
function loadGroups() {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
        try {
            const parsedGroups = JSON.parse(savedGroups);
            if (Array.isArray(parsedGroups)) {
                groups = parsedGroups;
            } else {
                console.error('Fehler: Gespeicherte Gruppen sind kein Array');
                groups = [];
            }
        } catch (e) {
            console.error('Fehler beim Parsen der gespeicherten Gruppen:', e);
            groups = [];
        }
    } else {
        groups = [];
    }

    const savedUngroupedNotes = localStorage.getItem('ungroupedNotes');
    if (savedUngroupedNotes) {
        try {
            const parsedNotes = JSON.parse(savedUngroupedNotes);
            if (Array.isArray(parsedNotes)) {
                ungroupedNotes = parsedNotes;
            } else {
                console.error('Fehler: Gespeicherte ungruppierte Notizen sind kein Array');
                ungroupedNotes = [];
            }
        } catch (e) {
            console.error('Fehler beim Parsen der ungruppierten Notizen:', e);
            ungroupedNotes = [];
        }
    } else {
        ungroupedNotes = [];
    }

    displayGroups();
    updateGroupSelect();
}

// Funktion zum Speichern der Gruppen und ungruppierten Notizen im lokalen Speicher
function saveGroups() {
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('ungroupedNotes', JSON.stringify(ungroupedNotes));
}

// Funktion zum Anzeigen der Gruppen und Notizen
function displayGroups() {
    const groupsContainer = document.getElementById('groupsContainer') || document.getElementById('noteList');
    groupsContainer.innerHTML = '';

    // Anzeige der ungruppierten Notizen
    if (ungroupedNotes.length > 0) {
        const ungroupedDiv = document.createElement('div');
        ungroupedDiv.className = 'group';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';

        const groupTitle = document.createElement('h2');
        groupTitle.className = 'group-title';
        groupTitle.textContent = 'Ungruppierte Notizen';

        // Ein- und Ausklapp-Button für ungruppierte Notizen
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Einklappen';
        toggleButton.onclick = () => {
            const contentDisplay = groupContent.style.display;
            if (contentDisplay === 'none') {
                groupContent.style.display = 'block';
                toggleButton.textContent = 'Einklappen';
            } else {
                groupContent.style.display = 'none';
                toggleButton.textContent = 'Ausklappen';
            }
        };

        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(toggleButton);
        ungroupedDiv.appendChild(groupHeader);

        const groupContent = document.createElement('div');
        groupContent.className = 'group-content';
        groupContent.style.display = 'block';

        // Drag & Drop Events für ungruppierte Notizen
        groupContent.addEventListener('dragover', (e) => {
            e.preventDefault();
            groupContent.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });
        groupContent.addEventListener('dragleave', () => {
            groupContent.classList.remove('drag-over');
        });
        groupContent.addEventListener('drop', (e) => {
            e.preventDefault();
            groupContent.classList.remove('drag-over');
            const data = e.dataTransfer.getData('text/plain');
            if (data) {
                const { noteIndex, sourceGroupIndex } = JSON.parse(data);
                moveNoteBetweenGroups(sourceGroupIndex, 'ungrouped', noteIndex);
            }
        });

        ungroupedNotes.forEach((note, noteIndex) => {
            const noteDiv = createNoteElement(note, noteIndex, 'ungrouped');
            groupContent.appendChild(noteDiv);
        });

        ungroupedDiv.appendChild(groupContent);
        groupsContainer.appendChild(ungroupedDiv);
    }

    // Anzeige der Gruppen und deren Notizen
    groups.forEach((group, groupIndex) => {
        // Erstelle das Gruppenelement
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';

        // Gruppenkopf mit Titel und Buttons
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';

        const groupTitle = document.createElement('h2');
        groupTitle.className = 'group-title';
        groupTitle.textContent = group.title;

        const groupButtons = document.createElement('div');
        groupButtons.className = 'group-buttons';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = group.collapsed ? 'Ausklappen' : 'Einklappen';
        toggleButton.onclick = (e) => {
            e.stopPropagation();
            toggleGroup(groupIndex);
            toggleButton.textContent = group.collapsed ? 'Ausklappen' : 'Einklappen';
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Gruppe löschen';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            deleteGroup(groupIndex);
        };

        groupButtons.appendChild(toggleButton);
        groupButtons.appendChild(deleteButton);

        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupButtons);

        // Gruppenkopf klickbar machen
        groupHeader.onclick = (e) => {
            if (e.target === groupHeader || e.target === groupTitle) {
                toggleGroup(groupIndex);
                toggleButton.textContent = group.collapsed ? 'Ausklappen' : 'Einklappen';
            }
        };

        groupDiv.appendChild(groupHeader);

        // Gruppennotizen
        const groupContent = document.createElement('div');
        groupContent.className = 'group-content';
        groupContent.style.display = group.collapsed ? 'none' : 'block';

        // Drag & Drop Events für die Gruppe
        groupContent.addEventListener('dragover', (e) => {
            e.preventDefault();
            groupContent.classList.add('drag-over');
            e.dataTransfer.dropEffect = 'move';
        });
        groupContent.addEventListener('dragleave', () => {
            groupContent.classList.remove('drag-over');
        });
        groupContent.addEventListener('drop', (e) => {
            e.preventDefault();
            groupContent.classList.remove('drag-over');
            const data = e.dataTransfer.getData('text/plain');
            if (data) {
                const { noteIndex, sourceGroupIndex } = JSON.parse(data);
                moveNoteBetweenGroups(sourceGroupIndex, groupIndex, noteIndex);
            }
        });

        group.notes.forEach((note, noteIndex) => {
            const noteDiv = createNoteElement(note, noteIndex, groupIndex);
            groupContent.appendChild(noteDiv);
        });

        groupDiv.appendChild(groupContent);
        groupsContainer.appendChild(groupDiv);
    });
}

// Hilfsfunktion zum Erstellen eines Notizelements
function createNoteElement(note, noteIndex, groupIndex) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    noteDiv.draggable = true;

    // Drag & Drop Events für die Notiz
    noteDiv.addEventListener('dragstart', (e) => {
        noteDiv.classList.add('dragging');
        const data = JSON.stringify({
            noteIndex: noteIndex,
            sourceGroupIndex: groupIndex
        });
        e.dataTransfer.setData('text/plain', data);
        e.dataTransfer.effectAllowed = 'move';
    });
    noteDiv.addEventListener('dragend', () => {
        noteDiv.classList.remove('dragging');
    });

    const title = document.createElement('h3');
    title.textContent = note.title;

    const content = document.createElement('p');
    content.textContent = note.content;

    const editButton = document.createElement('button');
    editButton.textContent = 'Bearbeiten';
    editButton.onclick = () => {
        if (groupIndex === 'ungrouped') {
            editUngroupedNote(noteIndex);
        } else {
            editNote(groupIndex, noteIndex);
        }
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Löschen';
    deleteButton.onclick = () => {
        if (groupIndex === 'ungrouped') {
            deleteUngroupedNote(noteIndex);
        } else {
            deleteNote(groupIndex, noteIndex);
        }
    };

    noteDiv.appendChild(title);
    noteDiv.appendChild(content);
    noteDiv.appendChild(editButton);
    noteDiv.appendChild(deleteButton);

    return noteDiv;
}

// Funktion zum Aktualisieren des Gruppenauswahlfelds
function updateGroupSelect() {
    const groupSelect = document.getElementById('groupSelect');
    if (!groupSelect) return;

    groupSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'Keine Gruppe';
    groupSelect.appendChild(defaultOption);

    groups.forEach((group, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = group.title;
        groupSelect.appendChild(option);
    });
}

// Funktion zum Hinzufügen einer neuen Gruppe
function addGroup() {
    const groupTitleInput = document.getElementById('groupTitle');
    const title = groupTitleInput.value.trim();

    if (title) {
        if (!Array.isArray(groups)) {
            console.error('Fehler: groups ist kein Array!');
            groups = [];
        }
        groups.push({
            title: title,
            notes: [],
            collapsed: false
        });
        saveGroups();
        displayGroups();
        updateGroupSelect();
        groupTitleInput.value = '';
    } else {
        alert('Bitte gib einen Namen für die Gruppe ein.');
    }
}

// Funktion zum Löschen einer Gruppe
function deleteGroup(groupIndex) {
    if (confirm('Möchtest du diese Gruppe wirklich löschen?')) {
        groups.splice(groupIndex, 1);
        saveGroups();
        displayGroups();
        updateGroupSelect();
    }
}

// Funktion zum Ein- oder Ausklappen einer Gruppe
function toggleGroup(groupIndex) {
    groups[groupIndex].collapsed = !groups[groupIndex].collapsed;
    saveGroups();
    displayGroups();
}

// Funktion zum Hinzufügen oder Aktualisieren einer Notiz
function addOrUpdateNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const groupSelect = document.getElementById('groupSelect');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const groupIndex = groupSelect.value;

    if (title && content) {
        if (groupIndex !== '') {
            // Notiz einer Gruppe zuweisen
            const group = groups[parseInt(groupIndex)];

            // Überprüfen, ob die Notiz bereits existiert
            const existingIndex = group.notes.findIndex(note => note.title === title);

            if (existingIndex >= 0) {
                // Notiz aktualisieren
                group.notes[existingIndex].content = content;
            } else {
                // Neue Notiz hinzufügen
                group.notes.push({ title, content });
            }
        } else {
            // Notiz ohne Gruppe
            const existingIndex = ungroupedNotes.findIndex(note => note.title === title);

            if (existingIndex >= 0) {
                // Notiz aktualisieren
                ungroupedNotes[existingIndex].content = content;
            } else {
                // Neue Notiz hinzufügen
                ungroupedNotes.push({ title, content });
            }
        }

        saveGroups();
        displayGroups();
        titleInput.value = '';
        contentInput.value = '';
        groupSelect.value = '';
    } else {
        alert('Bitte gib einen Titel und Inhalt für die Notiz ein.');
    }
}

// Funktion zum Bearbeiten einer Notiz
function editNote(groupIndex, noteIndex) {
    const note = groups[groupIndex].notes[noteIndex];
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('groupSelect').value = groupIndex.toString();
}

function editUngroupedNote(noteIndex) {
    const note = ungroupedNotes[noteIndex];
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('groupSelect').value = '';
}

// Funktion zum Löschen einer Notiz
function deleteNote(groupIndex, noteIndex) {
    if (confirm('Möchtest du diese Notiz wirklich löschen?')) {
        groups[groupIndex].notes.splice(noteIndex, 1);
        saveGroups();
        displayGroups();
    }
}

function deleteUngroupedNote(noteIndex) {
    if (confirm('Möchtest du diese Notiz wirklich löschen?')) {
        ungroupedNotes.splice(noteIndex, 1);
        saveGroups();
        displayGroups();
    }
}

// Funktion zum Verschieben einer Notiz zwischen Gruppen
function moveNoteBetweenGroups(sourceGroupIndex, targetGroupIndex, noteIndex) {
    noteIndex = parseInt(noteIndex);
    let note;

    // Notiz aus der Quellgruppe entfernen
    if (sourceGroupIndex === 'ungrouped') {
        note = ungroupedNotes.splice(noteIndex, 1)[0];
    } else {
        sourceGroupIndex = parseInt(sourceGroupIndex);
        note = groups[sourceGroupIndex].notes.splice(noteIndex, 1)[0];
    }

    // Notiz zur Zielgruppe hinzufügen
    if (targetGroupIndex === 'ungrouped') {
        ungroupedNotes.push(note);
    } else {
        targetGroupIndex = parseInt(targetGroupIndex);
        groups[targetGroupIndex].notes.push(note);
    }

    saveGroups();
    displayGroups();
}

// Event Listener initialisieren
window.addEventListener('DOMContentLoaded', function() {
    // Event Listener für den Speichern-Button
    document.getElementById('saveNote').addEventListener('click', addOrUpdateNote);

    // Event Listener für den Gruppe-erstellen-Button
    const createGroupButton = document.getElementById('createGroup');
    if (createGroupButton) {
        createGroupButton.addEventListener('click', addGroup);
    }

    // Gruppen und Notizen beim Laden der Seite anzeigen
    loadGroups();
});
