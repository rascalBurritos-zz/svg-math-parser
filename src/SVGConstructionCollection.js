import ExtendableGlyph from "./ExtendableGlyph.js";
import ExtendableRadical from "./Radicals/ExtendableRadical.js";
import GlyphAssembly from "./GlyphAssembly/GlyphAssembly.js";
import GlyphRadical from "./Radicals/GlyphRadical.js";

export default class SVGConstructionCollection {
  constructor(fontData) {
    this.collection = this.getSVGConstruction(fontData);
    this.radicals = this.generateRadicals(fontData);
    // this.debug(fontData);
  }

    getClean(){
        var clean = {};
        for(var mode in this.collection){
            clean[mode] =  {}
            for(var unicode in this.collection[mode]){
                clean[mode][unicode] = {}
                clean[mode][unicode].stringArray = this.collection[mode][unicode].stringArray;
                clean[mode][unicode].viewBox = this.collection[mode][unicode].viewBox;
            }
        }
        clean.radicals = {};
        for(var unicode in this.radicals){
            clean.radicals[unicode] = {};
            clean.radicals[unicode].stringArray = this.radicals[unicode].stringArray;
            clean.radicals[unicode].viewBox = this.radicals[unicode].viewBox;
        }
        return clean;
    }

  generateRadicals(fontData) {
    var unicode = "8730";
    let radicalVariants =
      fontData.variants.vertical[unicode].MathGlyphVariantRecord;
    let radicals = {}
    for (var variant of radicalVariants) {
        let unicode = fontData.glyphNameToUnicode[variant.VariantGlyph.value];
        radicals[unicode] = new GlyphRadical(
            unicode,
          fontData
        )
    }
    radicals.extended = new ExtendableRadical(fontData);
    return radicals;
  }

  debug(fontData) {
    //10503 dbl right arrow with back
    //8658 dbl right arrow wihtout back
    //9182 overbrace
    //8747 integral
    //8659 dbl arrow down no back
    //8261 weird dbl extend bracket
    //831 double bar horizontal
    let glyphSpec = { baseUnicode: "8261", mode: "vertical", fontData };
    let glyphAssembly = new GlyphAssembly(glyphSpec);
    let extendableGlyph = new ExtendableGlyph(glyphAssembly);
    console.log("svg Construction debug", extendableGlyph);
    // variantGroup[unicode] = extendableGlyph;
  }

  getSVGConstruction(fontData) {
    let collection = {};
    collection.horizontal = this.generateVariantGroup("horizontal", fontData);
    collection.vertical = this.generateVariantGroup("vertical", fontData);
    return collection;
  }

  generateVariantGroup(mode, fontData) {
    let variantGroup = {};
    for (var unicode in fontData.variants[mode]) {
      if (fontData.variants[mode][unicode].GlyphAssembly) {
        let glyphSpec = { baseUnicode: unicode, mode, fontData };
        let glyphAssembly = new GlyphAssembly(glyphSpec);
        let extendableGlyph = new ExtendableGlyph(glyphAssembly);
        variantGroup[unicode] = extendableGlyph;
      }
    }
    return variantGroup;
  }
}

// let glyphSpec = { baseUnicode: "8659", mode: "vertical", fontData };
// let glyphAssembly = new GlyphAssembly(glyphSpec);
// let g = new ExtendableGlyph(glyphAssembly);
// console.log(g);
// return glyph;
