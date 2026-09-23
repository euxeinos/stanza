// Глобальное состояние приложения в памяти браузера
let flatLines: { line_id: number; text: string }[] = [];
let currentLineIndex = 0;

// Элементы DOM
const setupScreen = document.getElementById('setup-screen')!;
const trainingScreen = document.getElementById('training-screen')!;
const poemInput = document.getElementById('poem-input') as HTMLTextAreaElement;
const poemTitleInput = document.getElementById('poem-title') as HTMLInputElement;
const poemIdInput = document.getElementById('poem-id-input') as HTMLInputElement;

const startBtn = document.getElementById('start-btn')!;
const loadBtn = document.getElementById('load-btn')!;

const contextLineEl = document.getElementById('context-line')!;
const userInput = document.getElementById('user-input') as HTMLInputElement;
const checkBtn = document.getElementById('check-btn')!;
const feedbackEl = document.getElementById('feedback')!;

// Функция активации экрана тренажера
function startTraining(stanzas: any) {
    // Важнейший момент: бэкенд возвращает иерархию (stanzas -> lines).
    // Мы превращаем её в плоский список строк для последовательного заучивания.
    flatLines = stanzas.flatMap((stanza: any) => stanza.lines);

    if (flatLines.length === 0) {
        alert("В этом стихе нет строк для заучивания!");
        return;
    }

    // Переключаем экраны
    setupScreen.classList.add('hidden');
    trainingScreen.classList.remove('hidden');

    currentLineIndex = 0;
    showCurrentStep();
}

// ВАРИАНТ А: Сохранение нового стиха через POST
startBtn.addEventListener('click', async () => {
    const text = poemInput.value;
    const title = poemTitleInput.value || "Без названия";
    if (!text.trim()) return;

    try {
        // 1. Отправляем на бэкенд для сохранения в БД
        const saveResponse = await fetch('http://127.0.0.1:8000/api/v1/poems', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text: text, title: title, author: "Неизвестный автор" })
        });

        if (!saveResponse.ok) throw new Error("Не удалось сохранить стих");
        const saveResult = await saveResponse.json();

        // 2. Сразу же запрашиваем этот стих по полученному id, чтобы убедиться, что он в базе
        const response = await fetch(`http://127.0.0.1:8000/api/v1/poems/${saveResult.poem_id}`);
        const poemData = await response.json();

        // 3. Запускаем
        startTraining(poemData.stanzas);

    } catch (error) {
        alert(`Ошибка интеграции: ${error}`);
    }
});

// ВАРИАНТ Б: Загрузка существующего стиха по ID через GET
loadBtn.addEventListener('click', async () => {
    const id = poemIdInput.value;
    if (!id) return;

    try {
        // Делаем GET запрос к нашему новому эндпоинту
        const response = await fetch(`http://127.0.0.1:8000/api/v1/poems/${id}`);

        if (response.status === 404) {
            alert("Стих с таким ID не найден в базе данных Stihos!");
            return;
        }
        if (!response.ok) throw new Error("Ошибка сервера");

        const poemData = await response.json();

        // Передаем блок stanzas в тренажер
        startTraining(poemData.stanzas);

    } catch (error) {
        alert(`Не удалось загрузить стих: ${error}`);
    }
});

// --- ЛОГИКА ТРЕНАЖЕРА (Остается прежней) ---

function showCurrentStep() {
    userInput.value = '';
    feedbackEl.classList.add('hidden');

    if (currentLineIndex === 0) {
        contextLineEl.textContent = 'Это первая строка, подсказок нет. Начните ввод!';
    } else {
        contextLineEl.textContent = flatLines[currentLineIndex - 1].text;
    }
    userInput.focus();
}

checkBtn.addEventListener('click', checkAnswer);
userInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') checkAnswer(); });

function checkAnswer() {
    const expected = flatLines[currentLineIndex].text.toLowerCase().trim();
    const actual = userInput.value.toLowerCase().trim();

    const cleanStr = (s: string) => s.replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "").replace(/\s+/g, " ");

    if (cleanStr(expected) === cleanStr(actual)) {
        currentLineIndex++;
        if (currentLineIndex < flatLines.length) {
            showCurrentStep();
        } else {
            alert('Поздравляю! Вы прошли первый цикл заучивания стиха из базы данных!');
            trainingScreen.classList.add('hidden');
            setupScreen.classList.remove('hidden');
        }
    } else {
        feedbackEl.classList.remove('hidden');
    }
}
