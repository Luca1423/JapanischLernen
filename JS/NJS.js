// Initialisiere ein Array zum Speichern der Gruppen und Notizen
let groups = [];

// Funktion zum Laden der Gruppen aus dem lokalen Speicher
function loadGroups() {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
        groups = JSON.parse(savedGroups);
    }
    displayGroups();
    updateGroupSelect();
}

// Funktion zum Speichern der Gruppen im lokalen Speicher
function saveGroups() {
    localStorage.setItem('groups', JSON.stringify(groups));
}

// Funktion zum Anzeigen der Gruppen und Notizen
function displayGroups() {
    const groupsContainer = document.getElementById('groupsContainer');
    groupsContainer.innerHTML = '';

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
        toggleButton.onclick = () => toggleGroup(groupIndex);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Gruppe löschen';
        deleteButton.onclick = () => deleteGroup(groupIndex);

        groupButtons.appendChild(toggleButton);
        groupButtons.appendChild(deleteButton);

        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupButtons);

        // Gruppenkopf klickbar machen
        groupHeader.onclick = (e) => {
            if (e.target === groupHeader || e.target === groupTitle) {
                toggleGroup(groupIndex);
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
        });
        groupContent.addEventListener('dragleave', () => {
            groupContent.classList.remove('drag-over');
        });
        groupContent.addEventListener('drop', (e) => {
            e.preventDefault();
            groupContent.classList.remove('drag-over');
            const noteIndex = e.dataTransfer.getData('text/plain');
            const sourceGroupIndex = e.dataTransfer.getData('group-index');
            moveNoteBetweenGroups(sourceGroupIndex, groupIndex, noteIndex);
        });

        group.notes.forEach((note, noteIndex) => {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-item';
            noteDiv.draggable = true;

            // Drag & Drop Events für die Notiz
            noteDiv.addEventListener('dragstart', (e) => {
                noteDiv.classList.add('dragging');
                e.dataTransfer.setData('text/plain', noteIndex);
                e.dataTransfer.setData('group-index', groupIndex);
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
            editButton.onclick = () => editNote(groupIndex, noteIndex);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Löschen';
            deleteButton.onclick = () => deleteNote(groupIndex, noteIndex);

            noteDiv.appendChild(title);
            noteDiv.appendChild(content);
            noteDiv.appendChild(editButton);
            noteDiv.appendChild(deleteButton);

            groupContent.appendChild(noteDiv);
        });

        groupDiv.appendChild(groupContent);
        groupsContainer.appendChild(groupDiv);
    });
}

// Funktion zum Aktualisieren des Gruppenauswahlfelds
function updateGroupSelect() {
    const groupSelect = document.getElementById('groupSelect');
    groupSelect.innerHTML = '';

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

    if (title && content && groupIndex !== null) {
        const group = groups[groupIndex];

        // Überprüfen, ob die Notiz bereits existiert
        const existingIndex = group.notes.findIndex(note => note.title === title);

        if (existingIndex >= 0) {
            // Notiz aktualisieren
            group.notes[existingIndex].content = content;
        } else {
            // Neue Notiz hinzufügen
            group.notes.push({ title, content });
        }

        saveGroups();
        displayGroups();
        titleInput.value = '';
        contentInput.value = '';
    } else {
        alert('Bitte gib einen Titel, Inhalt und eine Gruppe für die Notiz ein.');
    }
}

// Funktion zum Bearbeiten einer Notiz
function editNote(groupIndex, noteIndex) {
    const note = groups[groupIndex].notes[noteIndex];
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('groupSelect').value = groupIndex;
}

// Funktion zum Löschen einer Notiz
function deleteNote(groupIndex, noteIndex) {
    if (confirm('Möchtest du diese Notiz wirklich löschen?')) {
        groups[groupIndex].notes.splice(noteIndex, 1);
        saveGroups();
        displayGroups();
    }
}

// Funktion zum Verschieben einer Notiz zwischen Gruppen
function moveNoteBetweenGroups(sourceGroupIndex, targetGroupIndex, noteIndex) {
    const note = groups[sourceGroupIndex].notes[noteIndex];
    groups[sourceGroupIndex].notes.splice(noteIndex, 1);
    groups[targetGroupIndex].notes.push(note);
    saveGroups();
    displayGroups();
}

// Event Listener für den Speichern-Button
document.getElementById('saveNote').addEventListener('click', addOrUpdateNote);

// Event Listener für den Gruppe-erstellen-Button
document.getElementById('createGroup').addEventListener('click', addGroup);

// Gruppen und Notizen beim Laden der Seite anzeigen
window.onload = loadGroups;
