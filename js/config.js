/**
 * A palette of base colors used for highlighting ranges.
 * These are used to generate the CSS classes.
 * @type {string[]}
 */
export const HIGHLIGHT_COLORS = [
    'rgba(79, 134, 247, 0.8)',  // Blue
    'rgba(46, 184, 134, 0.8)',  // Green
    'rgba(250, 173, 20, 0.8)',   // Orange
    'rgba(235, 87, 87, 0.8)',    // Red
    'rgba(187, 134, 252, 0.8)', // Purple
    'rgba(3, 201, 215, 0.8)'     // Teal
];

/**
 * An array of CSS class names derived from the color palette.
 * The renderer uses these classes to apply styles.
 * @type {string[]}
 */
export const HIGHLIGHT_CLASSES = HIGHLIGHT_COLORS.map((_, i) => `highlight-color-${i}`);