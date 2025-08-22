import { HIGHLIGHT_COLORS } from './config.js';

export const dom = {
    mainTextInput: document.getElementById('main-text'),
    singlePosInput: document.getElementById('single-pos'),
    rangeListContainer: document.getElementById('range-list'),
    addRangeBtn: document.getElementById('add-range-btn'),
    outputContainer: document.getElementById('output-container')
};

export function getNewRangeElement(range, index) {
    const rangeItem = document.createElement('div');
    rangeItem.className = 'range-item';
    rangeItem.dataset.id = range.id;

    const color = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];

    rangeItem.innerHTML = `
        <div class="range-color-indicator" style="background-color: ${color};"></div>
        <div class="range-inputs">
            <input type="number" class="range-start" min="0" placeholder="Start" aria-label="Start position of range ${index + 1}">
            <input type="number" class="range-end" min="0" placeholder="End" aria-label="End position of range ${index + 1}">
        </div>
        <button class="remove-btn" aria-label="Remove range ${index + 1}">&times;</button>
    `;
    return rangeItem;
}