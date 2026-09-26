"use strict";
let flatLines = [];
let currentLineIndex = 0;
const setupScreen = document.getElementById('setup-screen');
const trainingScreen = document.getElementById('training-screen');
const poemInput = document.getElementById('poem-input');
const poemTitleInput = document.getElementById('poem-title');
const poemIdInput = document.getElementById('poem-id-input');
const startBtn = document.getElementById('start-btn');
const loadBtn = document.getElementById('load-btn');
const contextLineEl = document.getElementById('context-line');
const userInput = document.getElementById('user-input');
const checkBtn = document.getElementById('check-btn');
const feedbackEl = document.getElementById('feedback');
function startTraining(stanzas) {
    flatLines = stanzas.flatMap((stanza) => stanza.lines);
    if (flatLines.length === 0) {
        alert("No lines found");
        return;
    }
    setupScreen.classList.add('hidden');
    trainingScreen.classList.remove('hidden');
    currentLineIndex = 0;
    showCurrentStep();
}
function showCurrentStep() {
    userInput.value = '';
    feedbackEl.classList.add('hidden');
    if (currentLineIndex === 0) {
        contextLineEl.textContent = 'First line: start typing';
    }
    else {
        contextLineEl.textContent = flatLines[currentLineIndex - 1].text;
    }
    userInput.focus();
}
function checkAnswer() {
    const expected = flatLines[currentLineIndex].text.toLowerCase().trim();
    const actual = userInput.value.toLowerCase().trim();
    const cleanStr = (s) => s.replace(/[\p{P}\p{S}]/gu, "").replace(/\s+/g, " ");
    if (cleanStr(expected) === cleanStr(actual)) {
        currentLineIndex++;
        if (currentLineIndex < flatLines.length) {
            showCurrentStep();
        }
        else {
            alert('Congratulations!');
            trainingScreen.classList.add('hidden');
            setupScreen.classList.remove('hidden');
        }
    }
    else {
        feedbackEl.classList.remove('hidden');
    }
}
startBtn.addEventListener('click', async () => {
    const text = poemInput.value;
    const title = poemTitleInput.value || "Untitled";
    if (!text.trim())
        return;
    try {
        const saveResponse = await fetch('http://127.0.0.1:8000/api/v1/poems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, title: title, author: "Unknown author" })
        });
        if (!saveResponse.ok) {
            throw new Error("Poem not found");
        }
        const saveResult = await saveResponse.json();
        const response = await fetch(`http://127.0.0.1:8000/api/v1/poems/${saveResult.poem_id}`);
        const poemData = await response.json();
        startTraining(poemData.stanzas);
    }
    catch (error) {
        alert(`Integration error: ${error}`);
    }
});
loadBtn.addEventListener('click', async () => {
    const id = poemIdInput.value;
    if (!id)
        return;
    try {
        const response = await fetch(`http://127.0.0.1:8000/api/v1/poems/${id}`);
        if (response.status === 404) {
            alert("Poem not found in database");
            return;
        }
        if (!response.ok) {
            throw new Error("Server error");
        }
        const poemData = await response.json();
        startTraining(poemData.stanzas);
    }
    catch (error) {
        alert(`Unable to upload poem: ${error}`);
    }
});
checkBtn.addEventListener('click', checkAnswer);
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});
//# sourceMappingURL=app.js.map