import {HIGHLIGHT_CLASSES} from './config.js';

/**
 * The main public function. Orchestrates the rendering process.
 * @param {string} text The full input text.
 * @param {number|null} singlePos The index of the single character to mark.
 * @param {Array<object>} ranges An array of range objects {start, end}.
 * @param {boolean} isEndInclusive Whether the end of a range is inclusive.
 * @returns {string} The generated HTML string.
 */
export function renderOutput(text, singlePos, ranges, isEndInclusive) {
    if (!text) {
        return '';
    }

    const effectiveRanges = isEndInclusive ? ranges.map(range => ({...range, end: range.end +1})) : ranges;

    const boundaryPoints = getBoundaryPoints(text.length, singlePos, effectiveRanges);
    const htmlParts = [];

    boundaryPoints.forEach((boundaryPoint, i) => {
        const start = boundaryPoints[i];
        const end = boundaryPoints[i + 1];

        if (start >= end) return;

        const segment = {start, end};
        const segmentText = escapeHtml(text.substring(start, end));
        const classes = getClassesForSegment(segment, singlePos, effectiveRanges);

        htmlParts.push(buildSegmentHtml(segmentText, classes));
    });

    return htmlParts.join('');
}

/**
 * Collects all unique start and end points from all markers into a sorted array.
 * @param {number} textLength The total length of the text.
 * @param {number|null} singlePos The single position marker.
 * @param {Array<object>} ranges The array of range objects.
 * @returns {number[]} A sorted array of unique boundary indices.
 */
function getBoundaryPoints(textLength, singlePos, ranges) {
    const points = new Set([0, textLength]);

    if (singlePos !== null && singlePos >= 0 && singlePos < textLength) {
        points.add(singlePos);
        points.add(singlePos + 1);
    }

    ranges.forEach(range => {
        if (range.start !== null && range.start < textLength) {
            points.add(range.start);
        }
        if (range.end !== null && range.end <= textLength) {
            points.add(range.end);
        }
    });

    return Array.from(points).sort((a, b) => a - b);
}

/**
 * Determines which CSS classes apply to a given text segment.
 * @param {{start: number, end: number}} segment The segment to check.
 * @param {number|null} singlePos The single position marker.
 * @param {Array<object>} ranges The array of range objects.
 * @returns {string[]} An array of applicable CSS class names.
 */
function getClassesForSegment(segment, singlePos, ranges) {
    const classes = [];

    // Check for single position marker
    if (singlePos !== null && segment.start >= singlePos && segment.end <= singlePos + 1) {
        classes.push('position-marker');
    }

    // Check for range highlights
    ranges.forEach((range, index) => {
        if (range.start !== null && range.end !== null) {
            if (segment.start >= range.start && segment.end <= range.end) {
                const colorClass = HIGHLIGHT_CLASSES[index % HIGHLIGHT_CLASSES.length];
                classes.push('highlight', colorClass);
            }
        }
    });

    return [...new Set(classes)];
}

/**
 * Wraps a text segment in a <span> with the given classes, if any.
 * @param {string} text The text content of the segment.
 * @param {string[]} classes The CSS classes to apply.
 * @returns {string} The HTML for the segment.
 */
function buildSegmentHtml(text, classes) {
    if (classes.length === 0) {
        return text;
    }
    return `<span class="${classes.join(' ')}">${text}</span>`;
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} text The text to escape.
 * @returns {string} The escaped text.
 */
function escapeHtml(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}