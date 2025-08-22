let nextRangeId = 0;

export const state = {
    text: '',
    singlePos: null,
    ranges: [] // { id, start, end }
};

export function setText(newText) {
    state.text = newText;
}

export function setSinglePos(newPos) {
    state.singlePos = newPos === '' || isNaN(newPos) ? null : parseInt(newPos, 10);
}

export function addRange() {
    const id = nextRangeId++;
    const newRange = { id, start: null, end: null };
    state.ranges.push(newRange);
    return newRange;
}

export function removeRange(id) {
    state.ranges = state.ranges.filter(range => range.id !== id);
}

export function updateRange(id, start, end) {
    const range = state.ranges.find(r => r.id === id);
    if (range) {
        range.start = start === '' || isNaN(start) ? null : parseInt(start, 10);
        range.end = end === '' || isNaN(end) ? null : parseInt(end, 10);
    }
}