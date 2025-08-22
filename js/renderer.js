import { HIGHLIGHT_COLORS } from './config.js';

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

    const effectiveRanges = isEndInclusive ? ranges.map(range => ({...range, end: range.end + 1})) : ranges;

    const boundaryPoints = getBoundaryPoints(text.length, singlePos, effectiveRanges);
    const htmlParts = [];

    boundaryPoints.forEach((boundaryPoint, i) => {
        const start = boundaryPoints[i];
        const end = boundaryPoints[i + 1];

        if (start >= end) return;

        const segment = {start, end};
        const segmentText = escapeHtml(text.substring(start, end));
        const styling = getStylingForSegment(segment, singlePos, effectiveRanges);

        htmlParts.push(buildSegmentHtml(segmentText, styling));
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
 * Generates a background style string from a list of colors.
 * If one color, returns a simple background-color.
 * If multiple, creates a striped linear gradient to show all colors.
 * @param {string[]} colors - Array of RGBA color strings from the config.
 * @returns {string} A CSS background style string.
 */
function createBackgroundStyle(colors) {
    // Use a lighter alpha for text highlighting for better readability.
    const highlightColors = colors.map(c => c.replace(', 0.8)', ', 0.3)'));

    if (highlightColors.length === 0) {
        return '';
    }
    if (highlightColors.length === 1) {
        return `background-color: ${highlightColors[0]};`;
    }

    // Create a striped gradient for multiple overlapping ranges
    const gradientStops = highlightColors.map((color, i) => {
        const start = i * (100 / highlightColors.length);
        const end = (i + 1) * (100 / highlightColors.length);
        return `${color} ${start}%, ${color} ${end}%`;
    }).join(', ');

    return `background: linear-gradient(to bottom, ${gradientStops});`;
}

/**
 * Determines which CSS classes and inline styles apply to a given text segment.
 * @param {{start: number, end: number}} segment The segment to check.
 * @param {number|null} singlePos The single position marker.
 * @param {Array<object>} ranges The array of range objects.
 * @returns {{classes: string[], style: string}} An object with classes and an inline style string.
 */
function getStylingForSegment(segment, singlePos, ranges) {
    const classes = [];
    const activeColors = [];

    // Check for single position marker
    if (singlePos !== null && segment.start >= singlePos && segment.end <= singlePos + 1) {
        classes.push('position-marker');
    }

    // Check for range highlights and collect their colors
    ranges.forEach((range, index) => {
        if (range.start !== null && range.end !== null) {
            if (segment.start >= range.start && segment.end <= range.end) {
                const color = HIGHLIGHT_COLORS[index % HIGHLIGHT_COLORS.length];
                activeColors.push(color);
            }
        }
    });

    const style = createBackgroundStyle(activeColors);
    if (activeColors.length > 0) {
        classes.push('highlight');
    }

    return { classes: [...new Set(classes)], style };
}

/**
 * Wraps a text segment in a <span> with the given classes and styles, if any.
 * @param {string} text The text content of the segment.
 * @param {{classes: string[], style: string}} styling The styling to apply.
 * @returns {string} The HTML for the segment.
 */
function buildSegmentHtml(text, styling) {
    const { classes, style } = styling;
    if (classes.length === 0) {
        return text;
    }

    const classAttr = `class="${classes.join(' ')}"`;
    const styleAttr = style ? `style="${style}"` : '';

    return `<span ${classAttr} ${styleAttr}>${text}</span>`;
}

/**
 * Escapes HTML special characters to prevent XSS.
 * @param {string} text The text to escape.
 * @returns {string} The escaped text.
 */
function escapeHtml(text) {
    return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}