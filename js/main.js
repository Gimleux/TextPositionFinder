import { state, setText, setSinglePos, addRange, removeRange, updateRange } from './state.js';
import { renderOutput } from './renderer.js';
import { dom, getNewRangeElement } from './ui.js';

function updateAndRender() {
    setText(dom.mainTextInput.value);
    setSinglePos(dom.singlePosInput.value);

    document.querySelectorAll('.range-item').forEach(item => {
        const id = parseInt(item.dataset.id, 10);
        const startInput = item.querySelector('.range-start');
        const endInput = item.querySelector('.range-end');
        updateRange(id, startInput.value, endInput.value);
    });

    const outputHtml = renderOutput(state.text, state.singlePos, state.ranges);
    dom.outputContainer.innerHTML = outputHtml;
}

function handleAddRange() {
    const newRange = addRange();
    const rangeIndex = state.ranges.length - 1;
    const rangeElement = getNewRangeElement(newRange, rangeIndex);
    dom.rangeListContainer.appendChild(rangeElement);
}

function handleRangeListInteraction(e) {
    const target = e.target;

    if (target.classList.contains('remove-btn')) {
        const rangeItem = target.closest('.range-item');
        const id = parseInt(rangeItem.dataset.id, 10);
        removeRange(id);
        rangeItem.remove();
        updateAndRender();
    }

    if (target.classList.contains('range-start') || target.classList.contains('range-end')) {
        updateAndRender();
    }
}

function initialize() {
    dom.mainTextInput.addEventListener('input', updateAndRender);
    dom.singlePosInput.addEventListener('input', updateAndRender);
    dom.addRangeBtn.addEventListener('click', handleAddRange);
    dom.rangeListContainer.addEventListener('input', handleRangeListInteraction);
    dom.rangeListContainer.addEventListener('click', handleRangeListInteraction);

    dom.mainTextInput.value = "This is a sample text in a modular app.\n\nThe logic is now split into multiple files, which improves maintainability and reusability.\n\nTry highlighting position 50 or the range from 150 to 200.";
    handleAddRange();
    updateAndRender();
}

document.addEventListener('DOMContentLoaded', initialize);