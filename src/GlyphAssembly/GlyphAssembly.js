import SVGGlyph from "./SVGGlyph.js";

export default class GlyphAssembly {
  constructor(glyphAssemblySpec) {
    this.assembly = this.getAssembly(glyphAssemblySpec);
    this.svgGlyphArray = this.getSVGGlyphs(glyphAssemblySpec);
    this.mainAxis = this.getMainAxis(glyphAssemblySpec);
    this.crossAxis = this.getCrossAxis(this.mainAxis);
    this.italicsCorrection = this.getItalicsCorrection();
  }

  getItalicsCorrection() {
    return parseInt(this.assembly.ItalicsCorrection.Value.value, 10);
  }

  getSVGGlyphs(spec) {
    var svgGlyphArray = [];
    this.assembly.PartRecords.forEach(part => {
      let unicode = spec.fontData.glyphNameToUnicode[part.glyph.value];
      svgGlyphArray.push(
        new SVGGlyph(unicode, spec.fontData, this.getMainAxis(spec))
      );
    });
    return svgGlyphArray;
  }

  getAssembly(spec) {
    return spec.fontData.variants[spec.mode][spec.baseUnicode].GlyphAssembly;
  }

  getMainAxis(spec) {
    let mainAxisMap = {
      horizontal: "x",
      vertical: "y"
    };
    return mainAxisMap[spec.mode];
  }
  getCrossAxis(mainAxis) {
    let oppositeAxisMap = {
      x: "y",
      y: "x"
    };
    return oppositeAxisMap[mainAxis];
  }
}
