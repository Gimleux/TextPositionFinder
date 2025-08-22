import { state, setText, setSinglePos, setEndInclusivity, addRange, removeRange, updateRange } from './state.js';
import { renderOutput } from './renderer.js';
import { dom, getNewRangeElement } from './ui.js';

/**
 * Reads all relevant values from the DOM and updates the central state.
 */
function syncStateFromUI() {
    setText(dom.mainTextInput.value);
    setSinglePos(dom.singlePosInput.value);
    setEndInclusivity(dom.globalInclusiveToggle.checked);

    document.querySelectorAll('.range-item').forEach(item => {
        const id = parseInt(item.dataset.id, 10);
        const startInput = item.querySelector('.range-start');
        const endInput = item.querySelector('.range-end');
        updateRange(id, startInput.value, endInput.value);
    });
}

/**
 * Renders the output display based on the current state.
 */
function render() {
    const outputHtml = renderOutput(state.text, state.singlePos, state.ranges, state.isEndInclusive);
    dom.outputContainer.innerHTML = outputHtml;
}

/**
 * A wrapper function that syncs state from the UI and then re-renders the display.
 */
function updateAndRender() {
    syncStateFromUI();
    render();
}

/**
 * Handles the click event for the "Add New Range" button.
 */
function handleAddRange() {
    const newRange = addRange();
    const rangeIndex = state.ranges.length - 1;
    const rangeElement = getNewRangeElement(newRange, rangeIndex);
    dom.rangeListContainer.appendChild(rangeElement);
}

/**
 * Handles interactions within the dynamic list of ranges using event delegation.
 * @param {Event} event - The event object from the listener.
 */
function handleRangeListInteraction(event) {
    const target = event.target;

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

/**
 * Binds all necessary event listeners to the DOM elements.
 */
function bindEventListeners() {
    dom.mainTextInput.addEventListener('input', updateAndRender);
    dom.singlePosInput.addEventListener('input', updateAndRender);
    dom.addRangeBtn.addEventListener('click', handleAddRange);
    dom.globalInclusiveToggle.addEventListener('change', updateAndRender);

    dom.rangeListContainer.addEventListener('input', handleRangeListInteraction);
    dom.rangeListContainer.addEventListener('click', handleRangeListInteraction);
}

/**
 * Initializes the application on page load.
 */
function initialize() {
    bindEventListeners();
    dom.mainTextInput.value = "This is a sample text in a refactored, modular app.\n\nThe logic is now split into clean, documented modules.\n\nTry highlighting position 50 or the range from 150 to 200.";
    handleAddRange();
    updateAndRender();
}

document.addEventListener('DOMContentLoaded', initialize);