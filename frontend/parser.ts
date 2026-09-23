// Описываем интерфейсы (контракты данных), прямо как схемы в Python
interface Line {
    line_id: number;
    text: string;
}

interface Stanza {
    stanza_id: number;
    lines: Line[];
}

export function parsePoem(rawText: string): Stanza[] {
    // 1. Разбиваем по строкам и очищаем пробелы (аналог splitlines + strip)
    const lines = rawText.split(/\r?\n/);
    const cleanedLines = lines.map(line => line.trim());

    const stanzas: Stanza[] = [];
    let currentStanzaLines: Line[] = [];
    let lineCounter = 1;
    let stanzaCounter = 1;

    for (const line of cleanedLines) {
        if (line === "") {
            // Если встретили пустую строку и буфер не пуст — сохраняем строфу
            if (currentStanzaLines.length > 0) {
                stanzas.push({
                    stanza_id: stanzaCounter,
                    lines: currentStanzaLines
                });
                stanzaCounter++;
                currentStanzaLines = []; // Очищаем буфер
            }
        } else {
            // Если строка с текстом — добавляем в буфер
            currentStanzaLines.push({
                line_id: lineCounter,
                text: line
            });
            lineCounter++;
        }
    }

    // Обработка "хвоста" текста
    if (currentStanzaLines.length > 0) {
        stanzas.push({
            stanza_id: stanzaCounter,
            lines: currentStanzaLines
        });
    }

    return stanzas;
}
