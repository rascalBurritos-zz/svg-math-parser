import { FontData } from "./FontData.js";
import FontParser from "../Helpers/FontParser.js";

export default function fontFactory(fontMetric) {
  var options = {};
  options.fontFamily = "Asana";
  var OS2 = fontMetric.FontMetric.OS_2;
  var head = fontMetric.FontMetric.head;
  //both decimal
  options.glyphNameToUnicode = fontMetric.FontMetric.unicodeDict;
  options.unicodeToGlyphName = swap(options.glyphNameToUnicode);

  // parameter bit 9 means  or bit 7 of ?big? endian
  //strongly recommended sTypo
  if (OS2.fsSelection.value.charAt(9) === "0") {
    options.asc = parseInt(OS2.usWinAscent.value, 10);
    options.des = parseInt(OS2.usWinDescent.value, 10);
  } else {
    options.asc = parseInt(OS2.sTypoAscender.value, 10);
    options.des = -parseInt(OS2.sTypoDescender.value, 10);
  }

  options.upm = parseInt(head.unitsPerEm.value, 10);
  var hexMetrics = fontMetric.FontMetric.GlyphMetrics;
  var hexSVGPaths = fontMetric.FontMetric.SVGPaths;
  options.glyphMetrics = {};
  options.svgPaths = {};
  for (var m in hexMetrics) {
    options.glyphMetrics[parseInt(m.slice(1), 16).toString(10)] = hexMetrics[m];
    options.svgPaths[parseInt(m.slice(1), 16).toString(10)] = hexSVGPaths[m];
  }
  options.MATH = fontMetric.FontMetric.MATH;

  var icInfo =
    fontMetric.FontMetric.MATH.MathGlyphInfo.MathItalicsCorrectionInfo;
  options.italicCorrectionMap = createUnicodeMap(
    icInfo.Coverage,
    icInfo.ItalicsCorrection,
    options.glyphNameToUnicode,
    (ele) => parseInt(ele.Value.value, 10)
  );
  var mathVariants = fontMetric.FontMetric.MATH.MathVariants;
  options.variants = { vertical: {}, horizontal: {} };
  options.variants.vertical = createUnicodeMap(
    mathVariants.VertGlyphCoverage,
    mathVariants.VertGlyphConstruction,
    options.glyphNameToUnicode,
    (ele) => {
      if (!Array.isArray(ele.MathGlyphVariantRecord)) {
        ele.MathGlyphVariantRecord = [ele.MathGlyphVariantRecord];
      }
      return ele;
    }
  );
  options.variants.horizontal = createUnicodeMap(
    mathVariants.HorizGlyphCoverage,
    mathVariants.HorizGlyphConstruction,
    options.glyphNameToUnicode,
    (ele) => {
      if (!Array.isArray(ele.MathGlyphVariantRecord)) {
        ele.MathGlyphVariantRecord = [ele.MathGlyphVariantRecord];
      }
      return ele;
    }
  );
  const fontAccentAttachment =
    fontMetric.FontMetric.MATH.MathGlyphInfo.MathTopAccentAttachment;
  options.accentAttachment = createUnicodeMap(
    fontAccentAttachment.TopAccentCoverage,
    fontAccentAttachment.TopAccentAttachment,
    options.glyphNameToUnicode,
    (ele) => {
      return FontParser.parseValue(ele);
    }
  );
  return options;
}
function createUnicodeMap(coverage, arrayMap, glyphNameToUnicode, myCallback) {
  var unicodeMap = {};

  for (const [index, element] of coverage.Glyph.entries()) {
    unicodeMap[glyphNameToUnicode[element.value]] = myCallback(arrayMap[index]);
  }
  return unicodeMap;
}
function swap(json) {
  var ret = {};
  for (var key in json) {
    ret[json[key]] = key;
  }
  return ret;
}
