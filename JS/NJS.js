// Initialize arrays to store groups and ungrouped notes
let groups = [];
let ungroupedNotes = [];

// Function to load groups and ungrouped notes from local storage
function loadGroups() {
    const savedGroups = localStorage.getItem('groups');
    if (savedGroups) {
        try {
            const parsedGroups = JSON.parse(savedGroups);
            if (Array.isArray(parsedGroups)) {
                groups = parsedGroups;
            } else {
                console.error('Error: Saved groups is not an array');
                groups = [];
            }
        } catch (e) {
            console.error('Error parsing the saved groups:', e);
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
                console.error('Error: Saved ungrouped notes is not an array');
                ungroupedNotes = [];
            }
        } catch (e) {
            console.error('Error parsing the ungrouped notes:', e);
            ungroupedNotes = [];
        }
    } else {
        ungroupedNotes = [];
    }

    displayGroups();
    updateGroupSelect();
}

// Function to save groups and ungrouped notes to local storage
function saveGroups() {
    localStorage.setItem('groups', JSON.stringify(groups));
    localStorage.setItem('ungroupedNotes', JSON.stringify(ungroupedNotes));
}

// Function to display groups and notes
function displayGroups() {
    const groupsContainer = document.getElementById('groupsContainer');
    if (!groupsContainer) return;
    groupsContainer.innerHTML = '';

    // Display ungrouped notes
    if (ungroupedNotes.length > 0) {
        const ungroupedDiv = document.createElement('div');
        ungroupedDiv.className = 'group';

        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';

        const groupTitle = document.createElement('h2');
        groupTitle.className = 'group-title';
        groupTitle.textContent = 'Ungrouped Notes';

        // Collapse/expand button for ungrouped notes
        const toggleButton = document.createElement('button');
        toggleButton.textContent = 'Collapse';
        toggleButton.onclick = () => {
            const contentDisplay = groupContent.style.display;
            if (contentDisplay === 'none') {
                groupContent.style.display = 'block';
                toggleButton.textContent = 'Collapse';
            } else {
                groupContent.style.display = 'none';
                toggleButton.textContent = 'Expand';
            }
        };

        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(toggleButton);
        ungroupedDiv.appendChild(groupHeader);

        const groupContent = document.createElement('div');
        groupContent.className = 'group-content';
        groupContent.style.display = 'block';

        // Drag & drop events for ungrouped notes
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

    // Display groups
    groups.forEach((group, groupIndex) => {
        const groupDiv = document.createElement('div');
        groupDiv.className = 'group';

        // Group header
        const groupHeader = document.createElement('div');
        groupHeader.className = 'group-header';

        const groupTitle = document.createElement('h2');
        groupTitle.className = 'group-title';
        groupTitle.textContent = group.title;

        const groupButtons = document.createElement('div');
        groupButtons.className = 'group-buttons';

        const toggleButton = document.createElement('button');
        toggleButton.textContent = group.collapsed ? 'Expand' : 'Collapse';
        toggleButton.onclick = (e) => {
            e.stopPropagation();
            toggleGroup(groupIndex);
            toggleButton.textContent = group.collapsed ? 'Expand' : 'Collapse';
        };

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete Group';
        deleteButton.onclick = (e) => {
            e.stopPropagation();
            deleteGroup(groupIndex);
        };

        groupButtons.appendChild(toggleButton);
        groupButtons.appendChild(deleteButton);

        groupHeader.appendChild(groupTitle);
        groupHeader.appendChild(groupButtons);

        // Klick auf Gruppen-Header
        groupHeader.onclick = (e) => {
            if (e.target === groupHeader || e.target === groupTitle) {
                toggleGroup(groupIndex);
                toggleButton.textContent = group.collapsed ? 'Expand' : 'Collapse';
            }
        };

        groupDiv.appendChild(groupHeader);

        // Group content
        const groupContent = document.createElement('div');
        groupContent.className = 'group-content';
        groupContent.style.display = group.collapsed ? 'none' : 'block';

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

// Helper function to create a note element
function createNoteElement(note, noteIndex, groupIndex) {
    const noteDiv = document.createElement('div');
    noteDiv.className = 'note-item';
    noteDiv.draggable = true;

    // Drag & drop
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
    editButton.textContent = 'Edit';
    editButton.onclick = () => {
        if (groupIndex === 'ungrouped') {
            editUngroupedNote(noteIndex);
        } else {
            editNote(groupIndex, noteIndex);
        }
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
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

// Update the group select field
function updateGroupSelect() {
    const groupSelect = document.getElementById('groupSelect');
    if (!groupSelect) return;

    groupSelect.innerHTML = '';

    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = 'No Group';
    groupSelect.appendChild(defaultOption);

    groups.forEach((group, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = group.title;
        groupSelect.appendChild(option);
    });
}

// Add a new group
function addGroup() {
    const groupTitleInput = document.getElementById('groupTitle');
    const title = groupTitleInput.value.trim();

    if (title) {
        if (!Array.isArray(groups)) {
            console.error('Error: groups is not an array!');
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
        alert('Please enter a name for the group.');
    }
}

// Delete a group
function deleteGroup(groupIndex) {
    if (confirm('Do you really want to delete this group?')) {
        groups.splice(groupIndex, 1);
        saveGroups();
        displayGroups();
        updateGroupSelect();
    }
}

// Collapse or expand a group
function toggleGroup(groupIndex) {
    groups[groupIndex].collapsed = !groups[groupIndex].collapsed;
    saveGroups();
    displayGroups();
}

// Add or update a note
function addOrUpdateNote() {
    const titleInput = document.getElementById('noteTitle');
    const contentInput = document.getElementById('noteContent');
    const groupSelect = document.getElementById('groupSelect');

    const title = titleInput.value.trim();
    const content = contentInput.value.trim();
    const groupIndex = groupSelect.value;

    if (title && content) {
        if (groupIndex !== '') {
            // In einer Gruppe
            const group = groups[parseInt(groupIndex)];
            const existingIndex = group.notes.findIndex(note => note.title === title);

            if (existingIndex >= 0) {
                group.notes[existingIndex].content = content;
            } else {
                group.notes.push({ title, content });
            }
        } else {
            // Ungrouped
            const existingIndex = ungroupedNotes.findIndex(note => note.title === title);
            if (existingIndex >= 0) {
                ungroupedNotes[existingIndex].content = content;
            } else {
                ungroupedNotes.push({ title, content });
            }
        }

        saveGroups();
        displayGroups();
        titleInput.value = '';
        contentInput.value = '';
        groupSelect.value = '';
    } else {
        alert('Please provide a title and content for the note.');
    }
}

// Edit a note (grouped)
function editNote(groupIndex, noteIndex) {
    const note = groups[groupIndex].notes[noteIndex];
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('groupSelect').value = groupIndex.toString();
}

// Edit a note (ungrouped)
function editUngroupedNote(noteIndex) {
    const note = ungroupedNotes[noteIndex];
    document.getElementById('noteTitle').value = note.title;
    document.getElementById('noteContent').value = note.content;
    document.getElementById('groupSelect').value = '';
}

// Delete a note (grouped)
function deleteNote(groupIndex, noteIndex) {
    if (confirm('Do you really want to delete this note?')) {
        groups[groupIndex].notes.splice(noteIndex, 1);
        saveGroups();
        displayGroups();
    }
}

// Delete a note (ungrouped)
function deleteUngroupedNote(noteIndex) {
    if (confirm('Do you really want to delete this note?')) {
        ungroupedNotes.splice(noteIndex, 1);
        saveGroups();
        displayGroups();
    }
}

// Move a note between groups
function moveNoteBetweenGroups(sourceGroupIndex, targetGroupIndex, noteIndex) {
    noteIndex = parseInt(noteIndex);
    let note;

    // Remove from source
    if (sourceGroupIndex === 'ungrouped') {
        note = ungroupedNotes.splice(noteIndex, 1)[0];
    } else {
        sourceGroupIndex = parseInt(sourceGroupIndex);
        note = groups[sourceGroupIndex].notes.splice(noteIndex, 1)[0];
    }

    // Add to target
    if (targetGroupIndex === 'ungrouped') {
        ungroupedNotes.push(note);
    } else {
        targetGroupIndex = parseInt(targetGroupIndex);
        groups[targetGroupIndex].notes.push(note);
    }

    saveGroups();
    displayGroups();
}

// Initialize event listeners
window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('saveNote').addEventListener('click', addOrUpdateNote);

    const createGroupButton = document.getElementById('createGroup');
    if (createGroupButton) {
        createGroupButton.addEventListener('click', addGroup);
    }

    // Load
    loadGroups();
});

/* ++++++++++++++++++++++++
   SOUND & DARK MODE STUFF
   ++++++++++++++++++++++++ */

// SOUNDS (richtig/falsch) => Falls du in Zukunft "richtige" oder "falsche" Interaktionen 
// in den Notizen hast, kannst du sie abspielen.
const correctSound = new Audio('Sounds/right.mp3');
const wrongSound = new Audio('Sounds/wrong.mp3');
correctSound.load();
wrongSound.load();

// SOUND SWITCH
document.addEventListener("DOMContentLoaded", function() {
    let isSoundOn = localStorage.getItem("muteSound") !== "true";
    const muteContainer = document.getElementById("muteContainer");

    // Anfangsstatus
    muteContainer.classList.toggle("sound-on", isSoundOn);
    muteContainer.classList.toggle("sound-muted", !isSoundOn);
    updateSoundStatus(isSoundOn);

    // Klick Handler
    document.getElementById("soundSwitch").addEventListener("click", function() {
        let newIsSoundOn = !muteContainer.classList.contains("sound-on");
        muteContainer.classList.toggle("sound-on", newIsSoundOn);
        muteContainer.classList.toggle("sound-muted", !newIsSoundOn);
        updateSoundStatus(newIsSoundOn);
        localStorage.setItem("muteSound", !newIsSoundOn);
    });
});

function updateSoundStatus(isSoundOn) {
    // Hier: Falls du je "korrekt" oder "falsch" in Notizen abfragen willst
    correctSound.muted = !isSoundOn;
    wrongSound.muted = !isSoundOn;
    document.getElementById("soundStatusText").innerText = isSoundOn ? "Sound is on" : "Sound is off";
}

// DARK MODE SWITCH
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
