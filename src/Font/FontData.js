export class FontData {
    constructor(options) {
        this.fontFamily = options.fontFamily;
        this.glyphNameToUnicode = options.glyphNameToUnicode;
        this.unicodeToGlyphName = options.unicodeToGlyphName;
        this.asc = options.asc;
        this.des = options.des;
        this.upm = options.upm;
        this.glyphMetrics = options.glyphMetrics;
        this.svgPaths = options.svgPaths;
        this.italicCorrectionMap = options.italicCorrectionMap;
        this.variants = options.variants;
        this.MATH = options.MATH;
    }
}
