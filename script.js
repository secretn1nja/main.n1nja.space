// DOM Elements
const tagline = document.getElementById('tagline');
const secretTrigger = document.getElementById('secret-trigger');
const secretLink = document.getElementById('secret-link');
const passwordPrompt = document.getElementById('password-prompt');
const passwordInput = document.getElementById('password-input');
const passwordSubmit = document.getElementById('password-submit');
const passwordError = document.getElementById('password-error');
const secretContent = document.getElementById('secret-content');
const lockBtn = document.getElementById('lock-btn');
const notesArea = document.getElementById('notes-area');
const notesContent = document.getElementById('notes-content');
const saveNotesBtn = document.getElementById('save-notes');
const clearNotesBtn = document.getElementById('clear-notes');
const exportNotesBtn = document.getElementById('export-notes');
const notesStatus = document.getElementById('notes-status');

// Passwords (Change these!)
const PASSWORDS = {
    secretArea: "ninja",  // Main secret area
    readNotes: "peek",    // Read-only notes
    editNotes: "shadow",   // Editable notes
    decrypter: "decrypt",  // Decrypter
    lovePortal: "forever"  // Romantic
};

// State
let failedAttempts = 0;
const MAX_ATTEMPTS = 3;

// ======================
// INITIALIZATION
// ======================
function init() {
    typeWriterEffect();
    setupEventListeners();
    hideAllSecretAreas();
}

// ======================
// CORE FUNCTIONS
// ======================
function typeWriterEffect() {
    const text = "Digital stealth. Minimal presence.";
    let i = 0;

    function type() {
        if (i < text.length) {
            tagline.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    type();
}

function setupEventListeners() {
    // Secret access flow
    secretTrigger.addEventListener('click', toggleSecretLink);
    secretLink.addEventListener('click', showPasswordPrompt);
    passwordSubmit.addEventListener('click', handlePasswordSubmit);
    lockBtn.addEventListener('click', lockSecretArea);

    // Notes functionality
    saveNotesBtn.addEventListener('click', saveNotes);
    clearNotesBtn.addEventListener('click', confirmClearNotes);
    exportNotesBtn.addEventListener('click', exportNotes);

    // Allow Enter key in password field
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handlePasswordSubmit();
    });
}

// ======================
// SECURITY FUNCTIONS
// ======================
function toggleSecretLink() {
    secretLink.classList.toggle('hidden');
}

function showPasswordPrompt(e) {
    if (e) e.preventDefault();
    passwordPrompt.classList.remove('hidden');
    passwordInput.focus();
}

function handlePasswordSubmit() {
    const input = passwordInput.value.trim();

    if (input === PASSWORDS.secretArea) {
        unlockArea(secretContent);
    }
    else if (input === PASSWORDS.readNotes) {
        notesContent.readOnly = true;
        unlockArea(notesArea);
        loadNotes();
    }
    else if (input === PASSWORDS.editNotes) {
        notesContent.readOnly = false;
        unlockArea(notesArea);
        loadNotes();
    }
    else if (input === PASSWORDS.decrypter) {
        window.location.href = "decrypt.html";
    }
    else if (input === PASSWORDS.lovePortal) {
        window.location.href = "love.html";
    }
    else {
        handleFailedAttempt();
    }
}

function unlockArea(area) {
    hideAllSecretAreas();
    area.classList.remove('hidden');
    passwordInput.value = "";
    passwordError.textContent = "";
    failedAttempts = 0;
}

function handleFailedAttempt() {
    failedAttempts++;
    passwordInput.value = "";

    if (failedAttempts >= MAX_ATTEMPTS) {
        activateDecoyMode();
    } else {
        passwordError.textContent = `Access denied. (${MAX_ATTEMPTS - failedAttempts} attempts left)`;
    }
}

function activateDecoyMode() {
    passwordError.innerHTML = "⚠️ CORRUPTED DATA<br>Restoring backup...";
    passwordPrompt.classList.add('hidden');

    setTimeout(() => {
        notesArea.classList.remove('hidden');
        notesContent.value = "SYSTEM ERROR: Contact admin@n1nja.space";
        notesContent.readOnly = true;
    }, 1500);
}

function lockSecretArea() {
    secretContent.classList.add('hidden');
}

function hideAllSecretAreas() {
    passwordPrompt.classList.add('hidden');
    secretContent.classList.add('hidden');
    notesArea.classList.add('hidden');
}

// ======================
// NOTES FUNCTIONALITY
// ======================
function loadNotes() {
    const encryptedNotes = localStorage.getItem('ninjaNotes');
    notesContent.value = encryptedNotes ? atob(encryptedNotes) : "";
}

function saveNotes() {
    if (notesContent.readOnly) return;

    const notes = notesContent.value;
    localStorage.setItem('ninjaNotes', btoa(notes));
    showStatus("Notes saved at " + new Date().toLocaleTimeString());
}

function confirmClearNotes() {
    if (notesContent.readOnly || !notesContent.value) return;

    if (confirm("Permanently delete all notes?")) {
        notesContent.value = "";
        localStorage.removeItem('ninjaNotes');
        showStatus("Notes cleared");
    }
}

function exportNotes() {
    if (!notesContent.value) {
        showStatus("No notes to export");
        return;
    }

    const blob = new Blob([btoa(notesContent.value)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');

    a.href = url;
    a.download = `ninja_notes_${new Date().toISOString().slice(0, 10)}.ninja`;
    a.click();
    showStatus("Notes exported!");
}

function showStatus(message) {
    notesStatus.textContent = message;
    setTimeout(() => notesStatus.textContent = "", 3000);
}

/// OTHER FUNCTIONS ///

// Start everything
init();