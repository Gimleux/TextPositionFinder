let nextRangeId = 0;

/**
 * The central state object for the entire application.
 * @property {string} text - The user's input text.
 * @property {number|null} singlePos - The index of the single character to highlight.
 * @property {Array<object>} ranges - An array of range objects, each with an id, start, and end.
 * @property {boolean} isEndInclusive - A global flag determining if range ends are inclusive.
 */
export const state = {
    text: '',
    singlePos: null,
    ranges: [],
    isEndInclusive: false
};

/**
 * Updates the text in the state.
 * @param {string} newText - The new text from the textarea.
 */
export function setText(newText) {
    state.text = newText;
}

/**
 * Updates the single position marker in the state.
 * @param {string|number} newPos - The new position from the input field.
 */
export function setSinglePos(newPos) {
    const parsedPos = parseInt(newPos, 10);
    state.singlePos = isNaN(parsedPos) ? null : parsedPos;
}

/**
 * Updates the global flag for range inclusivity.
 * @param {boolean} value - The new value from the toggle switch.
 */
export function setEndInclusivity(value) {
    state.isEndInclusive = value;
}

/**
 * Adds a new, empty range object to the state.
 * @returns {object} The newly created range object.
 */
export function addRange() {
    const id = nextRangeId++;
    const newRange = { id, start: null, end: null };
    state.ranges.push(newRange);
    return newRange;
}

/**
 * Removes a range from the state by its ID.
 * @param {number} id - The ID of the range to remove.
 */
export function removeRange(id) {
    state.ranges = state.ranges.filter(range => range.id !== id);
}

/**
 * Updates the start and end values of a specific range in the state.
 * @param {number} id - The ID of the range to update.
 * @param {string|number} start - The new start value.
 * @param {string|number} end - The new end value.
 */
export function updateRange(id, start, end) {
    const range = state.ranges.find(r => r.id === id);
    if (range) {
        const parsedStart = parseInt(start, 10);
        const parsedEnd = parseInt(end, 10);
        range.start = isNaN(parsedStart) ? null : parsedStart;
        range.end = isNaN(parsedEnd) ? null : parsedEnd;
    }
}