import { HIGHLIGHT_CLASSES } from './config.js';

function escapeHtml(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function renderOutput(text, singlePos, ranges) {
    if (!text) {
        return '';
    }

    const escapedText = escapeHtml(text);

    const indices = new Set([0, text.length]);
    if (singlePos !== null && singlePos >= 0 && singlePos < text.length) {
        indices.add(singlePos);
        indices.add(singlePos + 1);
    }
    ranges.forEach(range => {
        if (range.start !== null && range.start < text.length) {
            indices.add(range.start);
        }
        if (range.end !== null && range.end <= text.length) {
            indices.add(range.end);
        }
    });

    const sortedIndices = Array.from(indices).sort((a, b) => a - b);

    let html = '';
    for (let i = 0; i < sortedIndices.length - 1; i++) {
        const start = sortedIndices[i];
        const end = sortedIndices[i + 1];

        if (start >= end) continue; // Skip empty segments

        const segmentText = escapedText.substring(start, end);
        const classes = [];

        if (singlePos !== null && start >= singlePos && end <= singlePos + 1) {
            classes.push('position-marker');
        }

        ranges.forEach((range, index) => {
            if (range.start !== null && range.end !== null && start >= range.start && end <= range.end) {
                const colorClass = HIGHLIGHT_CLASSES[index % HIGHLIGHT_CLASSES.length];
                // Avoid adding the base 'highlight' class if it's already there from another range
                if (!classes.includes('highlight')) {
                    classes.push('highlight');
                }
                classes.push(colorClass);
            }
        });

        if (classes.length > 0) {
            html += `<span class="${classes.join(' ')}">${segmentText}</span>`;
        } else {
            html += segmentText;
        }
    }

    return html;
}